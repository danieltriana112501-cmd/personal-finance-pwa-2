"use client";

import { BudgetCard } from "@/components/budget/budget-card";
import { ExpensesDonut } from "./expenses-donut";
import { MonthlyBarChart } from "./monthly-bar";
import { SavingsCard } from "../savings/savings-card";
import { InsightsWidget } from "./insights-widget";

export function AnalysisView() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white p-4 pb-24 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Tu Bóveda</h1>

            {/* Insights */}
            <InsightsWidget />

            {/* New Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                    <h2 className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Gastos por Categoría</h2>
                    <ExpensesDonut />
                </div>

                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                    <h2 className="text-zinc-400 text-sm uppercase tracking-widest mb-4">Balance General</h2>
                    <MonthlyBarChart />
                </div>
            </div>

            {/* Budgets */}
            <BudgetCard />

            {/* Savings */}
            <SavingsCard />
        </div>
    );
}
