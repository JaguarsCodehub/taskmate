import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Tasks {
    id: string;
    title: string;
    description: string;
    priority: string;
    project: string;
    client: string;
}

const UpdateTask = () => {

    const [oldTasksData, setOldTasksData] = useState<Tasks[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data: tasksData, error } = await supabase
                .from('tasks')
                .select(`
                    id,
                    title,
                    description,
                    priority,
                    task_assignments (
                        projects!fk_project_id (
                            name
                        ),
                        clients (
                            name
                        )
                    )
                `);
            console.log("TasksData", tasksData)
            if (error) {
                console.error(error);
            } else {
                const formattedData = tasksData.map((task: any) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    project: task.task_assignments?.projects?.name || 'No project assigned',
                    client: task.task_assignments?.clients?.name || 'No client assigned',
                }));
                setOldTasksData(formattedData);
            }
        };

        fetchTasks();
    }, []);

    const handleTaskClick = (taskId: string) => {
        console.log(taskId);
        router.push({ pathname: '/(admin)/task-detail', params: { taskId } });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return '#ff7f7f'; // Red
            case 'medium':
                return '#ffd967'; // Yellow
            case 'low':
                return '#7dc8ff'; // Blue
            default:
                return '#7E6363'; // Default color if priority is unknown
        }
    };

    return (
        <ScrollView>
            <LinearGradient
                colors={['#e2d1c3', '#e2d1c3']}
                style={styles.background}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ fontSize: 25, fontFamily: "MontserratSemibold" }}>Update Tasks data</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratRegular" }}>You can update specific tasks to users</Text>
            </View>
            <View style={{ margin: 10 }}>
                {oldTasksData.map((task) => (
                    <TouchableOpacity key={task.id} onPress={() => handleTaskClick(task.id)}>
                        <View style={{
                            padding: 10,
                            backgroundColor: getPriorityColor(task.priority),
                            marginTop: 15,
                            borderRadius: 5
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: "MontserratSemibold",
                                marginTop: 10,
                                color: "white"
                            }}>Title: {task.title}</Text>
                            <Text style={styles.text}>Priority: {task.priority}</Text>
                            <Text style={styles.text}>Project: {task.project}</Text>
                            <Text style={styles.text}>Client: {task.client}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

export default UpdateTask;

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    text: {
        fontSize: 15,
        fontFamily: "MontserratMedium",
        marginTop: 10,
        color: "white"
    },
});
