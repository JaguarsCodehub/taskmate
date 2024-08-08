import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'

const Signup = () => {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ statusBarColor: "#677D6A" }} />
            <View style={{ paddingTop: 50, display: "flex", flexDirection: "row", marginTop: 20, alignItems: "center", justifyContent: "center" }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 30, fontWeight: "600", marginLeft: 10, color: "black" }}>TaskMate</Text>
            </View>
            <View style={{ padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 30, fontWeight: "700", textAlign: "center", color: "#212121" }}>Sign up to <Text style={{ fontSize: 30, fontWeight: "600", color: "#ffe7c3" }}>start your productivity</Text> from today</Text>
                </View>
                <View style={{ marginTop: 40 }}>
                    <Text style={{ fontWeight: "600" }}>Email Address</Text>
                    <TextInput
                        placeholder='Enter Email Address'
                        placeholderTextColor="black"
                        cursorColor={"black"}
                        style={{ marginTop: 10, borderColor: "black", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5 }}
                    />
                    <Text style={{ marginTop: 10, fontWeight: "600" }}>Password</Text>
                    <TextInput
                        placeholder='Enter Password'
                        placeholderTextColor="black"
                        style={{ marginTop: 10, borderColor: "black", borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 5 }}
                    />
                </View>
                <View style={{ marginTop: 70 }}>
                    <TouchableOpacity style={{ backgroundColor: "#212121", borderRadius: 10, paddingVertical: 15 }}>
                        <Text style={{ textAlign: "center", color: "white", fontSize: 15 }}>Get Started</Text>
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