import { supabase } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, Platform, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface User {
    id: string;
    full_name: string;
}

export default function CreateReminders() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [reminderType, setReminderType] = useState('');
    const [notifyBeforeDays, setNotifyBeforeDays] = useState<number[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data: usersData, error: usersError } = await supabase.from('users').select("*");
            if (usersError) throw new Error(usersError?.message);
            setUsers(usersData || []);
        }
        fetchUsers();
    }, []);

    const addReminder = async () => {
        try {
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('push_token')
                .eq('id', userId)
                .single();
            if (userError) {
                Alert.alert('Error fetching user', userError.message);
                return;
            }
            const pushToken = user.push_token;

            const { data: reminder, error: reminderError } = await supabase
                .from('reminders')
                .insert([
                    {
                        title,
                        description,
                        assigned_to: userId,
                        push_token: pushToken,
                        due_date: dueDate.toISOString().split('T')[0],
                        reminder_type: reminderType,
                        notify_before_days: notifyBeforeDays,
                    },
                ]);

            if (reminderError) {
                Alert.alert('Error adding reminder', reminderError.message);
                return;
            }

            Alert.alert('Reminder added successfully!');
            setTitle('');
            setDescription('');
            setUserId('');
            setDueDate(new Date());
            setPriority('');
            setReminderType('');
            setNotifyBeforeDays([]);
        } catch (error: any) {
            Alert.alert('Unexpected error', error.message);
        }
    };

    const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dueDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Reminder Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Reminder Description"
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.label}>Select User:</Text>
            <Picker
                style={styles.picker}
                selectedValue={userId}
                onValueChange={(itemValue) => setUserId(itemValue)}
            >
                <Picker.Item label="Select a user" value="" />
                {users.map((user) => (
                    <Picker.Item key={user.id} label={user.full_name} value={user.id} />
                ))}
            </Picker>
            <View style={styles.dateContainer}>
                <Text style={styles.label}>Start Date</Text>
                <Button
                    title={dueDate ? dueDate.toDateString() : 'Select Start Date'}
                    onPress={() => setShowStartDatePicker(true)}
                    color={'#40534C'}
                />
                {showStartDatePicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onStartDateChange}
                        minimumDate={new Date()}
                    />
                )}
            </View>
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Select Reminder Type:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={reminderType}
                    onValueChange={(itemValue) => setReminderType(itemValue)}
                >
                    <Picker.Item label="Select Reminder Type" value="" />
                    <Picker.Item label="Monthly" value="monthly" />
                    <Picker.Item label="Quarterly" value="quarterly" />
                    <Picker.Item label="Half-Yearly" value="half-yearly" />
                    <Picker.Item label="Yearly" value="yearly" />
                </Picker>
            </View>

            <Button title="Add Reminder" onPress={addReminder} color={'#40534C'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F8F8F8',
        flex: 1,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    picker: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 15,
    },
    dateContainer: {
        marginBottom: 20,
    },
    pickerContainer: {
        marginBottom: 20,
    },
});
