"use client";


import { cn } from "@/lib/utils";
import { CopyPlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ManageBudgetDrawer } from "@/components/management/manage-budget-drawer";

// Map category IDs to labels and colors (same as Dashboard)
const CATEGORY_META: Record<string, { label: string; color: string }> = {
    food: { label: "Comida", color: "bg-orange-500" },
    transport: { label: "Transp.", color: "bg-blue-500" },
    shopping: { label: "Compras", color: "bg-purple-500" },
    bills: { label: "Servicios", color: "bg-yellow-500" },
    coffee: { label: "Ocio", color: "bg-pink-500" },
    other: { label: "Otros", color: "bg-gray-500" },
};

import { useQuery } from "@tanstack/react-query";

export function BudgetCard() {
    const supabase = createClient();

    const { data: budgets = [], isLoading: loading } = useQuery({
        queryKey: ["transactions", "budgets", "budget-card-summary"],
        queryFn: async () => {
            // 1. Get Budget Limits
            const { data: budgetData } = await supabase.from("budgets").select("*");

            // 2. Get Transactions for this month (Simplified: just all expenses for now)
            // In prod: filter by date
            const { data: transactionData } = await supabase
                .from("transactions")
                .select("amount, category, type");

            if (!budgetData || !transactionData) return [];

            // 3. Aggregate Expenses by Category
            const expensesByCategory: Record<string, number> = {};
            transactionData.forEach((t: any) => {
                if (t.type === "expense") {
                    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount);
                }
            });

            // 4. Merge Data
            return budgetData.map((b) => {
                const spent = expensesByCategory[b.category] || 0;
                return {
                    ...b,
                    spent,
                    meta: CATEGORY_META[b.category] || CATEGORY_META["other"],
                };
            });
        }
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleInitializeDefaults = async () => {
        const defaults = [
            { category: "food", limit_amount: 800000 },
            { category: "transport", limit_amount: 400000 },
            { category: "shopping", limit_amount: 200000 },
            { category: "bills", limit_amount: 350000 },
            { category: "coffee", limit_amount: 150000 },
            { category: "other", limit_amount: 100000 },
        ];

        const { error } = await supabase.from("budgets").insert(defaults);
        if (error) {
            console.error(error);
            // toast.error("Error creating defaults"); // Removed to avoid missing import
        } else {
            // toast.success("Defaults created!");
            window.location.reload();
        }
    };

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-white" /></div>;

    if (budgets.length === 0) {
        return (
            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                    <CopyPlus className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-white font-medium">Sin Presupuestos</h3>
                    <p className="text-sm text-zinc-500 mt-1">Comienza controlando tus gastos.</p>
                </div>
                <button
                    onClick={handleInitializeDefaults}
                    className="w-full bg-white text-black font-medium py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                    Cargar Presupuestos Básicos
                </button>
                <div className="w-full pt-2 border-t border-zinc-800/50">
                    <ManageBudgetDrawer onUpdate={() => window.location.reload()} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wide">Presupuestos Mensuales</h3>
                <ManageBudgetDrawer onUpdate={() => window.location.reload()} />
            </div>

            <div className="space-y-4">
                {budgets.map((b, i) => {
                    const percent = Math.min((b.spent / b.limit_amount) * 100, 100);
                    const isOver = b.spent > b.limit_amount;

                    return (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-white font-medium flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", b.meta.color)} />
                                    {b.meta.label}
                                </span>
                                <span className={cn("text-xs font-mono", isOver ? "text-red-400" : "text-zinc-500")}>
                                    {formatCurrency(b.spent)} <span className="text-zinc-700">/</span> {formatCurrency(b.limit_amount)}
                                </span>
                            </div>
                            <div className="h-2 bg-black rounded-full overflow-hidden relative">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", b.meta.color, isOver && "bg-red-600")}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
