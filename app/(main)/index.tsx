import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView, Touchable } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase'; // Adjust the import as needed
import { format, startOfToday, endOfToday } from 'date-fns';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomDrawer from '@/components/ui/CustomDrawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const Main = () => {
    const { user } = useAuth();
    const [todayTasks, setTodayTasks] = useState<any[]>([]);
    const userId = user?.id; // Get this from your user context/auth state

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
                .lte('start_date', todayEnd); // Check if `due_date` should be used as well

            if (error) {
                console.error('Error fetching today\'s tasks:', error);
                Alert.alert('Error', 'Could not fetch today\'s tasks.');
            } else {
                setTodayTasks(data);
            }
        };

        fetchTodayTasks();
    }, [userId, todayTasks]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMMM');
    };

    const renderTaskItem = ({ item }: { item: any }) => (
        <View style={{
            backgroundColor: "#9CA986",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            marginBottom: 10,
            borderRadius: 10,
            marginTop: 10
        }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ backgroundColor: "#FEFAE0", padding: 5, width: '30%', borderRadius: 25, alignItems: "center" }}>
                    <Text style={{ fontSize: 12, fontFamily: "MontserratMedium" }}>{item.start_date ? formatDate(item.start_date) : 'No start date'}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    {/* <Text style={{ fontSize: 12, fontFamily: "MontserratMedium" }}>{item.tasks?.priority || 'No priority'}</Text> */}
                    <Image source={{ uri: item.assigned_by?.avatar_url }} style={styles.avatarAdmin} />
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontFamily: "MontserratBold", color: "#FEFAE0" }}>{item.tasks?.title || 'No title'}</Text>
                <Text style={{ fontSize: 16, fontFamily: "MontserratSemibold", color: "#FEFAE0" }}>{item.tasks?.description || 'No description'}</Text>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <View style={{ backgroundColor: "#FFF", padding: 5, paddingHorizontal: 10, borderRadius: 20, alignItems: "center", marginRight: 10 }}>
                            <Text style={{ fontSize: 14, fontFamily: "MontserratMedium", color: "#000", textAlign: "center" }}>Today</Text>
                        </View>
                        <View style={{ backgroundColor: "#FFF", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, alignItems: "center" }}>
                            <Text style={{ fontSize: 14, fontFamily: "MontserratMedium", color: "#000" }}>{item.tasks.priority || 'No priority'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <View style={{ backgroundColor: "#FEFAE0", padding: 5, borderRadius: 20 }}>
                            <Feather name="arrow-up-right" size={24} color="#000" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderPriority = ({ item }: { item: any }) => (
        <>
            <View key={item.id} style={{ backgroundColor: "#677D6A", padding: 5, borderRadius: 10, marginTop: 10, marginLeft: 5 }}>
                <Text style={{ color: "white", fontFamily: "MontserratSemibold" }}>{item.tasks.priority}</Text>
            </View>
        </>
    );

    return (
        <ScrollView>
            <CustomDrawer isOpen={isDrawerOpen} closeDrawer={closeDrawer} />
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ padding: 20, display: "flex", flexDirection: "row" }}>
                    <Image source={require("@/assets/images/swift.png")} style={styles.logoImage} />
                    <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10, fontFamily: "MontserratMedium" }}>TaskMate</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => router.push('/(main)/profile')}>
                        <Image source={require("@/assets/images/avatar2.jpg")} style={styles.profileImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openDrawer}>
                        <Image source={require("@/assets/images/menu.png")} style={styles.drawerImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ padding: 20 }}>
                <Text style={styles.header}>Start your Day & Be Productive ✌</Text>
                <View style={{ backgroundColor: "#40534C", padding: 10, borderRadius: 10, marginTop: 10 }}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="calendar" size={24} color="#fff" />
                        <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", marginLeft: 10, color: "#fff" }}>{formatDate(Date())}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 15, fontFamily: "MontserratMedium", color: "#93B1A6" }}>Current tasks</Text>
                        <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "#fff" }}>You have {todayTasks.length} task{todayTasks.length > 1 ? "s" : ""} for today</Text>
                        <View style={{ marginTop: 10, borderColor: "#93B1A6", borderWidth: 0.2 }} />
                        <View style={{ marginTop: 5, display: "flex", flexDirection: "row" }}>
                            <FlatList
                                data={todayTasks}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderPriority}
                                horizontal
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.taskInfoContainer}>
                    {todayTasks.length > 2 ? (
                        <>
                            <View style={{ backgroundColor: "#ffdac3", borderRadius: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                                <Text style={styles.taskInfoText}>You have a lot of tasks pending.</Text>
                                <FontAwesome name="exclamation-triangle" size={24} color="#FF8343" />
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={{ backgroundColor: "#677D6A", borderRadius: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, alignItems: "center" }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: 'MontserratSemibold',
                                    color: "#fff"
                                }}>Complete the below remaining tasks.</Text>
                                {/* <Feather name="chevron-down" size={20} color="white " />  */}
                            </View>
                        </>
                    )}
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Today's Task</Text>
                        <TouchableOpacity onPress={() => router.push("/(main)/assigned-dashboard")}>
                            <Text style={styles.headerSubtitle}>See all</Text>
                        </TouchableOpacity>
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
        fontSize: 25,
        fontFamily: 'MontserratSemibold',
        color: '#1A3636',
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
    avatarAdmin: {
        width: 25,
        height: 25,
        borderRadius: 25
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: 'lightgray',
        paddingVertical: 20,
        borderRadius: 10,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
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
        // paddingHorizontal: 20,
        marginTop: 10,
    },
    taskInfoText: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
        color: "#FF8343",
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
