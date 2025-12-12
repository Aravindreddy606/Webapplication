# React Native Expo Assignment

## Overview
This is an Expo app built with **TypeScript** and **Expo Router**. It features a WebView integration, a local notification system with interaction handling, and a full-featured HLS Video Player.

## 🛠 Tech Stack
- **Framework:** Expo (SDK 52)
- **Navigation:** Expo Router (File-based routing)
- **UI Library:** React Native Paper (Material Design components)
- **Video:** `expo-av` (Native video playback)
- **Web:** `react-native-webview`

## 🌟 Features & Bonus Implementation

### 1. WebView & Notifications (`app/index.tsx`)
- **Library Used:** `react-native-paper` Cards and Buttons for a polished UI.
- **Bonus:** A notification is automatically triggered when the WebView finishes loading (`onLoad` event).
- **Notifications:** Two distinct triggers with 2s and 5s delays.

### 2. Interactive Notifications (`app/_layout.tsx`)
- **Bonus:** Tapping the "5s + Link" notification triggers a listener in the root layout that parses the notification data (`{ screen: 'video' }`) and automatically navigates the user to the Video Player page.

### 3. HLS Video Player (`app/video.tsx`)
- **Playback:** Supports HLS `.m3u8` streams.
- **Controls:** Includes both native OS controls and custom-built buttons for Play/Pause, Mute/Unmute, and Seek +/- 10s.
- **Bonus:** Added a "Chip" selector to switch between different video streams dynamically.
