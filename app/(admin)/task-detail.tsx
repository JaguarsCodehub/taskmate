import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window')

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
        <ScrollView>
            <LinearGradient
                colors={['#e2d1c3', '#e2d1c3']}
                style={styles.background}
            />
            <View className='p-8 h-screen'>
                <View>
                    <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Update specific Task</Text>
                </View>
                <View style={{ marginTop: 24 }}>
                    <Text style={styles.text}>Change Title</Text>
                    <TextInput
                        placeholder={task.title}
                        placeholderTextColor={'#212121'}
                        value={newTitle}
                        onChangeText={setNewTitle}
                        style={styles.textInput}
                    />
                </View>
                <View>
                    <Text style={styles.text}>Change Description</Text>
                    <TextInput
                        placeholder={task.description}
                        placeholderTextColor={'#212121'}
                        value={newDescription}
                        onChangeText={setNewDescription}
                        style={styles.textInput}
                    />
                </View>
                <View>
                    <Text style={styles.text}>Change Priority</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.text}>Current Priority: {task.priority}</Text>
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
                    <Text style={styles.text}>Reassign Task</Text>
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
                        color={'#503C3C'}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        title='Reassign Task'
                        onPress={handleReassignTask}
                        color={'#503C3C'}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default TaskDetailScreen;

const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#c4ac97',
        borderRadius: 20,
        marginTop: 10
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height
    },
    text: {
        fontSize: 15,
        fontFamily: "MontserratMedium",
        marginTop: 10,
        color: "black"
    },
    textInput: {
        padding: 10,
        borderColor: "#c4ac97",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10
    }
});
