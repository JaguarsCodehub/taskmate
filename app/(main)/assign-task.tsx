import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

interface Task {
    id: string;
    title: string;
}

const AssignTaskToManager: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [managerId, setManagerId] = useState<string | null>(null);

    useEffect(() => {
        const fetchManager = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'manager')
                .single();

            if (error) {
                Alert.alert('Error fetching manager data', error.message);
                return;
            }

            setManagerId(data?.id || null);
        };

        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*');

            if (error) {
                Alert.alert('Error fetching tasks', error.message);
                return;
            }

            setTasks(data || []);
        };

        fetchManager();
        fetchTasks();
    }, []);

    const handleAssignTask = async () => {
        if (!selectedTaskId || !managerId) {
            Alert.alert('Error', 'Please select a task');
            return;
        }

        try {
            const { error } = await supabase
                .from('task_assignments')
                .insert([
                    {
                        task_id: selectedTaskId,
                        assigned_to: managerId,
                    },
                ]);

            if (error) throw error;

            Alert.alert('Task assigned to manager successfully');
        } catch (error: any) {
            Alert.alert('Error assigning task', error.message);
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <LinearGradient
                colors={['#0ba360', '#3cba92']}
                style={styles.background}
            />
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 30, fontFamily: "MontserratSemibold", color: "white" }}>Assign Task to Manager</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratRegular", color: "white" }}>Assign a task created by a user to the manager</Text>
                <Picker
                    selectedValue={selectedTaskId}
                    onValueChange={(itemValue) => setSelectedTaskId(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a task" value="" />
                    {tasks.map((task) => (
                        <Picker.Item key={task.id} label={task.title} value={task.id} />
                    ))}
                </Picker>
                <TouchableOpacity onPress={handleAssignTask} style={{ backgroundColor: "#0ba360", padding: 10, marginTop: 20, borderRadius: 5 }}>
                    <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white", textAlign: "center" }}>Assign Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AssignTaskToManager;

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#E2DAD6',
        borderRadius: 60,
        marginTop: 10,
    },
});
