import { useAuth } from '@/providers/AuthProvider';
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
                .eq('id', user?.id)
                .single();

            if (roleError) {
                Alert.alert('Error fetching user role', roleError.message);
                // setLoading(false);
                return;
            }

            // Navigate to the appropriate screen based on role
            if (data?.role === 'admin') {
                console.log(data.role)
                router.push('/(admin)')
            } else {
                console.log(data.role)
                router.push('/(main)')
            }
        }
        fetchAdmin()
    }, [])


    return (
        <Stack
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
