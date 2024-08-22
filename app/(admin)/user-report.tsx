import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/utils/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReportTasks from '@/components/ui/ReportTasks';

interface User {
    id: string;
    full_name: string;
}

interface TaskReport {
    title: string;
    description: string;
    priority: string;
    status: string;
    start_date: string;
    due_date: string;
    assigned_at: string;
    assigned_by_name: string;
}

const UserReport: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [taskReport, setTaskReport] = useState<TaskReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.from('users').select('id, full_name');
            if (error) {
                console.error(error);
                return;
            }
            setUsers(data);
        };

        fetchUsers();
    }, []);

    const fetchTaskReport = async (userId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select(`
        title,
        description,
        priority,
        status,
        task_assignments (
          assigned_at,
          start_date,
          due_date,
          users!task_assignments_assigned_by_fkey (full_name)
        )
      `)
            .eq('task_assignments.assigned_to', userId);

        if (error) {
            console.error(error);
        } else {
            const report = data.map((task: any) => ({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                start_date: task.task_assignments[0]?.start_date,
                due_date: task.task_assignments[0]?.due_date,
                assigned_at: task.task_assignments[0]?.assigned_at,
                assigned_by_name: task.task_assignments[0]?.users?.full_name || 'Unknown',
            }));
            setTaskReport(report);
        }
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={{ fontSize: 25, fontFamily: "MontserratSemibold" }}>
                Get User's Report
            </Text>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontFamily: "MontserratMedium" }}>You need to select a User to get his report</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedUserId}
                    onValueChange={(itemValue) => {
                        setSelectedUserId(itemValue);
                        if (itemValue) {
                            fetchTaskReport(itemValue);
                        }
                    }}>
                    <Picker.Item label="Select a User" value={null} style={{ fontFamily: "MontserratSemibold" }} />
                    {users.map((user) => (
                        <Picker.Item key={user.id} label={user.full_name} value={user.id} style={{ fontFamily: "MontserratSemibold" }} />
                    ))}
                </Picker>
            </View>

            {!selectedUserId ? (
                <>
                    <View style={{ backgroundColor: "#ffc3c3", borderRadius: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                        <Text style={styles.taskInfoText}>Select A User Id First</Text>
                        <FontAwesome name="exclamation-triangle" size={24} color="#ff4343" />
                    </View>
                </>) : (
                <>
                    <View style={{ backgroundColor: "#00a558", borderRadius: 5, display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
                        <Text style={styles.checkInfoText}>Check User's Report</Text>
                        <Ionicons name="checkmark-done-circle" size={24} color="#43ffa4" />
                    </View>
                </>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={{ marginTop: 40, paddingBottom: 50 }}>
                    {taskReport ? (<><ReportTasks taskReport={taskReport} /></>) : (<></>)}
                </View>
            )}
        </ScrollView>
    );
};

export default UserReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // paddingBottom: 140
    },
    reportItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
    },
    title: {
        fontSize: 18,
        fontFamily: "MontserratSemibold"
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#E2DAD6',
        borderRadius: 60,
        fontWeight: '700',
        marginTop: 10
    },
    taskInfoText: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
        color: "#ff4343",
    },
    checkInfoText: {
        fontSize: 15,
        fontFamily: 'MontserratSemibold',
        color: "#43ffa4",
    }
});
