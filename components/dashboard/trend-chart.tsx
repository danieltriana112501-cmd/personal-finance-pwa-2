"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function TrendChart() {
    const [data, setData] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const loadData = async () => {
            const { data: transactions } = await supabase
                .from("transactions")
                .select("created_at, amount, type")
                .order("created_at", { ascending: true });

            if (transactions) {
                // Simple aggregation by day mock logic (refine for prod)
                // For now just mapping raw transactions to show movement
                const formatted = transactions.map((t) => ({
                    amount: t.type === 'expense' ? -t.amount : t.amount,
                    date: new Date(t.created_at).toLocaleDateString(),
                }));
                setData(formatted);
            }
        };

        loadData();
    }, [supabase]);

    return (
        <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="date" hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
