import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
