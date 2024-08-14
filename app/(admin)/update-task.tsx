import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { supabase } from '@/utils/supabase'
import { router } from 'expo-router';

interface Tasks {
    id: string;
    title: string;
    description: string;
    priority: string;
}
const UpdateTask = () => {


    const [oldTasksData, setOldTasksData] = useState<Tasks[]>([])

    useEffect(() => {
        const fetchTasks = async () => {
            const { data: tasksData, error } = await supabase.from('tasks').select('*');
            if (error) {
                console.error(error);
            } else {
                setOldTasksData(tasksData || []);
            }
        };

        fetchTasks();
    }, []);

    const handleTaskClick = (taskId: string) => {
        console.log(taskId)
        router.push({ pathname: `(admin)/task-detail`, params: { taskId }, },);
    };

    return (
        <ScrollView>
            <View>
                <Text>UpdateTask</Text>
            </View>
            <View className='m-6'>
                {oldTasksData.map((task) => (
                    <TouchableOpacity key={task.id} onPress={() => handleTaskClick(task.id)}>
                        <View className='border p-4 mb-4' key={task.id}>
                            <Text>Title: {task.title}</Text>
                            <Text>Description: {task.description}</Text>
                            <Text>Priority: {task.priority}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

        </ScrollView>
    )
}

export default UpdateTask

