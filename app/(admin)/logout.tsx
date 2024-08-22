import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { supabase } from '@/utils/supabase'
import { router } from 'expo-router'

const Logout = () => {

    const signout = async () => {
        const { error } = await supabase.auth.signOut()
        console.log(error);
        router.push("/(auth)")
    }
    return (
        <View style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Admin Signing Off ?</Text>
            <View style={{ marginTop: 20 }}>
                <TouchableOpacity style={{ backgroundColor: "#B43F3F", padding: 10, borderRadius: 10 }} onPress={signout}>
                    <Text style={{ color: "white", textAlign: 'center', fontSize: 20, fontFamily: "MontserratSemibold" }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Logout

const styles = StyleSheet.create({})