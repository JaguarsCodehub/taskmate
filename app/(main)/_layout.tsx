import { useAuth } from '@/providers/AuthProvider';
import NotificationProvider1 from '@/providers/notification-provider';
import NotificationProvider from '@/providers/NotificationProvider';
import { supabase } from '@/utils/supabase';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';


export default function RootLayout() {
    const { user } = useAuth()

    const userId = user?.id; // Get this from your user context/auth state

    useEffect(() => {
        const fetchAdmin = async () => {
            // Fetch the user's role from the users table
            const { data, error: roleError } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (roleError) {
                Alert.alert('Error fetching user role', roleError.message);
                // setLoading(false);
                return;
            }

            // Navigate to the appropriate screen based on role
            if (data?.role === 'admin') {
                // console.log(data.role)
                router.push('/(admin)')
            }
        }
        fetchAdmin()
    }, [])


    return (
        <NotificationProvider1>
            <Stack
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </NotificationProvider1>
    );
}
