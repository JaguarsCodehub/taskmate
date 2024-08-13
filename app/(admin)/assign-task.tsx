import { Alert, Button, Platform, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
    const [adminId, setAdminId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: tasksData, error: tasksError } = await supabase.from('tasks').select("*");
                const { data: usersData, error: usersError } = await supabase.from('users').select("*");
                const { data: projectsData, error: projectsError } = await supabase.from('projects').select("*");
                const { data: clientsData, error: clientsError } = await supabase.from('clients').select("*");

                if (tasksError || usersError || projectsError || clientsError)
                    throw new Error(tasksError?.message || usersError?.message || projectsError?.message || clientsError?.message);

                const { data: adminData, error: adminError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('role', 'admin')
                    .single();

                if (adminError) throw adminError;

                setTasks(tasksData || []);
                setUsers(usersData || []);
                setProjects(projectsData || []);
                setClients(clientsData || []);
                setAdminId(adminData?.id || null);
            } catch (error: any) {
                Alert.alert("Error Fetching Data", error.message);
            }
        };

        fetchData();
    }, []);

    const handleAssignTask = async () => {
        if (!selectedTaskId || !selectedUserId || !selectedProjectId || !selectedClientId) {
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
                        assigned_by: adminId,
                        project_id: selectedProjectId,
                        client_id: selectedClientId,
                        start_date: startDate?.toISOString(),
                        due_date: deadlineDate?.toISOString(),
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

    return (
        <ScrollView>
            <View className='p-8'>
                <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Assign Task Screen</Text>
            </View>
            <View className='p-8'>
                <Text>Select Task</Text>
                <Picker
                    selectedValue={selectedTaskId}
                    onValueChange={(itemValue) => setSelectedTaskId(itemValue)}
                >
                    <Picker.Item label="Select a task" value="" />
                    {tasks.map((task) => (
                        <Picker.Item key={task.id} label={task.title} value={task.id} />
                    ))}
                </Picker>

                <Text>Select User</Text>
                <Picker
                    selectedValue={selectedUserId}
                    onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                >
                    <Picker.Item label="Select a user" value="" />
                    {users.map((user) => (
                        <Picker.Item key={user.id} label={user.full_name} value={user.id} />
                    ))}
                </Picker>

                <Text>Select Project</Text>
                <Picker
                    selectedValue={selectedProjectId}
                    onValueChange={(itemValue) => setSelectedProjectId(itemValue)}
                >
                    <Picker.Item label="Select a project" value="" />
                    {projects.map((project) => (
                        <Picker.Item key={project.id} label={project.name} value={project.id} />
                    ))}
                </Picker>

                <Text>Select Client</Text>
                <Picker
                    selectedValue={selectedClientId}
                    onValueChange={(itemValue) => setSelectedClientId(itemValue)}
                >
                    <Picker.Item label="Select a client" value="" />
                    {clients.map((client) => (
                        <Picker.Item key={client.id} label={client.name} value={client.id} />
                    ))}
                </Picker>

                <Text>Start Date</Text>
                <Button
                    title={startDate ? startDate.toDateString() : 'Select Start Date'}
                    onPress={() => setShowStartDatePicker(true)}
                />

                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onStartDateChange}
                    />
                )}

                <Text>Deadline Date</Text>
                <Button
                    title={deadlineDate ? deadlineDate.toDateString() : 'Select Deadline Date'}
                    onPress={() => setShowDeadlineDatePicker(true)}
                />

                {showDeadlineDatePicker && (
                    <DateTimePicker
                        value={deadlineDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDeadlineDateChange}
                    />
                )}

                <View style={{ marginTop: 20 }}>
                    <Button title="Assign Task" onPress={handleAssignTask} />
                </View>
            </View>
        </ScrollView>
    );
};

export default AssignTask;
