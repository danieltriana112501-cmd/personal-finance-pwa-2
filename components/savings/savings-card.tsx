"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, PiggyBank, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ManageSavingsDrawer } from "@/components/management/manage-savings-drawer";

export function SavingsCard() {
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const loadGoals = async () => {
            const { data } = await supabase.from("savings_goals").select("*").order("created_at");
            if (data) setGoals(data);
            setLoading(false);
        };
        loadGoals();
    }, [supabase]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) return null;

    return (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-zinc-400 font-medium text-sm uppercase tracking-wide">Metas de Ahorro</h3>
                </div>
                <ManageSavingsDrawer onUpdate={() => window.location.reload()} />
            </div>

            <div className="space-y-4">
                {goals.map((g, i) => {
                    const percent = Math.min((g.current_amount / g.target_amount) * 100, 100);

                    return (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-white font-medium block">{g.name}</span>
                                    <span className="text-xs text-zinc-500">Meta: {formatCurrency(g.target_amount)}</span>
                                </div>
                                <span className="text-emerald-400 font-bold text-sm">
                                    {formatCurrency(g.current_amount)}
                                </span>
                            </div>

                            <div className="h-2 bg-black rounded-full overflow-hidden relative">
                                <div
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
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
