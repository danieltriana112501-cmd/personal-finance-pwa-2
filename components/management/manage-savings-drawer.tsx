"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Plus, Trash2, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ManageSavingsDrawer({ onUpdate }: { onUpdate: () => void }) {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

    // New Item State
    const [newName, setNewName] = useState("");
    const [newTarget, setNewTarget] = useState("");

    const loadGoals = async () => {
        const { data } = await supabase.from("savings_goals").select("*").order("created_at");
        if (data) setGoals(data);
    };

    useEffect(() => {
        if (open) loadGoals();
    }, [open]);

    const handleAdd = async () => {
        if (!newName || !newTarget) return;
        setLoading(true);

        const { error } = await supabase.from("savings_goals").insert({
            name: newName,
            target_amount: parseInt(newTarget),
            current_amount: 0
        });

        if (error) {
            toast.error("Error al crear la meta.");
        } else {
            toast.success("Meta de ahorro creada");
            setNewName("");
            setNewTarget("");
            loadGoals();
            onUpdate();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres borrar esta meta?")) return;

        const { error } = await supabase.from("savings_goals").delete().eq("id", id);
        if (error) toast.error("Error al borrar");
        else {
            toast.success("Borrada");
            loadGoals();
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

                        <h2 className="text-xl font-bold text-white mb-6">Gestionar Ahorros</h2>

                        {/* Add New */}
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6 space-y-3">
                            <h3 className="text-sm text-zinc-400 font-medium">Nueva Meta</h3>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Nombre (ej. Play 5)"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm w-full outline-none focus:border-zinc-600"
                                />
                                <input
                                    placeholder="Meta ($)"
                                    type="number"
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm w-24 outline-none focus:border-zinc-600"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={loading}
                                className="w-full bg-white text-black font-medium py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? "Guardando..." : "Crear Meta"}
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            {goals.map((g) => (
                                <div key={g.id} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                                    <div>
                                        <p className="text-white font-medium">{g.name}</p>
                                        <p className="text-xs text-zinc-500">Meta: ${parseInt(g.target_amount).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(g.id)}
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
