import { supabase } from '@/utils/supabase';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, TextInput, Button, Text, Image, TouchableOpacity } from 'react-native';

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
            // console.log(data.role)
            router.push('/(admin)')
        } if (data.role === "manager") {
            router.push('/(manager)')
        } else {
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
            <Stack.Screen options={{ headerShown: false, statusBarColor: "#677D6A" }} />
            <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10, fontFamily: "MontserratMedium", color: "black" }}>Rangshalakaa</Text>
            </View>
            <Text style={{ fontSize: 30, fontFamily: "MontserratSemibold", color: "white", marginTop: 20 }}>Let's get to know you better</Text>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Enter your Email Address"
                    // placeholderClassName='text-white'
                    placeholderTextColor={'white'}
                    autoCapitalize={'none'}
                    style={{ borderWidth: 2, borderColor: "white", padding: 5, borderRadius: 10 }}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Enter your Password"
                    // placeholderClassName='text-white'
                    placeholderTextColor={'white'}
                    style={{ borderWidth: 2, borderColor: "white", padding: 5, borderRadius: 10 }}
                    autoCapitalize={'none'}
                />
            </View>
            <View style={{ display: "flex", marginBottom: 80 }}>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <TouchableOpacity style={{ backgroundColor: "#D6BD98", padding: 5, paddingVertical: 10, borderRadius: 10 }} disabled={loading} onPress={() => signInWithEmail()}>
                        <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "MontserratSemibold" }}>Sign in</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.verticallySpaced}>

                    <TouchableOpacity style={{ backgroundColor: "#242424", padding: 5, paddingVertical: 10, borderRadius: 10 }} disabled={loading} onPress={() => signUpWithEmail()}>
                        <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "MontserratSemibold", color: "white" }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 30,
        backgroundColor: "#677D6A"
    },
    logoImage: {
        width: 25,
        height: 25
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