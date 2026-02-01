"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Delete, Banknote, Bus, ShoppingCart, Utensils, Coffee, Zap, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function FastTrackDashboard() {
    const [amount, setAmount] = useState<string>("0");
    const [mode, setMode] = useState<"expense" | "income">("expense");
    const [selectedCategory, setSelectedCategory] = useState("other");
    const queryClient = useQueryClient();

    // Client for writing data
    const supabase = createClient();

    const categories = [
        { id: "food", icon: Utensils, label: "Comida", color: "bg-orange-500" },
        { id: "transport", icon: Bus, label: "Transp.", color: "bg-blue-500" },
        { id: "shopping", icon: ShoppingCart, label: "Compras", color: "bg-purple-500" },
        { id: "bills", icon: Zap, label: "Servicios", color: "bg-yellow-500" },
        { id: "coffee", icon: Coffee, label: "Ocio", color: "bg-pink-500" },
        { id: "other", icon: Banknote, label: "Otros", color: "bg-gray-500" },
    ];

    const { mutate, isPending } = useMutation({
        mutationFn: async (newTransaction: any) => {
            const { error } = await supabase.from("transactions").insert(newTransaction);
            if (error) throw error;
        },
        networkMode: 'offlineFirst',
        onMutate: async (newTransaction) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["transactions"] });

            // Snapshot the previous value
            const previousTransactions = queryClient.getQueryData(["transactions"]);

            // Optimistically update to the new value
            queryClient.setQueryData(["transactions"], (old: any[] = []) => {
                return [
                    {
                        ...newTransaction,
                        id: Math.random().toString(), // Temporary ID
                        created_at: new Date().toISOString(),
                    },
                    ...old,
                ];
            });

            // Return a context object with the snapshotted value
            return { previousTransactions };
        },
        onError: (err, newTransaction, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(["transactions"], context?.previousTransactions);
            toast.error("Error al guardar", {
                description: "No se pudo sincronizar la transacción."
            });
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
        onSuccess: () => {
            // Optional: confirm sync? But we usually trust optimistic update.
        }
    });

    const handleDigit = (digit: string) => {
        if (amount === "0") {
            setAmount(digit);
        } else {
            if (amount.length < 9) {
                setAmount(amount + digit);
            }
        }
    };

    const handleDelete = () => {
        if (amount.length > 1) {
            setAmount(amount.slice(0, -1));
        } else {
            setAmount("0");
        }
    };

    const handleSubmit = () => {
        if (amount === "0") return;

        const rawAmount = parseInt(amount);

        const newTransaction = {
            amount: rawAmount,
            type: mode,
            category: selectedCategory,
            // Assuming the table structure, add necessary fields if any default values are needed mostly handled by DB
        };

        // Fire mutation
        mutate(newTransaction);

        // Immediate feedback for the user
        toast.success("¡Transacción guardada!");
        setAmount("0");
    };

    const formatCurrency = (val: string) => {
        const num = parseInt(val, 10);
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-black text-white p-4 max-w-md mx-auto relative overflow-hidden">
            {/* Header / Summary */}
            <div className="flex-1 flex flex-col justify-center items-center gap-2 mb-4">
                <h2 className="text-zinc-400 text-sm uppercase tracking-widest">
                    {mode === "expense" ? "Nuevo Gasto" : "Nuevo Ingreso"}
                </h2>
                <div className={cn(
                    "text-5xl font-bold transition-colors",
                    mode === "expense" ? "text-red-500" : "text-green-500"
                )}>
                    {formatCurrency(amount)}
                </div>

                {/* Toggle Mode */}
                <div className="flex gap-2 mt-4 bg-zinc-900 p-1 rounded-full">
                    <button
                        onClick={() => setMode("expense")}
                        className={cn(
                            "p-2 px-4 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            mode === "expense" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <TrendingDown className="w-4 h-4" /> Gasto
                    </button>
                    <button
                        onClick={() => setMode("income")}
                        className={cn(
                            "p-2 px-4 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            mode === "income" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" /> Ingreso
                    </button>
                </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-3 gap-2 mb-2 w-full max-h-[35vh] overflow-y-auto">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 transition-all p-2 rounded-xl border",
                            selectedCategory === cat.id ? "bg-zinc-800 border-zinc-600 scale-95" : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                        )}
                    >
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", cat.color)}>
                            <cat.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-300">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-2 pb-20 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleDigit(num.toString())}
                        className="h-14 text-xl font-semibold bg-transparent hover:bg-zinc-900 rounded-full transition-colors text-zinc-200"
                    >
                        {num}
                    </button>
                ))}
                <button
                    className="h-14 text-xl font-semibold bg-transparent hover:bg-zinc-900 rounded-full transition-colors text-zinc-500"
                    onClick={() => setAmount("0")} // Clear
                >
                    C
                </button>
                <button
                    onClick={() => handleDigit("0")}
                    className="h-14 text-xl font-semibold bg-transparent hover:bg-zinc-900 rounded-full transition-colors text-zinc-200"
                >
                    0
                </button>
                <button
                    onClick={handleDelete}
                    className="h-14 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
                >
                    <Delete className="w-5 h-5" />
                </button>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-6 right-6 z-10">
                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
}
