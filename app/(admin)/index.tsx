import { Button, ScrollView, StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity, Touchable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import CreditSummaryScreen from '@/components/CreditSummaryScreen';
import { format, startOfToday, endOfToday } from 'date-fns';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import AdminDrawer from '@/components/ui/AdminDrawer';


const { width, height } = Dimensions.get('window');


const AdminDashboard = () => {
    const { user } = useAuth();
    const [todayTasks, setTodayTasks] = useState<any[]>([]);
    const userId = user?.id; // Get this from your user context/auth state

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMMM yyyy');
    };

    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setDrawerOpen(false)
    }

    return (
        <ScrollView>
            <AdminDrawer isOpen={isDrawerOpen} closeDrawer={closeDrawer} />
            <View style={styles.container}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#fdfcfb', '#e2d1c3']}
                    style={styles.background}
                />
                <View style={{ padding: 20, marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                        <Text className='text-2xl' style={{ fontFamily: "MontserratSemibold", fontSize: 25 }}>Hello, Admin</Text>
                        <Text className='text-2xl' style={{ fontFamily: "MontserratRegular", fontSize: 20 }}>This is your Admin Dashboard</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={openDrawer}>
                            <Image source={require("@/assets/images/menu.png")} style={styles.drawerImage} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20 }}>

                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => router.push('/(admin)/create-task')}>
                        <View style={{ backgroundColor: "#1A3636", padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "white" }}>Create Tasks</Text>
                                <View style={{ backgroundColor: "#F8EDED", padding: 2, width: 60, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 10, fontFamily: "MontserratSemibold", color: "black", textAlign: "center" }}>Create</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", color: "white" }}>Tasks are created for users to complete it</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(admin)/assign-task')}>
                        <View style={{ backgroundColor: "#40534C", padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "white" }}>Assign Tasks</Text>
                                <View style={{ backgroundColor: "#F8EDED", padding: 2, width: 60, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 10, fontFamily: "MontserratSemibold", color: "black", textAlign: "center" }}>Assign</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", color: "white" }}>Tasks are created for users to complete it</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(admin)\\update-task')}>
                        <View style={{ backgroundColor: "#677D6A", padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "white" }}>Update Tasks</Text>
                                <View style={{ backgroundColor: "#F8EDED", padding: 2, width: 60, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 10, fontFamily: "MontserratSemibold", color: "black", textAlign: "center" }}>Update</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", color: "white" }}>Tasks are created for users to complete it</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(admin)/projects')}>
                        <View style={{ backgroundColor: "#D6BD98", padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "white" }}>Check Projects</Text>
                                <View style={{ backgroundColor: "#F8EDED", padding: 2, width: 60, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 10, fontFamily: "MontserratSemibold", color: "black", textAlign: "center" }}>projects</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", color: "white" }}>Tasks are created for users to complete it</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(admin)\\user-report')}>
                        <View style={{ backgroundColor: "#FFF", padding: 10, borderRadius: 10, marginTop: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", color: "black" }}>Get User's Report</Text>
                                <View style={{ backgroundColor: "#F8EDED", padding: 2, width: 60, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 10, fontFamily: "MontserratSemibold", color: "black", textAlign: "center" }}>projects</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 15, fontFamily: "MontserratRegular", color: "black" }}>Get details on User's Report</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* <View className='mt-4 px-6'>
                <Button
                    title='Create New Task'
                    onPress={() => router.push('/(admin)/create-task')}
                />
            </View>
            <View className='mt-4 px-6'>
                <Button
                    title='Assign Tasks'
                    onPress={() => router.push('/(admin)/assign-task')}
                />
            </View>
            <View className='mt-4 px-6'>
                <Button
                    title='Update Task'
                    onPress={() => router.push('/(admin)\\update-task')}
                />
            </View>
            <View className='mt-4 px-6'>
                <Button
                    title='Delete Tasks'
                    onPress={() => router.push('/(admin)/delete-task')}
                />
            </View>
            <View className='mt-4 px-6'>
                <Button
                    title='Projects'
                    onPress={() => router.push('/(admin)/projects')}
                />
            </View> */}
            </View>

        </ScrollView>
    )
}

export default AdminDashboard

const styles = StyleSheet.create({
    container: {
        height: height,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'orange',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    drawerImage: {
        width: 30,
        height: 30,
    },
})

