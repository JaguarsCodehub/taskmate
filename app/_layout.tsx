import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import AuthProvider, { useAuth } from '@/providers/AuthProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
    MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
    MontserratSemibold: require('../assets/fonts/Montserrat-SemiBold.ttf')
  });

  const { user, role } = useAuth();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (role) {
      switch (role) {
        case 'user':
          router.push('/(main)');
          break;
        case 'admin':
          router.push('/(admin)');
          break;
        case 'manager':
          router.push('/(manager)');
          break;
        default:
          console.error('Unknown role');
      }
    }
  }, [role]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
