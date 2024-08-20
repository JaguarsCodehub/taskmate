import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { supabase } from '@/utils/supabase'
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
            <LinearGradient
                colors={['#e2d1c3', '#e2d1c3']}
                style={styles.background}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Update Tasks data</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratRegular" }}>You can update specific tasks to users</Text>
            </View>
            <View className='m-6'>
                {oldTasksData.map((task) => (
                    <TouchableOpacity key={task.id} onPress={() => handleTaskClick(task.id)}>
                        <View style={{ padding: 10, backgroundColor: "#7E6363", marginTop: 15, borderRadius: 5 }} key={task.id}>
                            <Text style={styles.text}>Title: {task.title}</Text>
                            <Text style={styles.text}>Description: {task.description}</Text>
                            <Text style={styles.text}>Priority: {task.priority}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

export default UpdateTask

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
})
