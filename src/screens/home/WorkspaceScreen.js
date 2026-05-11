import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../constants'; // Update path if needed

export default function WorkspaceScreen({ workspaces, setActiveWorkspace, createWorkspace }) {
    const [newWorkspace, setNewWorkspace] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!newWorkspace.trim()) return Alert.alert("Error", "Please enter a workspace name");
        setLoading(true);
        try { 
            await createWorkspace(newWorkspace.trim()); 
            setNewWorkspace('');
        } 
        catch (e) { Alert.alert("Failed", e.message); } 
        finally { setLoading(false); }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Select Workspace</Text>
                    <Text style={styles.subText}>Choose a khatabook to manage</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Your Workspaces</Text>
                    
                    <ScrollView style={styles.workspacesWrapper} showsVerticalScrollIndicator={false}>
                        {workspaces.map((ws, index) => (
                            <TouchableOpacity key={index} style={styles.workspaceButton} onPress={() => setActiveWorkspace(ws)} activeOpacity={0.8}>
                                <Icon name="folder-open-outline" size={22} color="#4A90E2" style={styles.wsIcon} />
                                <Text style={styles.workspaceButtonText}>{ws}</Text>
                                <Icon name="chevron-forward" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.divider} />

                    <View style={styles.fieldWrapper}>
                        <Text style={styles.floatingLabel}>Create New</Text>
                        <TextInput 
                            style={styles.floatingInput} 
                            placeholder="e.g., Office, Travel" 
                            placeholderTextColor="#cbd5e1" 
                            value={newWorkspace} 
                            onChangeText={setNewWorkspace} 
                            autoCapitalize="words" 
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading} activeOpacity={0.8}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Workspace</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#B9DDFF', justifyContent: 'center', paddingHorizontal: 24 },
    headerContainer: { marginBottom: 35, alignItems: 'center' },
    welcomeText: { fontSize: 32, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: 'bold', marginBottom: 4 },
    subText: { fontSize: 16, color: '#475569', fontFamily: fonts?.regular },
    formContainer: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 30, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, maxHeight: '75%' },
    sectionTitle: { fontSize: 13, color: '#64748B', fontFamily: fonts?.bold, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 0.5 },
    workspacesWrapper: { maxHeight: 200, marginBottom: 5 },
    workspaceButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1.5, borderColor: '#E2E8F0' },
    wsIcon: { marginRight: 12 },
    workspaceButtonText: { flex: 1, fontSize: 16, color: '#1E293B', fontFamily: fonts?.bold, fontWeight: '600' },
    divider: { height: 1.5, backgroundColor: '#E2E8F0', marginVertical: 20 },
    fieldWrapper: { position: 'relative', marginBottom: 15 },
    floatingLabel: { position: 'absolute', top: -10, left: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 6, fontSize: 12, color: '#64748B', zIndex: 10, fontFamily: fonts?.bold, fontWeight: 'bold', textTransform: 'uppercase' },
    floatingInput: { height: 56, borderRadius: 12, backgroundColor: 'transparent', paddingHorizontal: 16, fontSize: 16, color: '#1E293B', borderWidth: 1.5, borderColor: '#E2E8F0', fontFamily: fonts?.regular },
    button: { backgroundColor: '#4A90E2', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#4A90E2', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
    buttonText: { color: '#FFFFFF', fontSize: 17, fontFamily: fonts?.bold, fontWeight: 'bold', letterSpacing: 0.5 },
});