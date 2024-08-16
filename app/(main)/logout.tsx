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
        <View>
            <TouchableOpacity onPress={signout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Logout

const styles = StyleSheet.create({})