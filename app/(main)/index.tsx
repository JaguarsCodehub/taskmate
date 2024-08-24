import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import { format, startOfToday, endOfToday } from 'date-fns';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomDrawer from '@/components/ui/CustomDrawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const Main = () => {
    const { user } = useAuth();
    const [todayTasks, setTodayTasks] = useState<any[]>([]);
    const userId = user?.id;

    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setDrawerOpen(false)
    }

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
                        description,
                        priority
                    ),
                    assigned_by (full_name, avatar_url),
                    projects!fk_project_id (
                        name
                    ),
                    clients (
                        name
                    )
                `)
                .eq('assigned_to', userId)
                .gte('start_date', todayStart)
                .lte('start_date', todayEnd);

            if (error) {
                console.error('Error fetching today\'s tasks:', error);
            } else {
                setTodayTasks(data);
            }
        };

        fetchTodayTasks();
    }, [userId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMMM');
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return '#FF4C4C'; // Red for high priority
            case 'medium':
                return '#FFC107'; // Yellow for medium priority
            case 'low':
                return '#4CAF50'; // Green for low priority
            default:
                return '#9E9E9E'; // Grey for undefined or unknown priority
        }
    };

    const renderTaskItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <View style={styles.dateAndPriority}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{item.start_date ? formatDate(item.start_date) : 'No start date'}</Text>
                    </View>
                    <View style={[styles.priorityCircle, { backgroundColor: getPriorityColor(item.tasks.priority) }]} />
                </View>
                <Image source={{ uri: item.assigned_by?.avatar_url }} style={styles.avatarAdmin} />
            </View>
            <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>{item.tasks?.title || 'No title'}</Text>
                <Text style={styles.taskDescription}>{item.tasks?.description || 'No description'}</Text>
                <View style={styles.taskFooter}>
                    <View style={styles.taskFooterTextContainer}>
                        <View style={styles.footerLabel}>
                            <Text style={styles.footerLabelText}>Today</Text>
                        </View>
                        <View style={styles.footerLabel}>
                            <Text style={styles.footerLabelText}>{item.tasks.priority || 'No priority'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.arrowButton}>
                            <Feather name="arrow-up-right" size={24} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView>
            <CustomDrawer isOpen={isDrawerOpen} closeDrawer={closeDrawer} />
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                    <Text style={styles.headerText}>Rangshalakaa</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => router.push('/(main)/profile')}>
                        <Image source={require("@/assets/images/avatar2.jpg")} style={styles.profileImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openDrawer}>
                        <Image source={require("@/assets/images/menu.png")} style={styles.drawerImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.mainHeader}>Start your Day & Be Productive ✌</Text>
                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <Ionicons name="calendar" size={24} color="#fff" />
                        <Text style={styles.calendarText}>{formatDate(Date())}</Text>
                    </View>
                    <View style={styles.taskSummary}>
                        <Text style={styles.summaryText}>Current tasks</Text>
                        <Text style={styles.summaryCount}>You have {todayTasks.length} task{todayTasks.length > 1 ? "s" : ""} for today</Text>
                        <View style={styles.separator} />
                        <FlatList
                            data={todayTasks}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderTaskItem}
                            horizontal
                        />
                    </View>
                </View>
                <View style={styles.taskInfoContainer}>
                    {todayTasks.length > 2 ? (
                        <View style={styles.warningContainer}>
                            <Text style={styles.taskInfoText}>You have a lot of tasks pending.</Text>
                            <FontAwesome name="exclamation-triangle" size={24} color="#FF8343" />
                        </View>
                    ) : (
                        <View style={styles.completeContainer}>
                            <Text style={styles.completeText}>Complete the below remaining tasks.</Text>
                        </View>
                    )}
                </View>
                <View style={styles.tasksContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Today's Task</Text>
                        <TouchableOpacity onPress={() => router.push("/(main)/assigned-dashboard")}>
                            <Text style={styles.headerSubtitle}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={todayTasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderTaskItem}
                    />
                </View>
                <View style={styles.dashboardButtonContainer}>
                    <TouchableOpacity onPress={() => router.push('/(main)/assigned-dashboard')} style={styles.dashboardButton}>
                        <Text style={styles.dashboardButtonText}>Assigned Dashboard</Text>
                        <View style={styles.arrowButton}>
                            <Feather name="arrow-up-right" size={24} color="#000" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        padding: 20,
        display: "flex",
        flexDirection: "row",
    },
    headerRight: {
        display: "flex",
        flexDirection: "row",
    },
    logoImage: {
        width: 25,
        height: 25,
    },
    drawerImage: {
        width: 25,
        height: 25,
        marginRight: 30
    },
    profileImage: {
        width: 25,
        height: 25,
        borderRadius: 25,
        marginRight: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 10,
        fontFamily: "MontserratMedium",
    },
    content: {
        padding: 20,
    },
    mainHeader: {
        fontSize: 25,
        fontFamily: 'MontserratSemibold',
        color: '#1A3636',
    },
    calendarContainer: {
        backgroundColor: "#40534C",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    calendarHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    calendarText: {
        fontSize: 15,
        fontFamily: "MontserratSemibold",
        marginLeft: 10,
        color: "#fff",
    },
    taskSummary: {
        marginTop: 20,
    },
    summaryText: {
        fontSize: 15,
        fontFamily: "MontserratSemibold",
        color: "#fff",
    },
    summaryCount: {
        fontSize: 12,
        color: "#fff",
    },
    separator: {
        height: 1,
        backgroundColor: "#D9D9D9",
        marginVertical: 10,
    },
    taskInfoContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: 15
    },
    warningContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF1E8",
        padding: 10,
        borderRadius: 20,
    },
    taskInfoText: {
        fontSize: 15,
        color: "#FF8343",
        marginRight: 10,
        fontFamily: "MontserratMedium"
    },
    completeContainer: {
        backgroundColor: "#40534C",
        padding: 10,
        borderRadius: 5,
    },
    completeText: {
        fontSize: 15,
        color: "#D6BD98",
        fontFamily: "MontserratMedium"
    },
    tasksContainer: {
        marginTop: 20,
    },
    headerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "MontserratSemibold",
        color: "#1A3636",
        marginBottom: 10
    },
    headerSubtitle: {
        fontSize: 13,
        fontFamily: "MontserratMedium",
        color: "#1A3636",
    },
    taskTitle: {
        fontSize: 15,
        fontFamily: "MontserratSemibold",
        color: "#FFF"
    },
    taskDescription: {
        fontSize: 13,
        color: "#FFF",
        fontFamily: "MontserratSemibold",
    },
    taskFooter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },
    taskFooterTextContainer: {
        display: "flex",
        flexDirection: "row",
    },
    footerLabel: {
        backgroundColor: "#9ab99f",
        paddingHorizontal: 10,
        borderRadius: 5,
        padding: 5,
        marginRight: 5,
    },
    footerLabelText: {
        fontSize: 12,
        color: "#FFF",
        fontFamily: "MontserratSemibold",
    },
    dashboardButtonContainer: {
        display: "flex",
        flexDirection: "row",
        // justifyContent: "center",
        // alignItems: "center",
        marginTop: 20,
    },
    dashboardButton: {
        backgroundColor: "#40534C",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 60,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    dashboardButtonText: {
        fontSize: 15,
        fontFamily: "MontserratSemibold",
        color: "#fff",
        marginRight: 10,
    },
    arrowButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    itemContainer: {
        padding: 10,
        backgroundColor: '#677D6A',
        borderRadius: 10,
        marginBottom: 10,
    },
    itemHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    dateAndPriority: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContainer: {
        paddingRight: 8,
    },
    dateText: {
        fontSize: 14,
        fontFamily: "MontserratMedium",
    },
    priorityCircle: {
        width: 15,
        height: 15,
        borderRadius: 10,
    },
    taskDetails: {
        marginBottom: 10,
    },
    avatarAdmin: {
        width: 25,
        height: 25,
        borderRadius: 20,
    }
});

export default Main;
