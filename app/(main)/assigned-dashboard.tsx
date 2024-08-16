import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import as needed
import { useAuth } from '@/providers/AuthProvider';
import { format } from 'date-fns';

const AssignedDashboardScreen = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const userId = user?.id;

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
                const tasksWithDetails = data.filter((task: any) =>
                    task.tasks.title && task.assigned_by.full_name && task.projects.name && task.clients.name
                );
                setTasks(tasksWithDetails);
                setFilteredTasks(tasksWithDetails);
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

    const filterByPriority = (priority: string) => {
        setSelectedPriority(priority);
        if (priority === 'all') {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter((task) => task.tasks.priority === priority));
        }
    };

    const renderTaskItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Task: {item.tasks.title}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Assigned By: {item.assigned_by.full_name}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Project: {item.projects.name}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Client: {item.clients.name}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Priority: {item.tasks.priority}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Start Date: {formatDate(item.start_date)}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Due Date: {formatDate(item.due_date)}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Status: {item.tasks.status || 'Pending'}</Text>
            <TouchableOpacity
                onPress={() => handleMarkAsComplete(item.tasks.id)}
                style={styles.completeButton}
            >
                <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "white", alignItems: 'center', justifyContent: "center" }}>Mark as Complete ✔</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Assigned Tasks</Text>
            <View style={styles.priorityFilterContainer}>
                <TouchableOpacity onPress={() => filterByPriority('low')} style={styles.filterButton}>
                    <Text>Low</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterByPriority('medium')} style={styles.filterButton}>
                    <Text>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterByPriority('high')} style={styles.filterButton}>
                    <Text>High</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterByPriority('all')} style={styles.filterButton}>
                    <Text>All</Text>
                </TouchableOpacity>
            </View>
            {filteredTasks.length === 0 && selectedPriority !== null && (
                <Text>No tasks with the priority level {selectedPriority}</Text>
            )}
            <FlatList
                data={filteredTasks}
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
        fontFamily: "MontserratBold",
        marginBottom: 16,
    },
    priorityFilterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    filterButton: {
        marginRight: 8,
        padding: 8,
        backgroundColor: '#ddd',
        borderRadius: 4,
    },
    itemContainer: {
        backgroundColor: "#183D3D",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        borderRadius: 10
    },
    completeButton: {
        backgroundColor: "#5C8374",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});
