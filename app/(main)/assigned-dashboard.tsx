import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { format } from 'date-fns';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const AssignedDashboardScreen = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
    const userId = user?.id;

    useEffect(() => {
        fetchAssignedTasks();
    }, [selectedStatus, selectedPriority, selectedDateFilter]);

    const fetchAssignedTasks = async () => {
        let query = supabase
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

        if (selectedStatus !== 'all') {
            query = query.eq('tasks.status', selectedStatus);
        }

        if (selectedPriority && selectedPriority !== 'all') {
            query = query.eq('tasks.priority', selectedPriority);
        }

        const today = new Date();
        if (selectedDateFilter === 'next_7_days') {
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            query = query.gte('due_date', today.toISOString()).lte('due_date', nextWeek.toISOString());
        } else if (selectedDateFilter === 'next_14_days') {
            const nextFortnight = new Date();
            nextFortnight.setDate(today.getDate() + 14);
            query = query.gte('due_date', today.toISOString()).lte('due_date', nextFortnight.toISOString());
        } else if (selectedDateFilter === 'overdue') {
            query = query.lt('due_date', today.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
        } else {
            let tasksWithDetails = data.filter((task: any) =>
                task.tasks && task.tasks.title && task.assigned_by.full_name && task.projects.name && task.clients.name
            );

            setTasks(tasksWithDetails);
            setFilteredTasks(tasksWithDetails);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "d MMMM yyyy");
    };

    const handleMarkAsComplete = async (taskId: string) => {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', taskId);

        if (error) throw error;

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.tasks.id === taskId
              ? {
                  ...task,
                  tasks: {
                    ...task.tasks,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                  },
                }
              : task
          )
        );

        Alert.alert('Success', 'Task marked as completed');
      } catch (error: any) {
        Alert.alert('Error', error.message);
        console.error(error);
      }
    };


    const renderTaskItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Task: {item.tasks.title}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Assigned By: {item.assigned_by.full_name}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Project: {item.projects.name}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Client: {item.clients.name}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Priority: {item.tasks.priority}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Start Date: {formatDate(item.start_date)}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Due Date: {formatDate(item.due_date)}</Text>
            <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#FFF" }}>Status: {item.tasks.status || 'Pending'}</Text>
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
            <Text style={{ fontFamily: "MontserratMedium", marginBottom: 20 }}>Filter out Tasks by priorities</Text>
            <View style={styles.priorityFilterContainer}>
                <TouchableOpacity onPress={() => setSelectedPriority('low')} style={styles.filterButton}>
                    <Text style={{ fontFamily: "MontserratSemibold" }} >Low</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedPriority('medium')} style={styles.filterButton}>
                    <Text style={{ fontFamily: "MontserratSemibold" }} >Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedPriority('high')} style={styles.filterButton}>
                    <Text style={{ fontFamily: "MontserratSemibold" }} >High</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedPriority('all')} style={styles.filterButton}>
                    <Text style={{ fontFamily: "MontserratSemibold" }} >All</Text>
                </TouchableOpacity>
            </View>

            <Text style={{ fontFamily: "MontserratMedium" }}>Filter Tasks by Status</Text>
            <View style={styles.card}>
                <Picker
                    selectedValue={selectedStatus}
                    onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                >
                    <Picker.Item label="All" value="all" />
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="In Progress" value="in_progress" />
                    <Picker.Item label="Completed" value="completed" />
                </Picker>
            </View>

            <Text style={{ fontFamily: "MontserratMedium" }}>Filter Tasks by Due Date</Text>
            <View style={styles.card}>
                <Picker
                    selectedValue={selectedDateFilter}
                    onValueChange={(itemValue) => setSelectedDateFilter(itemValue)}
                >
                    <Picker.Item label="All" value="all" />
                    <Picker.Item label="Next 7 Days" value="next_7_days" />
                    <Picker.Item label="Next 14 Days" value="next_14_days" />
                    <Picker.Item label="Overdue" value="overdue" />
                </Picker>
            </View>


            {filteredTasks.length === 0 && selectedStatus !== null && (
                <Text>No tasks with the status {selectedStatus}</Text>
            )}
            <View style={{ backgroundColor: "#5C8374", borderRadius: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, alignItems: "center", marginBottom: 10 }}>
                <Text style={{
                    fontSize: 12,
                    fontFamily: 'MontserratSemibold',
                    color: "#fff"
                }}>Here are your tasks filtered !</Text>
                <Feather name="chevron-down" size={20} color="white" />
            </View>
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
    card: {
        borderWidth: 1,
        width: 314,
        borderColor: "rgba(155,155,155,1)",
        borderRadius: 10,
        backgroundColor: "rgba(214,210,210,1)",
        marginTop: 10,
        marginLeft: 4,
        marginBottom: 10
    },
    header: {
        fontSize: 24,
        fontFamily: "MontserratBold",
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
        backgroundColor: "#677D6A",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        borderRadius: 10
    },
    completeButton: {
        backgroundColor: "#9CA986",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    taskInfoText: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
        color: "#FF8343",
    },
});
