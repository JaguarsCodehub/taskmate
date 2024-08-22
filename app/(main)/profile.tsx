import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/providers/AuthProvider'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for selecting images
import { uploadImageAsync } from '@/utils/uploadImageAsync'

const { width, height } = Dimensions.get('window')

interface Users {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
}

const Profile = () => {
    const { user } = useAuth();
    const userId = user?.id;
    const [users, setUsers] = useState<Users>();
    const [image, setImage] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newFullName, setNewFullName] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name, username, avatar_url')
                .eq('id', userId)
                .single();
            if (error) {
                console.error(error);
                Alert.alert('Error', 'Could not fetch user data');
            } else {
                setUsers(data);
                setImage(data.avatar_url);
                setNewUsername(data.username);
                setNewFullName(data.full_name);
            }
        };

        fetchUsers();
    }, [userId]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission required", "You need to grant permission to access the media library.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            try {
                const imageUrl = await uploadImageAsync(uri);
                if (imageUrl) {
                    setImage(imageUrl);
                } else {
                    Alert.alert('Error', 'Could not upload image');
                }
            } catch (error) {
                Alert.alert('Error', 'Could not upload image');
                console.error(error);
            }
        }
    };


    const updateProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    username: newUsername,
                    full_name: newFullName,
                    avatar_url: image
                })
                .eq('id', userId);

            if (error) {
                throw error;
            } else {
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not update profile');
            console.error(error);
        }
    };


    return (
        <ScrollView>
            <LinearGradient
                colors={['#fdfcfb', '#677D6A']}
                style={styles.background}
            />
            <View style={{ padding: 20, height: '100%' }}>
                <Text style={{ fontSize: 25, fontFamily: "MontserratSemibold" }}>Update Profile</Text>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Current Username</Text>
                    <TextInput placeholder={users?.username} value={newUsername}
                        onChangeText={setNewUsername} style={{ fontSize: 15, fontFamily: "MontserratSemibold" }} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Your Full Name</Text>
                    <TextInput placeholder={users?.full_name} value={newFullName} onChangeText={setNewFullName} style={{ fontSize: 15, fontFamily: "MontserratSemibold" }} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 20, fontFamily: "MontserratSemibold" }}>Your Profile Photo</Text>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: image }}
                            style={styles.profileImage}
                            resizeMode='cover'
                        />
                        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                            <Ionicons name="camera" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 25 }}>
                    <TouchableOpacity onPress={updateProfile} style={{ backgroundColor: "#40534C", padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, fontFamily: "MontserratSemibold", color: "white", textAlign: "center" }}>Save Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    imageContainer: {
        position: 'relative',
        width: 200,
        height: 200,
        marginTop: 10
    },
    profileImage: {
        borderRadius: 15,
        width: '100%',
        height: '100%',
    },
    editIcon: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: '#00000080',
        padding: 5,
        borderRadius: 20,
    },
})
