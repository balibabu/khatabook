import { useMemo } from "react";

export const useDashboardData = (data, filter) => {
    return useMemo(() => {
        const now = new Date();
        const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const filteredDocs = data.filter(item => {
            const d = new Date(item.date); // Local conversion happens here
            const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());

            if (filter === 'Yearly') return d.getFullYear() === now.getFullYear();
            
            if (filter === 'Monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            
            if (filter === 'Weekly') {
                const startOfWeek = new Date(todayMid);
                startOfWeek.setDate(todayMid.getDate() - 6); // 7 days including today
                return dMid >= startOfWeek && dMid <= todayMid;
            }
            return true;
        });

        let income = 0, expense = 0;
        filteredDocs.forEach(i => i.category === 0 ? income += Number(i.amount) : expense += Number(i.amount));

        const grouped = {};

        filteredDocs.forEach(item => {
            const d = new Date(item.date);
            const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            const groupKey = `${dayKey}_${item.category}`;
            if (!grouped[groupKey]) {
                grouped[groupKey] = {
                    id: groupKey,
                    category: item.category,
                    description: item.category === 0 ? 'Daily Income' : 'Daily Expense',
                    amount: 0,
                    date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
                };
            }
            grouped[groupKey].amount += Number(item.amount) || 0;
        });
        const graphData = Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
            income, expense,
            balance: income - expense,
            filtered: filteredDocs.sort((a, b) => new Date(b.date) - new Date(a.date)),
            graphData
        };
    }, [data, filter]);
};