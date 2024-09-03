import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from '@/utils/supabase';
import { useAuth } from './AuthProvider';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export default function NotificationProvider({ children }: any) {

    const { user } = useAuth()
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();



    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            Alert.alert(
                notification.request.content.title || 'Notification',
                notification.request.content.body || 'Notification Body',
            )
        })
        console.log("User ID:", user?.id)
        saveUserPushToken()


        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
        }

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

    return children
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
        // console.log(projectId)
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



async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
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
}