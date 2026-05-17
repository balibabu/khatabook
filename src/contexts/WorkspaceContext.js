import React, { createContext, useState, useEffect, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from './AuthContext';
import WorkspaceScreen from '../screens/home/WorkspaceScreen';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('workspaces')
            .where('members', 'array-contains', user.uid)
            .onSnapshot(snapshot => {
                const list = [];
                snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                setWorkspaces(list);
                setLoading(false);
            }, () => setLoading(false));

        return () => subscriber();
    }, [user]);

    const createWorkspace = async (name) => {
        await firestore().collection('workspaces').add({
            name,
            createdBy: user.uid,
            members: [user.uid],
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
    };

    const updateWorkspace = async (id, newName) => {
        await firestore().collection('workspaces').doc(id).update({ name: newName });
    };

    const deleteWorkspace = async (id) => {
        await firestore().collection('workspaces').doc(id).delete();
    };

    if (loading) return null;

    return (
        <WorkspaceContext.Provider value={{
            activeWorkspace, setActiveWorkspace, workspaces, createWorkspace, updateWorkspace, deleteWorkspace
        }}>
            {activeWorkspace ? children : <WorkspaceScreen />}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);