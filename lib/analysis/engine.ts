export type Insight = {
    id: string;
    type: "warning" | "success" | "info";
    title: string;
    message: string;
    action?: string;
};

export function analyzeFinances(transactions: any[], budgets: any[]): Insight[] {
    const insights: Insight[] = [];

    // 1. Check Cashflow (Total Income vs Expense)
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const balance = income - expense;

    if (expense > income) {
        insights.push({
            id: "negative-cashflow",
            type: "warning",
            title: "Gasto Crítico",
            message: "Estás gastando más de lo que ganas este mes.",
            action: "revisar"
        });
    } else if (balance > 0 && balance < (income * 0.1)) {
        insights.push({
            id: "low-saving-rate",
            type: "info",
            title: "Capacidad de Ahorro Baja",
            message: "Apenas estás ahorrando. Intenta reducir gastos hormiga.",
        });
    } else if (balance > (income * 0.2)) {
        insights.push({
            id: "good-saving",
            type: "success",
            title: "¡Buen Ritmo!",
            message: "Estás ahorrando más del 20% de tus ingresos. Sigue así.",
        });
    }

    // 2. Check Budgets
    // We need to aggregate transactions by category first (Mocking that logic here or reusing it)
    // For simplicity, we assume 'budgets' passed here already has 'spent' calculated if possible, 
    // OR we calculate it again. Let's calculate for robustness.
    budgets.forEach(b => {
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === b.category)
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const limit = Number(b.limit_amount);
        const percent = (spent / limit) * 100;

        if (percent >= 90 && percent < 100) {
            insights.push({
                id: `budget-warn-${b.category}`,
                type: "warning",
                title: `Cuidado con ${b.category}`,
                message: `Has consumido el 90% de tu presupuesto.`,
            });
        } else if (percent >= 100) {
            insights.push({
                id: `budget-over-${b.category}`,
                type: "warning",
                title: `Exceso en ${b.category}`,
                message: `Te pasaste por $${(spent - limit).toLocaleString()}. ¡Frena!`,
            });
        }
    });

    return insights;
}
