import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated) {
        if (role === 'admin') {
            return <Redirect href="/(admin)" />;
        } else if (role === 'manager') {
            return <Redirect href="/(manager)" />;
        } else if (role === 'user') {
            return <Redirect href="/(main)" />;
        }

    }

    return <Stack />;
}