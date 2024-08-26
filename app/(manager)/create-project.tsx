import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');


const CreateProjects = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateProject = async () => {
        try {
            const { error } = await supabase
                .from('projects')
                .insert([
                    {
                        name,
                        description,
                    },
                ]);

            if (error) throw error;

            Alert.alert('Project was created successfully');
            router.push("/(manager)");
        } catch (error: any) {
            Alert.alert('Error creating project', error.message);
            console.log("Error:", error.message)
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <LinearGradient
                colors={['#40534C', '#e2d1c3']}
                style={styles.background}
            />
            <View style={{ padding: 10 }}>
                <View>
                    <Text style={{ fontSize: 30, fontFamily: "MontserratSemibold", color: "white" }}>Create Projects as Manager</Text>
                    <Text style={{ fontSize: 15, fontFamily: "MontserratRegular", color: "white" }}>Create new Projects</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={styles.holder}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white" }}>Name</Text>
                        <TextInput placeholderTextColor={'#fff'} style={styles.textInput} value={name} onChangeText={setName} placeholder='Add Project Name' />
                    </View>

                    <View style={styles.holder}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white" }}>Description</Text>
                        <TextInput placeholderTextColor={'#fff'} style={styles.textInput} value={description} onChangeText={setDescription} placeholder='Give a Description to your Project' />
                    </View>


                    <TouchableOpacity onPress={handleCreateProject} style={{ backgroundColor: "#40534C", padding: 10, marginTop: 20, borderRadius: 5 }}>
                        <Text style={{ fontSize: 18, fontFamily: "MontserratSemibold", color: "white", textAlign: "center" }}>Create Project</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CreateProjects;

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    holder: {
        marginTop: 10
    },
    textInput: {
        padding: 10,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10
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
})
