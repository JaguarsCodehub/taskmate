import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');


const CreateTaskScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');

    const handleCreateTask = async () => {
        try {
            const { error } = await supabase
                .from('tasks')
                .insert([
                    {
                        title,
                        description,
                        priority,
                        status: 'pending',
                    },
                ]);

            if (error) throw error;

            Alert.alert('Task created successfully');
            router.push("/(admin)/assign-task");
        } catch (error: any) {
            Alert.alert('Error creating task', error.message);
        }
    };

    return (
        <View className='p-4'>
            <LinearGradient
                colors={['#40534C', '#e2d1c3']}
                style={styles.background}
            />
            <View style={{ padding: 10 }}>
                <View>
                    <Text style={{ fontSize: 30, fontFamily: "MontserratSemibold", color: "white" }}>Create Tasks</Text>
                    <Text style={{ fontSize: 15, fontFamily: "MontserratRegular", color: "white" }}>Create Tasks and assign them to users</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={styles.holder}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white" }}>Title</Text>
                        <TextInput placeholderTextColor={'#fff'} style={styles.textInput} value={title} onChangeText={setTitle} placeholder='Add Task Title' />
                    </View>

                    <View style={styles.holder}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white" }}>Description</Text>
                        <TextInput placeholderTextColor={'#fff'} style={styles.textInput} value={description} onChangeText={setDescription} placeholder='Give a Description to the task' />
                    </View>

                    <View style={styles.holder}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white" }}>Priority</Text>
                        <TextInput placeholderTextColor={'#fff'} style={styles.textInput} value={priority} onChangeText={setPriority} placeholder='Enter Priority Level' />
                    </View>
                    <TouchableOpacity style={{ backgroundColor: "#40534C", padding: 10, marginTop: 20, borderRadius: 5 }}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white", textAlign: "center" }}>Create Task</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CreateTaskScreen;

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    holder: {
        marginTop: 10
    },
    textInput: {
        padding: 10,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10
    }
})
