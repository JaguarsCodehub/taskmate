import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/providers/AuthProvider';

const { width, height } = Dimensions.get('window');

interface ManagerType {
    id: string;
    full_name: string;
}

const CreateUserRequestScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [managers, setManagers] = useState<ManagerType[]>([]);
    const [selectedManager, setSelectedManager] = useState('');

    const { user } = useAuth()
    const userId = user?.id

    useEffect(() => {
        const fetchManagers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name')
                .in('role', ['manager', 'admin']);

            if (error) {
                Alert.alert('Error fetching managers', error.message);
            } else {
                setManagers(data);
            }

            console.log(managers)
        };

        fetchManagers();
    }, []);

    const handleCreateUserRequest = async () => {
        if (!title || !selectedManager) {
            Alert.alert('Please fill in all fields');
            return;
        }

        try {
            const { error } = await supabase
                .from('user_requests')
                .insert([
                    {
                        title,
                        description,
                        user_id: userId,
                        assigned_to: selectedManager,
                    },
                ]);

            if (error) throw error;

            console.log("Request was created")
            Alert.alert('Request created successfully');
        } catch (error: any) {
            Alert.alert('Error creating request', error.message);
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <View>
                <Text style={{ fontSize: 30, fontFamily: "MontserratSemibold", color: "black" }}>Create User Request</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratRegular", color: "black" }}>Create a request and assign it to a manager or admin</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <View style={styles.holder}>
                    <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "black" }}>Title</Text>
                    <TextInput
                        placeholderTextColor={'#000'}
                        style={styles.textInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Add Request Title'
                    />
                </View>

                <View style={styles.holder}>
                    <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "black" }}>Description</Text>
                    <TextInput
                        placeholderTextColor={'#000'}
                        style={styles.textInput}
                        value={description}
                        onChangeText={setDescription}
                        placeholder='Give a Description to the request'
                    />
                </View>

                <View style={styles.holder}>
                    <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "black" }}>Assign To</Text>
                    <Picker
                        selectedValue={selectedManager}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedManager(itemValue)}
                    >
                        {managers.map(manager => (
                            <Picker.Item key={manager.id} label={manager.full_name} value={manager.id} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity onPress={handleCreateUserRequest} style={styles.button}>
                    <Text style={styles.buttonText}>Create Request</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateUserRequestScreen;

const styles = StyleSheet.create({
    holder: {
        marginTop: 10
    },
    textInput: {
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        marginTop: 10
    },
    button: {
        backgroundColor: "#0ba360",
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        textAlign: "center",
    },
    buttonText: {
        fontSize: 18,
        fontFamily: "MontserratSemibold",
        color: "white",
    }
});
