import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';

const UpdateProject = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();
    const { projectId } = useLocalSearchParams<{ projectId: string }>();
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();
            console.log(projectId)
            console.log(data)
            if (error) {
                console.error(error);
                Alert.alert('Error', 'Project not found');
            } else {
                setProject(data);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleUpdateTask = async () => {
        if (!name || !description) {
            Alert.alert("Error", "Please update the inputs first");
            return;
        }

        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    name: name || project.name, // Fallback to current value if input is empty
                    description: description || project.description,
                })
                .eq('id', projectId); // Add WHERE clause

            if (error) throw error;

            Alert.alert("Task was updated successfully");
            setName("");
            setDescription("");
            // router.back(); // Optionally navigate back or to another screen
        } catch (error: any) {
            Alert.alert('Error updating task', error.message);
            console.log(error);
        }
    };


    return (
        <View className='p-8'>
            <View>
                <Text className='text-2xl'>Update Project</Text>
            </View>
            <View style={{ marginTop: 24 }}>
                <Text>Change Name</Text>
                <TextInput
                    placeholder={project.name}
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View>
                <Text>Change Description</Text>
                <TextInput
                    placeholder={project.description}
                    value={description}
                    onChangeText={setDescription}
                />
            </View>
            <View>
                <Button
                    title='Update Task'
                    onPress={handleUpdateTask}
                />
            </View>
        </View>
    )
}

export default UpdateProject

const styles = StyleSheet.create({})