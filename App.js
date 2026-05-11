import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';

import AppNavigator from './src/AppNavigator';
import { AppLockProvider } from './src/contexts/AppLockContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    return (
        <AuthProvider>
            <AppLockProvider>
                <DataProvider>
                    <GestureHandlerRootView>
                        <AppNavigator />
                    </GestureHandlerRootView>
                </DataProvider>
            </AppLockProvider>
        </AuthProvider>
    );
}