import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase'; // Adjust the import as needed
import { format, startOfToday, endOfToday } from 'date-fns';
import { router } from 'expo-router';

const imagesData = [
    {
        id: 1,
        source: require('../../assets/images/avatar1.jpg'),
    },
    {
        id: 2,
        source: require('../../assets/images/avatar2.jpg'),
    },
    {
        id: 3,
        source: require('../../assets/images/avatar3.jpg'),
    },
    {
        id: 4,
        source: require('../../assets/images/avatar4.jpg'),
    },
];

const Main = () => {
    const { user } = useAuth();
    const [todayTasks, setTodayTasks] = useState<any[]>([]);
    const userId = user?.id; // Get this from your user context/auth state

    useEffect(() => {
        const fetchTodayTasks = async () => {
            const todayStart = startOfToday().toISOString();
            const todayEnd = endOfToday().toISOString();

            const { data, error } = await supabase
                .from('task_assignments')
                .select(`
                    id,
                    start_date,
                    due_date,
                    tasks (
                        id,
                        title,
                        priority
                    ),
                    assigned_by (full_name),
                    projects!fk_project_id (
                        name
                    ),
                    clients (
                        name
                    )
                `)
                .eq('assigned_to', userId)
                .gte('start_date', todayStart)
                .lte('start_date', todayEnd); // Check if `due_date` should be used as well

            if (error) {
                console.error('Error fetching today\'s tasks:', error);
                Alert.alert('Error', 'Could not fetch today\'s tasks.');
            } else {
                setTodayTasks(data);
            }
        };


        fetchTodayTasks();
    }, [userId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMMM yyyy');
    };

    const renderTaskItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <Text>Task: {item.tasks?.title || 'No title'}</Text>
            <Text>Assigned By: {item.assigned_by?.full_name || 'Unknown'}</Text>
            <Text>Project: {item.projects?.name || 'No project'}</Text>
            <Text>Client: {item.clients?.name || 'No client'}</Text>
            <Text>Priority: {item.tasks?.priority || 'No priority'}</Text>
            <Text>Start Date: {item.start_date ? formatDate(item.start_date) : 'No start date'}</Text>
            <Text>Due Date: {item.due_date ? formatDate(item.due_date) : 'No due date'}</Text>
        </View>
    );

    return (
        <ScrollView>
            <View style={{ padding: 20, display: "flex", flexDirection: "row" }}>
                <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10, fontFamily: "MontserratMedium" }}>TaskMate</Text>
            </View>
            <View style={{ padding: 20, flex: 1 }}>
                <Text style={styles.header}>Start your Day & Be Productive</Text>
                <View style={styles.avatarContainer}>
                    {imagesData.map((image) => (
                        <Image key={image.id} source={image.source} style={styles.avatarImage} />
                    ))}
                    <View style={styles.moreTasksContainer}>
                        <Text style={styles.moreTasksText}>10+</Text>
                    </View>
                </View>
                <View style={styles.taskInfoContainer}>
                    <Text style={styles.taskInfoText}>You have a lot of tasks pending</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Today's Task</Text>
                        <Text style={styles.headerSubtitle}>See all</Text>
                    </View>
                    <View>
                        <FlatList
                            data={todayTasks}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderTaskItem}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => router.push('/(admin)')}>
                        <Text style={styles.buttonText}>Go to Admin</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => router.push('/(main)/assigned-dashboard')}>
                        <Text style={styles.buttonText}>User's Assigned Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontFamily: 'MontserratSemibold',
        color: '#1A3636',
    },
    logoImage: {
        width: 25,
        height: 25,
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#93B1A6',
        paddingVertical: 20,
        borderRadius: 10,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 5,
    },
    moreTasksContainer: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        padding: 8,
        marginLeft: 5,
    },
    moreTasksText: {
        fontSize: 20,
        fontFamily: 'MontserratSemibold',
        color: 'white',
    },
    taskInfoContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    taskInfoText: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
    },
    headerSubtitle: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
    },
    itemContainer: {
        backgroundColor: "#93B1A6",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        borderRadius: 10,
        marginTop: 10
    },
    buttonContainer: {
        padding: 6,
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'MontserratSemibold',
        color: 'white',
        backgroundColor: 'black',
        padding: 6,
    },
});

export default Main;
