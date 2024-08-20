import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';

interface Projects {
    id: string;
    name: string;
    description: string;
}

const ProjectsScreen = () => {

    const [projects, setProjects] = useState<Projects[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data: projectsData, error: projectsError } = await supabase.from('projects').select("*");
                if (projectsError) {
                    throw new Error(projectsError.message)
                }
                setProjects(projectsData)
            } catch (error: any) {
                throw new Error(error.message)
            }
        }

        fetchProjects()
    }, [])


    const handleTaskClick = (projectId: string) => {
        console.log(projectId)
        router.push({ pathname: `(admin)/projects/update-project`, params: { projectId }, },);
    };

    return (
        <ScrollView style={{ padding: 10 }}>
            <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 25, fontFamily: "MontserratSemibold" }}>Existing Projects</Text>
            </View>
            <View>
                {projects.map((project) => (
                    // <TouchableOpacity key={project.id} onPress={() => handleTaskClick(project.id)}>
                    <View key={project.id} style={{ marginTop: 12, backgroundColor: "#40534C", padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: "white", fontFamily: "MontserratSemibold", fontSize: 15 }}>{project.name}</Text>
                        <Text style={{ color: "white", fontFamily: "MontserratRegular", fontSize: 15 }}>{project.description}</Text>
                    </View>
                    // </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

export default ProjectsScreen

const styles = StyleSheet.create({})