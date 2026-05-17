import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BalancedFinancialGraph = ({ data }) => {
    console.log(data);
    const chartData = useMemo(() => {
        let cumInc = 0, cumExp = 0;
        const income = [], expense = [], net = [];
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

        const fmt = (v) => String(Math.abs(Math.round(v)));

        sorted.forEach((item) => {
            if (item.category === 0) cumInc += item.amount; else cumExp -= item.amount;
            const lbl = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

            // Push objects with text properties INSIDE the data point
            income.push({ 
                value: cumInc, 
                label: lbl, 
                dataPointsText: fmt(cumInc),
                textColor: '#16a34a',
                textFontSize: 8,
                textShiftY: -10, // Float Up
            });
            expense.push({ 
                value: cumExp, 
                dataPointsText: fmt(cumExp),
                textColor: '#dc2626',
                textFontSize: 8,
                textShiftY: 10, // Float Down
            });
            net.push({ 
                value: cumInc + cumExp, 
                dataPointsText: fmt(cumInc + cumExp),
                textColor: '#2563eb',
                textFontSize: 9,
                fontWeight: 'bold',
                textShiftY: -15, // Float Higher
            });
        });

        const max = Math.max(...income.map(d => d.value), ...expense.map(d => Math.abs(d.value)), 100);
        return { income, expense, net, maxVal: max };
    }, [data]);

    if (!data || data.length === 0) return <View style={styles.emptyWrap}><Text style={styles.empty}>No data for trend</Text></View>;

    return (
        <View style={styles.chartPadding}>
            <LineChart
                dataSet={[
                    { data: chartData.income, color: '#22c55e', thickness: 2 },
                    { data: chartData.expense, color: '#ef4444', thickness: 2 },
                    { data: chartData.net, color: '#3b82f6', thickness: 3 },
                ]}
                // PHYSICS & SCROLL
                curved
                isAnimated
                height={170}
                spacing={60}            // Extra space so numbers don't touch
                initialSpacing={5}
                width={SCREEN_WIDTH - 80}
                adjustToWidth={false}
                
                // DATA POINT TEXT FIX
                showValuesAsDataPointsText={true}
                // dataPointsHeight={0}    // Make dots invisible but existing
                // dataPointsWidth={0}     // Make dots invisible but existing
                
                // AXIS & GRID
                maxValue={chartData.maxVal}
                mostNegativeValue={-chartData.maxVal}
                noOfSections={2}
                noOfSectionsBelowXAxis={2}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor="#CBD5E1"
                yAxisTextStyle={styles.axisText}
                xAxisLabelTextStyle={styles.axisText}
                rulesType="dashed"
                rulesColor="#F1F5F9"
            />
            
            <View style={styles.legend}>
                <Dot color="#22c55e" label="Income" />
                <Dot color="#ef4444" label="Expense" />
                <Dot color="#3b82f6" label="Balance" />
            </View>
        </View>
    );
};

const Dot = ({ color, label }) => (
    <View style={styles.dotRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.dotLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    chartPadding: { paddingLeft: 5, paddingBottom: 10, alignItems: 'center' },
    axisText: { fontSize: 8, color: '#94A3B8' },
    legend: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 15 },
    dotRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    dotLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
    emptyWrap: { height: 160, justifyContent: 'center', alignItems: 'center' },
    empty: { color: '#94A3B8', fontSize: 12 }
});

export default BalancedFinancialGraph;