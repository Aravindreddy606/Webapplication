import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { Button, Card, Text, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function WebViewScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const notificationTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }

            if (Notifications?.setNotificationChannelAsync) {
                try {
                    await Notifications.setNotificationChannelAsync('default', {
                        name: 'Default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#FF231F7C',
                    } as any);
                } catch (e) {
                }
            }
        })();

        return () => {
            if (notificationTimeoutRef.current !== null) {
                clearTimeout(notificationTimeoutRef.current);
                notificationTimeoutRef.current = null;
            }
        };
    }, []);


    const triggerNotification = async (title: string, body: string, delaySec: number, data = {}) => {
        const secs = Math.max(0, Math.floor(delaySec));

        setSnackbarVisible(true);

        if (notificationTimeoutRef.current !== null) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }

        if (secs === 0) {
            await Notifications.scheduleNotificationAsync({
                content: { title, body, data },
                trigger: null,
            });
            return;
        }

        const id = setTimeout(async () => {
            try {
                await Notifications.scheduleNotificationAsync({
                    content: { title, body, data },
                    trigger: null,
                });
            } catch (err) {
                console.warn('Failed to show notification', err);
            } finally {
                notificationTimeoutRef.current = null;
            }
        }, secs * 1000);

        notificationTimeoutRef.current = id as unknown as number;
    };

    const handleWebViewLoad = () => {
        if (loading) {
            setLoading(false);
            triggerNotification('Page Loaded 🚀', 'The WebView is ready!', 1);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.webviewCard} contentStyle={{ flex: 1 }}>
                <View style={styles.webviewContainer}>
                    {loading && (
                        <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />
                    )}
                    <WebView
                        source={{ uri: 'https://www.google.com' }}
                        style={styles.webview}
                        onLoadEnd={handleWebViewLoad}
                        originWhitelist={['*']}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                </View>
            </Card>

            <View style={styles.controls}>
                <Text variant="titleMedium" style={styles.label}>Notification Triggers</Text>

                <View style={styles.buttonRow}>
                    <Button
                        mode="contained"
                        icon="bell"
                        onPress={() => triggerNotification('Reminder ⏰', 'Check your tasks!', 2)}
                    >
                        2s Delay
                    </Button>

                    <Button
                        mode="contained-tonal"
                        icon="video"
                        onPress={() => triggerNotification('New Video 🎥', 'Tap to watch the stream!', 5, { screen: 'video' })}
                    >
                        5s + Link
                    </Button>
                </View>

                <Button
                    mode="outlined"
                    style={styles.navButton}
                    onPress={() => router.push('/video')}
                >
                    Go to Video Player
                </Button>
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                Notification scheduled!
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f6f6', padding: 16 },
    webviewCard: { flex: 2, borderRadius: 12, overflow: 'hidden', elevation: 4 },
    webviewContainer: { flex: 1, position: 'relative' },
    webview: { flex: 1 },
    loader: { position: 'absolute', top: '50%', left: '50%', zIndex: 1, marginLeft: -18, marginTop: -18 },
    controls: { flex: 1, justifyContent: 'center', gap: 10, marginTop: 20 },
    label: { textAlign: 'center', marginBottom: 10, opacity: 0.7 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    navButton: { marginTop: 10, borderColor: '#6200ea' }
});
