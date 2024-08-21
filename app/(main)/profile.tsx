import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/providers/AuthProvider'

const { width, height } = Dimensions.get('window')

interface Users {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
}

const Profile = () => {
    const { user } = useAuth()
    const userId = user?.id
    const [users, setUsers] = useState<Users>();

    useEffect(() => {
        const fetchUsers = async () => {
            console.log("UserId: ", userId)
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name, username, avatar_url')
                .eq('id', userId)
                .single()
            if (error) {
                console.error(error);
                Alert.alert('Error', 'Could not fetch users');
            } else {
                setUsers(data);
            }
        };

        fetchUsers()
        console.log("Users Data:", users)
    }, [])
    return (
        <ScrollView>
            <LinearGradient
                // Background Linear Gradient
                colors={['#fdfcfb', '#e2d1c3']}
                style={styles.background}
            />
            <View className='h-screen p-8'>
                <Text style={{ fontSize: 25, fontFamily: "MontserratSemibold" }}>Update Profile</Text>
                <View style={{ marginTop: 25 }}>
                    <Text>Current Username</Text>
                    <TextInput placeholder={users?.username} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text>Your Full Name</Text>
                    <TextInput placeholder={users?.username} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text>Your Profile Photo</Text>
                    <Image
                        source={{ uri: users?.avatar_url }}
                        width={200}
                        height={200}
                        resizeMode='center'
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    }
})

