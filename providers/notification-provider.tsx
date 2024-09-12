import { useState, useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import { supabase } from '@/utils/supabase';
import { useAuth } from './AuthProvider';
import moment from 'moment-timezone';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const TASK_NAME = 'check-task-notifications';

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export default function NotificationProvider1({ children }: any) {
    const { user } = useAuth();
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                Alert.alert(
                    notification.request.content.title || 'Notification',
                    notification.request.content.body || 'Notification Body'
                );
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });

        saveUserPushToken();
        registerBackgroundFetchAsync();
        subscribeToTaskChanges(); // Subscribe to real-time changes in tasks

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }

            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, [expoPushToken, user]);

    const saveUserPushToken = async () => {
        if (!user?.id || !expoPushToken) {
            Alert.alert(
                'Permission not granted for Notification!'
            );
            return;
        }

        const { error } = await supabase
            .from('users')
            .upsert({ id: user.id, push_token: expoPushToken })
            .eq('id', user.id);

        if (error) {
            console.log(error.message);
            // Alert.alert(error.message);
            return;
        }
        console.log(user.id);
        // Alert.alert('Push Token was saved');
    };

    const registerBackgroundFetchAsync = async () => {
        try {
            await BackgroundFetch.registerTaskAsync(TASK_NAME, {
                minimumInterval: 15 * 60, // Check every 15 minutes
                stopOnTerminate: false,
                startOnBoot: true,
            });
            console.log('Background fetch registered successfully');
            // Alert.alert('Background fetch registered successfully');
        } catch (err) {
            console.error('Failed to register background fetch:', err);
        }
    };

    const subscribeToTaskChanges = () => {
        const channel = supabase
            .channel('task_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_assignments' }, async (payload) => {
                console.log('Task inserted:', payload.new);
                const task = payload.new;
                // Schedule notification only for the assigned user
                await scheduleNotification(task);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'task_assignments' }, async (payload) => {
                console.log('Task updated:', payload.new);
                const task = payload.new;
                // Schedule notification only for the assigned user
                await scheduleNotification(task);
            })
            .subscribe();

        console.log('Subscribed to task changes');

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const scheduleNotification = async (task: any) => {
        try {
            // Fetch the user with the assigned_to ID
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('push_token')
                .eq('id', task.assigned_to)
                .single(); // Fetch a single user based on the ID

            if (userError) {
                console.error('Error fetching assigned user:', userError);
                return;
            }

            console.log(`Task assigned to: ${task.assigned_to}`);

            if (!user?.push_token) {
                console.warn(`No push token found for user ${task.assigned_to}`);
                return;
            }

            // Schedule the notification only for the assigned user
            const notificationTime = moment(task.notification_time)
                .tz('Asia/Kolkata')
                .toDate();
            const currentTime = new Date();

            if (notificationTime > currentTime) {
                const secondsUntilNotification = Math.floor(
                    (notificationTime.getTime() - currentTime.getTime()) / 1000
                );

                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Task Reminder',
                        body: `You have a task due at ${task.notification_time} with ID: ${task.task_id}`,
                    },
                    trigger: {
                        seconds: secondsUntilNotification,
                    },
                });

                console.log(
                    `Scheduled notification for task ID: ${task.task_id} to user: ${task.assigned_to} with push token: ${user.push_token}`
                );

                // Optionally send a push notification instantly for testing/debugging
                // await sendPushNotification(user.push_token, task.task_id);
            }
        } catch (error) {
            console.error('Error in scheduleNotification:', error);
        }
    };

    return children;
}

// Task manager function to check for notifications
TaskManager.defineTask(TASK_NAME, async () => {

    try {
        const { user } = useAuth();
        const userId = user?.id

        const now = new Date().toISOString();
        const kolkataTime = moment(now)
            .tz('Asia/Kolkata')
            .format('YYYY-MM-DD HH:mm:ssZ');

        const { data: tasks, error: tasksError } = await supabase
            .from('task_assignments')
            .select('assigned_to, task_id, notification_time')
            .eq('assigned_to', userId) // Only fetch tasks assigned to the current user
            .lte('notification_time', kolkataTime);

        console.log("UNDER TASKMANAGER", tasks)

        if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }

        if (tasks && tasks.length > 0) {
            for (const task of tasks) {
                // Fetch the push token for the assigned user
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('push_token')
                    .eq('id', task.assigned_to)
                    .single();

                if (userError) {
                    console.error('Error fetching user push token:', userError);
                    continue;
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
    try {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Task Reminder',
            body: `You have a task to complete! Task ID: ${taskId}`,
            data: { taskId },
        };

        console.log('Sending push notification:', message);

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        console.log('Push notification response:', result);

        if (response.status !== 200) {
            throw new Error(`Failed to send push notification: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
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
            // Alert.alert('Push Token', pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`Error getting a push token - ${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}
