import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { supabase } from '@/utils/supabase'

const Logout = () => {

    const signout = async () => {
        const { error } = await supabase.auth.signOut()
        console.log(error)
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