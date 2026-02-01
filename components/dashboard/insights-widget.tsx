"use client";


import { createClient } from "@/lib/supabase/client";
import { analyzeFinances, Insight } from "@/lib/analysis/engine";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

export function InsightsWidget() {
    const supabase = createClient();

    const { data: insights = [] } = useQuery({
        queryKey: ["transactions", "budgets", "insights"], // Includes 'transactions' so it invalidates automatically
        queryFn: async () => {
            // Fetch all needed data
            const { data: transactions } = await supabase.from("transactions").select("*");
            const { data: budgets } = await supabase.from("budgets").select("*");

            if (transactions && budgets) {
                return analyzeFinances(transactions, budgets);
            }
            return [];
        }
    });

    if (insights.length === 0) return null;

    return (
        <div className="space-y-3">
            <h2 className="text-zinc-400 text-sm uppercase tracking-widest">Consejos IA</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className={cn(
                            "min-w-[280px] p-4 rounded-2xl border flex flex-col gap-2 snap-center",
                            insight.type === "warning" ? "bg-red-950/30 border-red-900/50" :
                                insight.type === "success" ? "bg-green-950/30 border-green-900/50" :
                                    "bg-blue-950/30 border-blue-900/50"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {insight.type === "warning" && <AlertCircle className="w-5 h-5 text-red-500" />}
                            {insight.type === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {insight.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
                            <h4 className="font-bold text-sm text-white">{insight.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                            {insight.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
