import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Link, router, Stack } from 'expo-router'
import { supabase } from '@/utils/supabase';

const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session)
            Alert.alert("Please check your inbox for email verification!");
        setLoading(false);

        router.push('/(main)')
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ statusBarColor: "#677D6A" }} />
            <View style={{ paddingTop: 50, display: "flex", flexDirection: "row", marginTop: 20, alignItems: "center", justifyContent: "center" }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 30, fontWeight: "600", marginLeft: 10, color: "black", fontFamily: "MontserratMedium" }}>TaskMate</Text>
            </View>
            <View style={{ padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 30, fontWeight: "600", textAlign: "center", color: "#212121", fontFamily: "MontserratMedium" }}>Sign up to <Text style={{ fontSize: 30, fontWeight: "600", color: "#ffe7c3", fontFamily: "MontserratMedium" }}>start your productivity</Text> from today</Text>
                </View>
                <View style={{ marginTop: 40 }}>
                    <Text style={{ fontWeight: "600", fontFamily: "MontserratMedium" }}>Email Address</Text>
                    <TextInput
                        placeholder='Enter Email Address'
                        placeholderTextColor="black"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        cursorColor={"black"}
                        style={{ marginTop: 10, borderColor: "black", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5 }}
                    />
                    <Text style={{ marginTop: 10, fontWeight: "600", fontFamily: "MontserratMedium" }}>Password</Text>
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        placeholder='Enter Password'
                        placeholderTextColor="black"
                        style={{ marginTop: 10, borderColor: "black", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5 }}
                    />
                </View>
                <View style={{ marginTop: 70 }}>
                    <TouchableOpacity
                        disabled={loading}
                        onPress={() => signUpWithEmail()}
                        style={{ backgroundColor: "#ffe7c3", borderRadius: 10, paddingVertical: 15 }}
                    >
                        <Text style={{ textAlign: "center", color: "black", fontSize: 15, fontFamily: "MontserratMedium" }}>Get Started</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Link href={"/(auth)/login"}>
                        <Text style={{ fontSize: 15, fontWeight: "600", textAlign: "center" }}>Already Registered ? Login here.</Text>
                    </Link>
                </View>
            </View>
        </View>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#677D6A"
    },
    logoImage: {
        width: 30,
        height: 30,
    },
})