import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/providers/AuthProvider'

interface RemindersType {
    id: string;
    title: string;
    description: string;
    due_date: string;
    reminder_type: string;
    assigned_to: string;
    push_token: string;
}

const CheckReminders = () => {

    const { user } = useAuth()
    const userId = user?.id

    const [reminderData, setReminderData] = useState<RemindersType[]>([])

    useEffect(() => {
        const fetchReminders = async () => {
            const { data: reminders, error } = await supabase
                .from('reminders')
                .select('*')
                .eq('assigned_to', userId)
            if (error) {
                console.log('Error fetching reminders', error)
                return
            }
            setReminderData(reminders || [])
            console.log('Reminders', reminders)
        }

        fetchReminders()
    }, [])
    return (
        <View>
            <Text>CheckReminders</Text>
            <View>
                {reminderData.map((reminder) => (
                    <View key={reminder.id}>
                        <Text>{reminder.title}</Text>
                        <Text>{reminder.description}</Text>
                        <Text>{reminder.due_date}</Text>
                        <Text>{reminder.reminder_type}</Text>
                        <Text>{reminder.assigned_to}</Text>
                        <Text>{reminder.push_token}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default CheckReminders

const styles = StyleSheet.create({})