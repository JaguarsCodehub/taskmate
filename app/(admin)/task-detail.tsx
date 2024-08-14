import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const TaskDetailScreen = () => {
    const [newTitle, setNewTitle] = useState<string>("");
    const [newDescription, setNewDescription] = useState<string>("");
    const [newPriority, setNewPriority] = useState<string>("");
    const [newAssignedUserId, setNewAssignedUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]); // For fetching users
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

            if (error) {
                console.error(error);
                Alert.alert('Error', 'Task not found');
            } else {
                setTask(data);
            }
        };

        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name');
            if (error) {
                console.error(error);
                Alert.alert('Error', 'Could not fetch users');
            } else {
                setUsers(data);
            }
        };

        fetchTask();
        fetchUsers();
    }, [taskId]);

    const handleUpdateTask = async () => {
        if (!newTitle || !newDescription || !newPriority) {
            Alert.alert("Error", "Please update the inputs first");
            return;
        }

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ title: newTitle, description: newDescription, priority: newPriority })
                .eq('id', taskId);

            if (error) throw error;

            Alert.alert("Task was updated successfully");
        } catch (error: any) {
            Alert.alert('Error updating task', error.message);
        }
    };

    // TODO: Something is wrong in the reassignment, FIX THIS LATER
    const handleReassignTask = async () => {
        if (!newAssignedUserId) {
            Alert.alert("Error", "Please select a user to reassign the task");
            return;
        }

        try {
            const { error } = await supabase
                .from('task_assignments')
                .update({ assigned_to: newAssignedUserId })
                .eq('task_id', taskId);

            if (error) throw error;

            Alert.alert("Task was reassigned successfully");
        } catch (error: any) {
            Alert.alert('Error reassigning task', error.message);
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
                <Text className='text-2xl'>Update Task</Text>
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
                        <Picker.Item label='--Select Priority--' value='' />
                        <Picker.Item label='Low' value='low' />
                        <Picker.Item label='Medium' value='medium' />
                        <Picker.Item label='High' value='high' />
                    </Picker>
                </View>
            </View>
            <View>
                <Text>Reassign Task</Text>
                <Picker
                    selectedValue={newAssignedUserId}
                    style={styles.picker}
                    onValueChange={(itemValue) => setNewAssignedUserId(itemValue)}
                >
                    <Picker.Item label='--Select User--' value='' />
                    {users.map((user) => (
                        <Picker.Item key={user.id} label={user.full_name} value={user.id} />
                    ))}
                </Picker>
            </View>
            <View>
                <Button
                    title='Update Task'
                    onPress={handleUpdateTask}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <Button
                    title='Reassign Task'
                    onPress={handleReassignTask}
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
    },
});
