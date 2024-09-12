import { Button, ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

interface Users {
    id: string;
    role: string;
    username: string;
    full_name: string;
    avatar_url: string;
}

const CreateManager = () => {
    const [users, setUsers] = useState<Users[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: usersData, error: usersError } = await supabase.from('users').select("*");

                if (usersError) throw new Error(usersError?.message);

                setUsers(usersData);
            } catch (error: any) {
                Alert.alert("Error Fetching Data", error.message);
            }
        };

        fetchData();
    }, []);

    const handleCreateManager = async () => {
        if (!selectedUserId) {
            Alert.alert("Error", "Please select a user first");
            return;
        }

        try {
            const { error } = await supabase
                .from('users')
                .update({ role: 'manager' })
                .eq('id', selectedUserId);

            if (error) throw error;

            Alert.alert("Manager was created successfully");
        } catch (error: any) {
            Alert.alert('Error creating manager', error.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {/* <LinearGradient
                colors={['#fdfbfb', '#ebedee']}
                style={styles.background}
            /> */}
            <View>
                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Create a Manager</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Choose one user to be your Manager</Text>
            </View>
            <View style={{ backgroundColor: "#ECDFCC", padding: 15, marginTop: 10 }}>
                <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "#3C3D37" }}>Note:</Text>
                <Text style={{ fontSize: 12, fontFamily: "MontserratMedium", color: "#3C3D37" }}>Choose your manager carefully as he might have access to a lot of exclusive features</Text>
            </View>
            <View style={styles.card}>
                <Picker
                    selectedValue={selectedUserId}
                    onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                // style={styles.picker}
                >
                    <Picker.Item label="Select a user" value="" style={{ borderRadius: 20 }} />
                    {users.map((user) => (
                        <Picker.Item key={user.id} label={user.username} value={user.id} style={{ borderRadius: 20 }} />
                    ))}
                </Picker>
            </View>
            <TouchableOpacity onPress={handleCreateManager} style={{ backgroundColor: "#736a5c", padding: 15, borderRadius: 5 }}>
                <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", textAlign: "center", color: "white" }}>Create Manager</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateManager;

const styles = StyleSheet.create({
    // picker: {
    //     backgroundColor: "white",
    //     borderRadius: 10,
    //     marginTop: 10,
    // },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    card: {
        backgroundColor: 'lightgray', // Dark card background
        borderRadius: 6,
        padding: 2,
        marginBottom: 20,
        marginTop: 30
    },
});
