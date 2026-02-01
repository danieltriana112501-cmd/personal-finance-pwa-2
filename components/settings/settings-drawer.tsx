"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { Settings, Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SettingsDrawer() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const supabase = createClient();

    const handleReset = async () => {
        if (!confirm("ESTO BORRARÁ TODO (Gastos, Presupuestos, Ahorros). ¿Estás 100% seguro?")) return;

        setLoading(true);

        try {
            // 1. Delete Transactions
            await supabase.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to delete all
            // 2. Delete Budgets
            await supabase.from("budgets").delete().neq("id", "00000000-0000-0000-0000-000000000000");
            // 3. Delete Savings
            await supabase.from("savings_goals").delete().neq("id", "00000000-0000-0000-0000-000000000000");

            toast.success("Sistema reiniciado de fábrica.");
            window.location.reload();

        } catch (e) {
            toast.error("Error al reiniciar.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Ajustes</span>
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-zinc-900 border-t border-zinc-800 flex flex-col rounded-t-[10px] h-[40vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-6 bg-zinc-900 rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 mb-8" />

                        <h2 className="text-xl font-bold text-white mb-6">Configuración</h2>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 space-y-4">
                                <div className="flex items-center gap-3 text-red-500">
                                    <AlertTriangle className="w-5 h-5" />
                                    <h3 className="font-bold">Zona de Peligro</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Si quieres empezar de cero, usa este botón. Cuidado, no hay vuelta atrás.
                                </p>
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    FORMATERA TODO (RESET)
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-zinc-600">Personal Finance PWA v1.0</p>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
