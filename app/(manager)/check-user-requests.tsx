import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';

interface UserRequests {
    id?: string;
    user_id: { full_name: string }; // Adjusting this to represent the correct type
    title: string;
    description: string;
    status: string;
}

const CheckUserRequests = () => {

    const { user } = useAuth()
    const userId = user?.id;
    const [userRequests, setUserRequests] = useState<UserRequests[]>([])

    useEffect(() => {
        const fetchUserRequests = async () => {
            const { data, error } = await supabase
                .from('user_requests')
                .select('title, description, status, user_id (full_name)')
                .eq('assigned_to', userId)

            if (error) {
                console.log("Fetched User Requests", data)
                Alert.alert('Error fetching user Requests', error.message);
            } else {
                setUserRequests(data);
            }
        }
        fetchUserRequests()
    }, [])
    return (
        <ScrollView>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>CheckUserRequests</Text>

                {userRequests.map((request) => (
                    <View key={request.id} style={{ backgroundColor: "#697565", padding: 10, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Request Title: {request.title}</Text>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Description: {request.description}</Text>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Status: {request.status}</Text>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Request Assigned By: {request.user_id.full_name}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default CheckUserRequests

const styles = StyleSheet.create({})