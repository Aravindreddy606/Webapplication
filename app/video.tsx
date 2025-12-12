import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Button, Text, Chip, IconButton } from 'react-native-paper';


const STREAMS = [
    { label: 'Big Buck Bunny', uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { label: 'ARTE China, ABR', uri: 'https://test-streams.mux.dev/test_001/stream.m3u8' },
    { label: 'DK Turntable', uri: 'https://test-streams.mux.dev/tos_ismc/main.m3u8' },
    { label: 'Tears of Steel', uri: 'https://test-streams.mux.dev/pts_shift/master.m3u8' },
    { label: 'Ad-insertion in event stream', uri: 'https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8' },
];

export default function VideoScreen() {
    const video = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const switchStream = (index: number) => {
        if (index !== currentStreamIndex) {
            setIsLoading(true);
            setCurrentStreamIndex(index);
        }
    };

    const togglePlay = () => {
        status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync();
    };

    const seek = async (amount: number) => {
        if (status.positionMillis !== undefined) {
            video.current?.setPositionAsync(status.positionMillis + amount);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.videoWrapper}>

                <Video
                    ref={video}
                    style={styles.video}
                    source={{ uri: STREAMS[currentStreamIndex].uri }}
                    useNativeControls={true}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    shouldPlay={true}
                    onLoadStart={() => setIsLoading(true)}
                    onLoad={() => setIsLoading(false)}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />


                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#6200ea" />
                        <Text style={{ color: '#fff', marginTop: 10 }}>Loading Stream...</Text>
                    </View>
                )}
            </View>

            <View style={styles.controlsContainer}>
                <Text variant="headlineSmall" style={styles.title}>HLS Player</Text>

                <View style={styles.streamSelector}>
                    <Text variant="labelMedium" style={styles.sectionLabel}>Select Channel:</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {STREAMS.map((stream, index) => (
                            <Chip
                                key={index}
                                mode="outlined"
                                selected={currentStreamIndex === index}
                                showSelectedOverlay
                                onPress={() => switchStream(index)}
                                style={styles.chip}
                                textStyle={{ fontSize: 12 }}
                            >
                                {stream.label}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.controlRow}>
                    <IconButton icon="rewind-10" size={30} onPress={() => seek(-10000)} />

                    <IconButton
                        icon={status.isPlaying ? "pause-circle" : "play-circle"}
                        size={60}
                        iconColor="#6200ea"
                        onPress={togglePlay}
                        disabled={isLoading}
                    />

                    <IconButton icon="fast-forward-10" size={30} onPress={() => seek(10000)} />
                </View>

                <Button
                    mode="text"
                    icon={status.isMuted ? "volume-off" : "volume-high"}
                    onPress={() => video.current?.setIsMutedAsync(!status.isMuted)}
                >
                    {status.isMuted ? "Unmute" : "Mute"} Audio
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    videoWrapper: {
        width: '100%',
        height: 300,
        backgroundColor: '#000',
        justifyContent: 'center'
    },
    video: {
        width: '100%',
        height: '100%'
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    controlsContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 20,
        alignItems: 'center'
    },
    title: {
        marginBottom: 15,
        fontWeight: 'bold'
    },
    streamSelector: {
        width: '100%',
        marginBottom: 20,
    },
    sectionLabel: {
        marginLeft: 20,
        marginBottom: 8,
        opacity: 0.6
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    chip: {
        backgroundColor: '#f5f5f5',
        height: 36,
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 10
    },
});
