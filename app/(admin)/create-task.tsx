import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';

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
        <View className='p-8'>
            <Text>Title</Text>
            <TextInput value={title} onChangeText={setTitle} />

            <Text>Description</Text>
            <TextInput value={description} onChangeText={setDescription} />

            <Text>Priority</Text>
            <TextInput value={priority} onChangeText={setPriority} />

            <Button title="Create Task" onPress={handleCreateTask} />
        </View>
    );
};

export default CreateTaskScreen;
