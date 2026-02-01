"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createClient } from "@/lib/supabase/client";

export function MonthlyBarChart() {
    const supabase = createClient();

    const { data } = useQuery({
        queryKey: ["transactions", "monthly-bar-summary"],
        queryFn: async () => {
            const { data: transactions } = await supabase
                .from("transactions")
                .select("*");

            if (!transactions) return [];

            // Simple aggregation: Income vs Expense Total
            const income = transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
            const expense = transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + Number(t.amount), 0);

            return [
                { name: "Ingresos", amount: income, fill: "#22c55e" }, // green
                { name: "Gastos", amount: expense, fill: "#ef4444" }, // red
            ];
        }
    });

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
            notation: "compact",
        }).format(val);
    };

    return (
        <div className="h-[200px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data || []} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value: number | undefined) => formatCurrency(value || 0)}
                    />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32} background={{ fill: '#27272a', radius: 4 }}>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between px-4 text-xs text-zinc-500 -mt-4 relative z-10 pointer-events-none">
                <span>Ingresos</span>
                <span>Gastos</span>
            </div>
        </div>
    );
}
