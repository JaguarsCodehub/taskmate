import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust import as needed
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';


// Define types for project and client
interface Project {
    id: string;
    name: string;
    description?: string;
}

interface Client {
    id: string;
    name: string;
    contact_info?: any; // Adjust type based on your actual schema
}

const CreateTaskScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [clientId, setClientId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const fetchProjectsAndClients = async () => {
            try {
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*');
                // console.log(projectsData)

                const { data: clientsData, error: clientsError } = await supabase
                    .from('clients')
                    .select('*');
                // console.log(clientsData)

                const { data: usersData, error: userData } = await supabase
                    .from('users')
                    .select('*');
                console.log(usersData)


                if (projectsError || clientsError) throw new Error(projectsError?.message || clientsError?.message);

                setProjects(projectsData || []);
                setClients(clientsData || []);
            } catch (error: any) {
                Alert.alert('Error fetching data', error.message);
            }
        };

        fetchProjectsAndClients();
    }, []);

    const handleCreateTask = async () => {
        if (!projectId || !clientId) {
            Alert.alert('Error', 'Please select both a project and a client.');
            return;
        }

        try {
            const { error } = await supabase
                .from('tasks')
                .insert([
                    {
                        title,
                        description,
                        priority,
                        project_id: projectId,
                        client_id: clientId,
                        status: 'pending',
                    },
                ]);

            if (error) throw error;

            Alert.alert('Task created successfully');
            console.log("Data was added")
            router.back();
        } catch (error: any) {
            Alert.alert('Error creating task', error.message);
            console.log("Error: ", error.message)
        }
    };

    return (
        <View className='p-8'>
            <Text>Title</Text>
            <TextInput value={title} onChangeText={setTitle} />

            <Text>Description</Text>
            <TextInput value={description} onChangeText={setDescription} />

            <Text>Priority</Text>
            <TextInput value={priority} onChangeText={setPriority} />

            <Text>Project</Text>
            <Picker
                selectedValue={projectId}
                onValueChange={(itemValue: any) => setProjectId(itemValue)}
            >
                <Picker.Item label="Select a project" value="" />
                {projects.map((project) => (
                    <Picker.Item key={project.id} label={project.name} value={project.id} />
                ))}
            </Picker>

            <Text>Client</Text>
            <Picker
                selectedValue={clientId}
                onValueChange={(itemValue: any) => setClientId(itemValue)}
            >
                <Picker.Item label="Select a client" value="" />
                {clients.map((client) => (
                    <Picker.Item key={client.id} label={client.name} value={client.id} />
                ))}
            </Picker>

            <Button title="Create Task" onPress={handleCreateTask} />
        </View>
    );
};

export default CreateTaskScreen;
