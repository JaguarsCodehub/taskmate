import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, TextInput, Button } from 'react-native';

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { data: userData, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }

        // Fetch the user's role from the users table
        const { data, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userData.session.user.id)
            .single();

        if (roleError) {
            Alert.alert('Error fetching user role', roleError.message);
            setLoading(false);
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

        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) Alert.alert(error.message);
        if (!session)
            Alert.alert('Please check your inbox for email verification!');
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                    className="border border-gray-300 p-3 rounded-md"
                />
            </View>
            <View style={styles.verticallySpaced}>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                    className="border border-gray-300 p-3 rounded-md"
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button
                    title="Sign in"
                    disabled={loading}
                    onPress={() => signInWithEmail()}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Button
                    title="Sign up"
                    disabled={loading}
                    onPress={() => signUpWithEmail()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
});