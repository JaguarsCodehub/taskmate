import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase';

interface Requests {
    id: string;
    uuid: string;
    title: string;
    description: string;
    status: string;
    assigned_to: string;
    created_at: string;
}

const CheckTasks = () => {

    const [userRequests, setUserRequests] = useState<Requests[]>([])

    useEffect(() => {
        const fetchTasks = async () => {
            const { data: userRequests, error } = await supabase.from('user_requests').select('*');
            if (error) {
                console.error(error);
            } else {
                setUserRequests(userRequests || []);
            }
        };

        fetchTasks();

    }, []);

    console.log("UserRequests:", userRequests)

    return (
        <ScrollView style={{ padding: 20 }}>
            <View>
                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Check User Requests</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>User Requests sent to you</Text>
            </View>
            <View>

                {userRequests.map((request) => (
                    <View key={request.id} style={{ backgroundColor: "#697565", padding: 10, borderRadius: 10, marginTop: 10 }}>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Title: {request.title}</Text>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Description: {request.description}</Text>
                        <Text style={{ fontFamily: "MontserratSemibold", color: "white" }}>Status: {request.status}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default CheckTasks

const styles = StyleSheet.create({})