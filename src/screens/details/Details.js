import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useData } from '../../contexts/DataContext';
import { fonts } from '../../constants';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import FloatingButton from '../../components/FloatingButton';
import TransactionItem from '../home/TransactionItem';
import { useTransactionFilters } from '../../hooks/useTransactionFilters';
import SwipeActions from '../../components/SwipeActions';

export default function DetailsScreen({ navigation }) {
    const { data, remove } = useData();
    const { searchQuery, setSearchQuery, fromDate, setFromDate, toDate, setToDate, showFilters, setShowFilters, filteredData, resetFilters } = useTransactionFilters(data);
    const [picker, setPicker] = useState({ show: false, mode: 'from' });

    const handleDelete = (id) => {
        Alert.alert('Delete', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transactions</Text>
                <TouchableOpacity style={styles.filterToggle} onPress={() => { if (showFilters) resetFilters(); setShowFilters(!showFilters); }}>
                    <Icon name={showFilters ? "chevron-collapse" : "options-outline"} size={22} color="#2873c9" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                <View style={[styles.searchBar, showFilters && styles.searchBarActive]}>
                    <Icon name="search-outline" size={18} color="#94A3B8" />
                    <TextInput style={styles.searchInput} placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#9CA3AF" />
                </View>

                {showFilters && (
                    <View style={styles.filterCard}>
                        <View style={styles.dateRow}>
                            <DateFilter label="From Date" date={fromDate} onPress={() => setPicker({ show: true, mode: 'from' })} />
                            <View style={styles.dateDivider}>
                                <Icon name="arrow-forward-outline" size={16} color="#CBD5E1" />
                            </View>
                            <DateFilter label="To Date" date={toDate} onPress={() => setPicker({ show: true, mode: 'to' })} />
                        </View>
                        
                        <View style={styles.summaryRow}>
                            <View style={[styles.summaryBox, styles.incomeBox]}>
                                <View style={[styles.iconWrapper, { backgroundColor: '#D1FAE5' }]}>
                                    <Icon name="arrow-down" size={14} color="#0D9488" />
                                </View>
                                <View>
                                    <Text style={styles.summaryLabel}>Income</Text>
                                    <Text style={[styles.summaryValue, { color: '#0D9488' }]}>
                                        Rs {filteredData.filter(t => t.category === 0).reduce((sum, t) => sum + (Number(t.amount) || 0), 0)}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.summaryBox, styles.expenseBox]}>
                                <View style={[styles.iconWrapper, { backgroundColor: '#FFE4E6' }]}>
                                    <Icon name="arrow-up" size={14} color="#E11D48" />
                                </View>
                                <View>
                                    <Text style={styles.summaryLabel}>Expense</Text>
                                    <Text style={[styles.summaryValue, { color: '#E11D48' }]}>
                                        Rs {filteredData.filter(t => t.category === 1).reduce((sum, t) => sum + (Number(t.amount) || 0), 0)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <SwipeActions onDelete={() => handleDelete(item.id)} onEdit={() => navigation.navigate('Form', { id: item.id })}>
                        <TransactionItem item={item} />
                    </SwipeActions>
                )}
                ListEmptyComponent={<EmptyState />}
            />

            <FloatingButton onPress={() => navigation.navigate('Form')} />

            {picker.show && (
                <DateTimePicker
                    value={(picker.mode === 'from' ? fromDate : toDate) || new Date()}
                    onChange={(_, d) => {
                        setPicker({ ...picker, show: false });
                        if (d) picker.mode === 'from' ? setFromDate(d) : setToDate(d);
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const DateFilter = ({ label, date, onPress }) => (
    <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>{label}</Text>
        <TouchableOpacity style={styles.dateInput} onPress={onPress}>
            <Text style={styles.dateText}>{date ? date.toLocaleDateString() : 'Select Date'}</Text>
            <Icon name="calendar-outline" size={16} color="#64748B" />
        </TouchableOpacity>
    </View>
);

const EmptyState = () => (
    <View style={styles.emptyState}>
        <Icon name="receipt-outline" size={60} color="#E2E8F0" />
        <Text style={styles.emptyText}>No results found.</Text>
    </View>
);

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 28, fontFamily: fonts.bold, color: '#1E293B' },
    filterToggle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    filterToggleActive: { backgroundColor1: '#4A90E2' },
    
    // Updated Search Section styles for the depth/dropdown effect
    searchSection: { paddingHorizontal: 20, marginBottom: 10, zIndex: 10 },
    searchBar: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 15, paddingHorizontal: 15, backgroundColor: '#F8FAFC', borderTopWidth: 2.5, borderLeftWidth: 1.5, borderBottomWidth: 0.5, borderRightWidth: 0.5, borderTopColor: '#B6C7C7', borderLeftColor: '#B6C7C7', borderBottomColor: '#B6C7C7', borderRightColor: '#B6C7C7' },
    searchBarActive: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#134E4A', paddingVertical: 0 },
    
    // Recessed Dropdown Drawer
    filterCard: { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 16, paddingTop: 12, borderLeftWidth: 1.5, borderRightWidth: 0.5, borderBottomWidth: 0.5, borderLeftColor: '#B6C7C7', borderRightColor: '#B6C7C7', borderBottomColor: '#B6C7C7', borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.03)' },
    
    dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    filterGroup: { flex: 1 },
    dateDivider: { paddingHorizontal: 10, paddingTop: 15 },
    filterLabel: { fontSize: 11, fontFamily: fonts.bold, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    dateInput: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, height: 46, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'space-between', alignItems: 'center' },
    dateText: { fontSize: 14, color: '#334155', fontFamily: fonts.medium },
    
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
    summaryBox: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, gap: 10 },
    incomeBox: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5' },
    expenseBox: { backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FFE4E6' },
    iconWrapper: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    summaryLabel: { fontSize: 11, fontFamily: fonts.medium, color: '#64748B', marginBottom: 2 },
    summaryValue: { fontSize: 15, fontFamily: fonts.bold },

    listContent: { padding: 20, paddingBottom: 100, gap: 10 },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#94A3B8', fontSize: 14, marginTop: 10 }
});