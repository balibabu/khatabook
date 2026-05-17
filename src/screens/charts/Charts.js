import React, { lazy, Suspense, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import SegmentedControl from '../../components/SegmentedControl';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { fonts } from '../../constants';

const IncomePieChart = lazy(() => import('../../components/IncomePieChart'));
const BalancedFinancialGraph = lazy(() => import('../../components/BalancedFinancialGraph'));

export default function Charts() {
    const { data } = useData();
    const [filter, setFilter] = useState('Monthly');
    const dashboardData = useDashboardData(data, filter);

    return (
        <SafeAreaView style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" backgroundColor="#4A90E2" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analytics</Text>
                <SegmentedControl
                    options={['Weekly', 'Monthly', 'Yearly']}
                    activeOption={filter}
                    onChange={setFilter}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.chartWrapper}>
                    <Text style={styles.chartTitle}>Income vs Expense</Text>
                    <Suspense fallback={<ActivityIndicator size="large" color="#9d4edd" style={styles.loader} />}>
                        <IncomePieChart income={dashboardData.income} expense={dashboardData.expense} />
                    </Suspense>
                </View>

                <View style={styles.chartWrapper}>
                    <Text style={styles.chartTitle}>Financial Balance Trend</Text>
                    <Suspense fallback={<ActivityIndicator size="large" color="#9d4edd" style={styles.loader} />}>
                        <BalancedFinancialGraph data={dashboardData.graphData} />
                    </Suspense>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b8d8fc' },
    header: { backgroundColor: '#4A90E2', paddingTop: 10, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 5 },
    headerTitle: { color: '#fff', fontSize: 28, fontFamily: fonts.bold, marginBottom: 15, letterSpacing: 0.5 },
    scrollContent: { padding: 20 },
    chartWrapper: { overflow: 'hidden', backgroundColor: '#F5F7FA', borderRadius: 20, padding: 16, marginBottom: 20, elevation: 3, },
    chartTitle: { fontSize: 16, fontFamily: fonts.bold, color: '#1E293B', marginBottom: 15, textAlign: 'center' },
    loader: { height: 200, justifyContent: 'center' },
});