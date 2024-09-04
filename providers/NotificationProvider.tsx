
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import { supabase } from '@/utils/supabase';
import { useAuth } from './AuthProvider';
import moment from 'moment-timezone'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

const TASK_NAME = 'check-task-notifications';

export default function NotificationProvider({ children }: any) {
    const { user } = useAuth();
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            Alert.alert(
                notification.request.content.title || 'Notification',
                notification.request.content.body || 'Notification Body',
            );
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        })

        saveUserPushToken();

        registerBackgroundFetchAsync(); // Register background fetch

        // scheduleNotifications();

        const now = new Date().toISOString();
        const kolkataTime = moment(now).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ssZ');


        console.log(kolkataTime);

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }

            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, [expoPushToken, user]);

    const saveUserPushToken = async () => {
        if (!user?.id || !expoPushToken) {
            Alert.alert("Permission not granted to get push token for push notification!");
            return;
        }

        const { error } = await supabase
            .from('users')
            .upsert({ id: user.id, push_token: expoPushToken }) // include the id field
            .eq('id', user.id);

        if (error) {
            console.log(error.message);
            Alert.alert(error.message);
            return;
        }
        console.log(user.id);
        Alert.alert("Push Token was saved");
    };

    const registerBackgroundFetchAsync = async () => {
        try {
            await BackgroundFetch.registerTaskAsync(TASK_NAME, {
                minimumInterval: 15 * 60, // Check every 15 minutes
                stopOnTerminate: false,   // Don't stop background fetch when the app is terminated
                startOnBoot: true,        // Restart background fetch when the device is rebooted
            });
            console.log('Background fetch registered successfully');
            Alert.alert('Background fetch registered successfully');
        } catch (err) {
            console.error('Failed to register background fetch:', err);
        }
    };

    // const scheduleNotifications = async () => {
    //     await Notifications.scheduleNotificationAsync({
    //         content: {
    //             title: "Time's up!",
    //             body: 'Change sides!',
    //         },
    //         trigger: {
    //             seconds: 60 * 60,
    //         },
    //     });
    //     console.log("Notification sent")
    // }

    return children;
}

// Task manager function to check for notifications
TaskManager.defineTask(TASK_NAME, async () => {
    try {

        const now = new Date().toISOString();
        const kolkataTime = moment(now).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ssZ');

        // Fetch tasks where the current time is greater than or equal to the notification_time
        const { data: tasks, error: tasksError } = await supabase
            .from('task_assignments')
            .select('assigned_to, task_id, notification_time')
            .lte('notification_time', kolkataTime);

        if (tasks) {
            console.log("Tasks Data on this time:", tasks)
        }

        if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }

        if (tasks && tasks.length > 0) {
            console.log('Tasks to notify:', tasks);

            for (const task of tasks) {
                // Fetch the push token for the user assigned to the task
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('push_token')
                    .eq('id', task.assigned_to)
                    .single();

                if (userError) {
                    console.error('Error fetching user push token:', userError);
                    continue; // Skip to the next task if there's an error
                }

                if (user && user.push_token) {
                    await sendPushNotification(user.push_token, task.task_id);
                    console.log('Sent push notification for task:', task.task_id);
                } else {
                    console.warn(`No push token found for user ${task.assigned_to}`);
                }
            }
        }

        return tasks.length > 0
            ? BackgroundFetch.BackgroundFetchResult.NewData
            : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
        console.error('Error in background task:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

// Function to send push notifications
async function sendPushNotification(expoPushToken: string, taskId: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Task Reminder',
        body: `You have a task to complete! Task ID: ${taskId}`,
        data: { taskId },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    console.log("Notifiaction was sent", message)
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 500, 500],
            lightColor: '#D6BD98',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            Alert.alert('Push Token', pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`Error getting a push token - ${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}
