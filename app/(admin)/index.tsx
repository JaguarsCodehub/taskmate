import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const AdminDashboard = () => {
    return (
        <ScrollView>
            <View className='p-6'>
                <Text className='text-2xl' style={{ fontFamily: "MontserratSemibold" }}>AdminDashboard</Text>
            </View>
            <View className='mt-4 px-6'>
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
            </View>
        </ScrollView>
    )
}

export default AdminDashboard

const styles = StyleSheet.create({})

