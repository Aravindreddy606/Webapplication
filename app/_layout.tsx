import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#6200ea',
        secondary: '#03dac6',
    },
};

export default function RootLayout() {
    const router = useRouter();

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;

            if (data?.screen === 'video') {
                router.push('/video');
            }
        });

        return () => subscription.remove();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.primary },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'WebView Portal' }} />
                <Stack.Screen name="video" options={{ title: 'HLS Player' }} />
            </Stack>
        </PaperProvider>
    );
}
