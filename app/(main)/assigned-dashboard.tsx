import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import as needed
import { useAuth } from '@/providers/AuthProvider';
import { format } from 'date-fns';

const AssignedDashboardScreen = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const userId = user?.id; // Get this from your user context/auth state

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            const { data, error } = await supabase
                .from('task_assignments')
                .select(`
                    id, 
                    start_date,
                    due_date,
                    tasks (
                        id,
                        title, 
                        priority,
                        status
                    ),
                    assigned_by (full_name),
                    projects!fk_project_id (
                        name
                    ),
                    clients (
                        name
                    )
                `)
                .eq('assigned_to', userId);

            if (error) {
                console.error(error);
            } else {
                setTasks(data);
            }
        };

        fetchAssignedTasks();
    }, [userId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "d MMMM yyyy");
    };

    const handleMarkAsComplete = async (taskId: string) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'completed' })
                .eq('id', taskId);

            if (error) throw error;

            // Optionally, you might want to refetch the tasks after update
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.tasks.id === taskId
                        ? { ...task, tasks: { ...task.tasks, status: 'completed' } }
                        : task
                )
            );

            Alert.alert('Success', 'Task marked as completed');
        } catch (error: any) {
            Alert.alert('Error', error.message);
            console.error(error);
        }
    };

    const renderTaskItem = ({ item }: { item: any }) => {
        // console.log(item); // Log item
        return (
            <View style={styles.itemContainer} className='bg-rose-300'>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Task: {item.tasks?.title || 'No title'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Assigned By: {item.assigned_by?.full_name || 'Unknown'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Project: {item.projects?.name || 'No project'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Client: {item.clients?.name || 'No client'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Priority: {item.tasks?.priority || 'No priority'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Start Date: {item.start_date ? formatDate(item.start_date) : 'No start date'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Due Date: {item.due_date ? formatDate(item.due_date) : 'No due date'}</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium" }}>Status: {item.tasks?.status || 'Pending'}</Text>
                <TouchableOpacity
                    onPress={() => handleMarkAsComplete(item.tasks?.id || '')}
                    style={styles.completeButton}
                >
                    <Text>Mark as Complete</Text>
                </TouchableOpacity>
            </View>
        );
    };



    return (
        <View style={styles.container}>
            <Text style={styles.header}>Assigned Tasks</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTaskItem}
            />
        </View>
    );
};

export default AssignedDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    completeButton: {
        color: 'blue',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});

