import { Alert, Button, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import PMMeetingComponent from '@/components/PMMeetingComponent';
import { LinearGradient } from 'expo-linear-gradient';

interface Task {
    id: string;
    title: string;
}

interface User {
    id: string;
    full_name: string;
}

interface Project {
    id: string;
    name: string;
}

interface Client {
    id: string;
    name: string;
}

const AssignTask = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [managerId, setManagerId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState<boolean>(false);

    const [startTime, setStartTime] = useState<Date | undefined>(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);

    const convertToUTC = (date: Date) => {
        // Convert the date to UTC time by subtracting the timezone offset
        const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return utcDate.toISOString().split('T')[1]; // Get time part "HH:MM:SS"
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: tasksData, error: tasksError } = await supabase.from('tasks').select("*");
                const { data: usersData, error: usersError } = await supabase.from('users').select("*");
                const { data: projectsData, error: projectsError } = await supabase.from('projects').select("*");
                const { data: clientsData, error: clientsError } = await supabase.from('clients').select("*");

                if (tasksError || usersError || projectsError || clientsError)
                    throw new Error(tasksError?.message || usersError?.message || projectsError?.message || clientsError?.message);

                const { data: managerData, error: managerError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('role', 'manager')
                    .single();
                // console.log("ManagerData:", managerData)

                if (managerError) throw managerError;

                setTasks(tasksData || []);
                setUsers(usersData || []);
                setProjects(projectsData || []);
                setClients(clientsData || []);
                setManagerId(managerData.id || null);
            } catch (error: any) {
                Alert.alert("Error Fetching Data", error.message);
            }
        };
        fetchData();
    }, []);

    // console.log("Manager Id: ",managerId)

    const handleAssignTask = async () => {

        const utcStartTime = startTime ? convertToUTC(startTime) : undefined;


        if (!selectedTaskId || !selectedUserId || !selectedProjectId || !selectedClientId || !startTime) {
            Alert.alert('Error', 'Please select a task, user, project, and client.');
            return;
        }

        try {
            const { error } = await supabase
                .from('task_assignments')
                .insert([
                    {
                        task_id: selectedTaskId,
                        assigned_to: selectedUserId,
                        assigned_by: managerId,
                        project_id: selectedProjectId,
                        client_id: selectedClientId,
                        start_date: startDate?.toISOString().split('T')[0],
                        due_date: deadlineDate?.toISOString().split('T')[0],
                        start_time: utcStartTime,
                    },
                ]);

            if (error) throw error;

            await supabase
                .from('tasks')
                .update({ status: 'in_progress' })
                .eq('id', selectedTaskId);

            Alert.alert('Task assigned successfully');
        } catch (error: any) {
            Alert.alert('Error assigning task', error.message);
        }
    };

    const onStartTimeChange = (event: any, selectedTime: Date | undefined) => {
        const currentTime = selectedTime || startTime;
        setShowStartTimePicker(Platform.OS === 'ios');
        setStartTime(currentTime);
    };

    const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const onDeadlineDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || deadlineDate;
        setShowDeadlineDatePicker(Platform.OS === 'ios');
        setDeadlineDate(currentDate);
    };

    // e2d1c3 fdfcfb
    return (
        <ScrollView>
            <LinearGradient
                colors={['#40534C', '#e2d1c3']}
                style={styles.background}
            />
            <View style={{ padding: 20 }}>

                <Text style={{ fontSize: 25, fontFamily: "MontserratSemibold", color: "white" }}>Assign Tasks to users as Manager</Text>
                <Text style={{ fontSize: 15, fontFamily: "MontserratRegular", color: "white", marginTop: 10 }}>You can assign specific tasks to users</Text>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <PMMeetingComponent />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.text}>Select Tasks from Vault</Text>
                <Picker
                    selectedValue={selectedTaskId}
                    onValueChange={(itemValue) => setSelectedTaskId(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a task" value="" style={{ borderRadius: 20 }} />
                    {tasks.map((task) => (
                        <Picker.Item key={task.id} label={task.title} value={task.id} style={{ borderRadius: 20 }} />
                    ))}
                </Picker>

                <Text style={styles.text}>Select user to assign</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedUserId}
                    onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                >
                    <Picker.Item label="Select a user" value="" />
                    {users.map((user) => (
                        <Picker.Item key={user.id} label={user.full_name} value={user.id} />
                    ))}
                </Picker>

                <Text style={styles.text}>Select one Project</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedProjectId}
                    onValueChange={(itemValue) => setSelectedProjectId(itemValue)}
                >
                    <Picker.Item label="Select a project" value="" />
                    {projects.map((project) => (
                        <Picker.Item key={project.id} label={project.name} value={project.id} />
                    ))}
                </Picker>

                <Text style={styles.text}>Select a Client</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedClientId}
                    onValueChange={(itemValue) => setSelectedClientId(itemValue)}
                >
                    <Picker.Item label="Select a client" value="" />
                    {clients.map((client) => (
                        <Picker.Item key={client.id} label={client.name} value={client.id} />
                    ))}
                </Picker>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                    <View>
                        <Text style={styles.text}>Start Date</Text>
                        <Button
                            title={startDate ? startDate.toDateString() : 'Select Start Date'}
                            onPress={() => setShowStartDatePicker(true)}
                            color={'#40534C'}
                        />
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={onStartDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>
                    <View>
                        <Text style={styles.text}>Deadline Date</Text>
                        <Button
                            title={deadlineDate ? deadlineDate.toDateString() : 'Select Deadline Date'}
                            onPress={() => setShowDeadlineDatePicker(true)}
                            color={'#40534C'}
                        />
                        {showDeadlineDatePicker && (
                            <DateTimePicker
                                value={deadlineDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={onDeadlineDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>
                </View>

                <View>
                    <Text style={styles.text}>Start Time</Text>
                    <Button
                        title={startTime ? startTime.toLocaleTimeString() : 'Select Start Time'}
                        onPress={() => setShowStartTimePicker(true)}
                        color={'#40534C'}
                    />
                    {showStartTimePicker && (
                        <DateTimePicker
                            value={startTime || new Date()}
                            mode="time"  // Mode set to 'time'
                            display="default"
                            onChange={onStartTimeChange} />
                    )}
                </View>

                <View style={{ marginTop: 20, paddingBottom: 60 }}>
                    <TouchableOpacity onPress={handleAssignTask} style={{ backgroundColor: "#40534C", padding: 10, borderRadius: 5, paddingVertical: 10 }}>
                        <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold", textAlign: "center", color: "#eee" }}>Assign Task</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default AssignTask;

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        fontFamily: "MontserratSemibold",
        marginTop: 10,
        color: "#FFF"
    },
    picker: {
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10,
        // padding:
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    }
})