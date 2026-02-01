"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const COLORS: Record<string, string> = {
    food: "#f97316",      // orange-500
    transport: "#3b82f6", // blue-500
    shopping: "#a855f7",  // purple-500
    bills: "#eab308",     // yellow-500
    coffee: "#ec4899",    // pink-500
    other: "#6b7280",     // gray-500
};

const LABELS: Record<string, string> = {
    food: "Comida",
    transport: "Transp.",
    shopping: "Compras",
    bills: "Servicios",
    coffee: "Ocio",
    other: "Otros",
};

export function ExpensesDonut() {
    const supabase = createClient();
    const { data, isLoading } = useQuery({
        queryKey: ["transactions", "expenses-donut"],
        queryFn: async () => {
            const { data: transactions } = await supabase
                .from("transactions")
                .select("*")
                .eq("type", "expense");

            if (!transactions) return [];

            // Aggregate by category
            const aggregated: Record<string, number> = {};
            transactions.forEach((t: any) => {
                aggregated[t.category] = (aggregated[t.category] || 0) + Number(t.amount);
            });

            return Object.keys(aggregated).map((key) => ({
                name: LABELS[key] || "Otros",
                value: aggregated[key],
                color: COLORS[key] || COLORS.other,
            }));
        },
    });

    const total = data?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0;
    const loading = isLoading;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
            notation: "compact",
        }).format(val);
    };

    if (loading) return <div className="h-[200px] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (total === 0) return <div className="h-[200px] flex items-center justify-center text-zinc-500 text-sm">Sin datos de gastos aún</div>;

    return (
        <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data || []}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {(data || []).map((entry: any, index: any) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value: any) => formatCurrency(value)}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Total</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(total)}</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 px-4 pb-2">
                {(data || []).map((d: any) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-[10px] text-zinc-400">{d.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
