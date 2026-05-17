import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    getFirestore,
    collection,
    doc,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from '@react-native-firebase/firestore';

import { useAuth } from './AuthContext';
import WorkspaceScreen from '../screens/home/WorkspaceScreen';
import MyIndicator from '../components/MyIndicator';

const WorkspaceContext = createContext();
const db = getFirestore();

export const WorkspaceProvider = ({ children }) => {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const workspaceRef = collection(db, 'users', user.uid, 'workspaces');
        const q = query(workspaceRef, orderBy('name', 'asc'));

        const subscriber = onSnapshot(
            q,
            snapshot => {
                const list = [];

                snapshot.forEach(docSnap => {
                    list.push({
                        id: docSnap.id,
                        ...docSnap.data(),
                    });
                });

                setWorkspaces(list);
                setLoading(false);
            },
            error => {
                console.log(error);
                setLoading(false);
            }
        );

        return () => subscriber();
    }, [user]);

    const createWorkspace = async (name) => {
        await addDoc(
            collection(db, 'users', user.uid, 'workspaces'),
            {
                name,
                createdAt: serverTimestamp(),
            }
        );
    };

    const updateWorkspace = async (id, newName) => {
        await updateDoc(
            doc(db, 'users', user.uid, 'workspaces', id),
            { name: newName }
        );
    };

    const deleteWorkspace = async (id) => {
        await deleteDoc(
            doc(db, 'users', user.uid, 'workspaces', id)
        );
    };

    const ctxValue = {
        activeWorkspace,
        setActiveWorkspace,
        workspaces,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
    };

    return (
        <WorkspaceContext.Provider value={ctxValue}>
            {loading ? <MyIndicator text={'loading workspaces please wait'}/> : activeWorkspace ? children : <WorkspaceScreen />}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => useContext(WorkspaceContext);