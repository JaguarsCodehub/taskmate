import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import as needed
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const TaskDetailScreen = () => {
    const [newTitle, setNewTitle] = useState<string>("")
    const [newDescription, setNewDescription] = useState<string>("")
    const [newPriority, setNewPriority] = useState<string>("")
    const router = useRouter();
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const [task, setTask] = useState<any>(null);

    useEffect(() => {
        const fetchTask = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .single();
            console.log(taskId)
            if (error) {
                console.error(error);
                Alert.alert('Error', 'Task not found');
            } else {
                setTask(data);

            }
        };

        fetchTask();
    }, [taskId]);


    const handleUpdateTask = async () => {
        if (!newTitle || !newDescription || !newPriority) {
            Alert.alert("Error", "Please update the inputs first");
            return;
        }

        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    title: newTitle || task.title, // Fallback to current value if input is empty
                    description: newDescription || task.description,
                    priority: newPriority || task.priority,
                })
                .eq('id', taskId); // Add WHERE clause

            if (error) throw error;

            Alert.alert("Task was updated successfully");
            setNewTitle("");
            setNewDescription("");
            setNewPriority("")
            // router.back(); // Optionally navigate back or to another screen
        } catch (error: any) {
            Alert.alert('Error updating task', error.message);
            console.log(error);
        }
    };


    if (!task) {
        return (
            <View className='p-8'>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View className='p-8'>
            <View>
                <Text className='text-2xl'>UpdateTask</Text>
            </View>
            <View style={{ marginTop: 24 }}>
                <Text>Change Title</Text>
                <TextInput
                    placeholder={task.title}
                    value={newTitle}
                    onChangeText={setNewTitle}
                />
            </View>
            <View>
                <Text>Change Description</Text>
                <TextInput
                    placeholder={task.description}
                    value={newDescription}
                    onChangeText={setNewDescription}
                />
            </View>
            <View>
                <Text>Change Priority</Text>
                <View style={{ marginTop: 10 }}>
                    <Text>Current Priority: {task.priority}</Text>
                    <Picker
                        selectedValue={newPriority}
                        style={styles.picker}
                        onValueChange={(itemValue) => setNewPriority(itemValue)}
                    >
                        <Picker.Item label='--Select Service--' value='' />
                        <Picker.Item label='Low' value='low' />
                        <Picker.Item label='Medium' value='medium' />
                        <Picker.Item label='High' value='high' />
                    </Picker>
                </View>
            </View>
            <View>
                <Button
                    title='Update Task'
                    onPress={handleUpdateTask}
                />
            </View>
        </View>
    );
};

export default TaskDetailScreen;

const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'lightgray',
        borderRadius: 20,
        fontWeight: '700',
    },
})