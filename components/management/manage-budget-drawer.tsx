"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Plus, Trash2, Edit2, Check, X, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ManageBudgetDrawer({ onUpdate }: { onUpdate: () => void }) {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

    // New Item State
    const [newCategory, setNewCategory] = useState("");
    const [newLimit, setNewLimit] = useState("");

    const loadBudgets = async () => {
        const { data } = await supabase.from("budgets").select("*").order("created_at");
        if (data) setBudgets(data);
    };

    useEffect(() => {
        if (open) loadBudgets();
    }, [open]);

    const handleAdd = async () => {
        if (!newCategory || !newLimit) return;
        setLoading(true);

        // Normalize category id (simple slug)
        const id = newCategory.toLowerCase().replace(/\s+/g, '-');

        const { error } = await supabase.from("budgets").insert({
            category: id,
            limit_amount: parseInt(newLimit)
        });

        if (error) {
            toast.error("Error al crear. Quizás ya existe esa categoría.");
        } else {
            toast.success("Presupuesto creado");
            setNewCategory("");
            setNewLimit("");
            loadBudgets();
            onUpdate();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres borrar este presupuesto?")) return;

        const { error } = await supabase.from("budgets").delete().eq("id", id);
        if (error) toast.error("Error al borrar");
        else {
            toast.success("Borrado");
            loadBudgets();
            onUpdate();
        }
    };

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <Settings2 className="w-4 h-4 text-white" />
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-zinc-900 border-t border-zinc-800 flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-zinc-900 rounded-t-[10px] flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 mb-8" />

                        <h2 className="text-xl font-bold text-white mb-6">Gestionar Presupuestos</h2>

                        {/* Add New */}
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6 space-y-3">
                            <h3 className="text-sm text-zinc-400 font-medium">Crear Nuevo</h3>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Nombre (ej. Ropa)"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm w-full outline-none focus:border-zinc-600"
                                />
                                <input
                                    placeholder="Monto"
                                    type="number"
                                    value={newLimit}
                                    onChange={(e) => setNewLimit(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm w-24 outline-none focus:border-zinc-600"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="w-full bg-white text-black font-medium py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? "Guardando..." : "Agregar Presupuesto"}
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            {budgets.map((b) => (
                                <div key={b.id} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                    <div>
                                        <p className="text-white font-medium capitalize">{b.category.replace("-", " ")}</p>
                                        <p className="text-xs text-zinc-500">${parseInt(b.limit_amount).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(b.id)}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
