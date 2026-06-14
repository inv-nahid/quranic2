import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
                'react-native': 'react-native-web',
                'expo-secure-store': path.resolve(__dirname, './src/lib/expo-secure-store-mock.ts'),
            },
        },
        server: {
            hmr: process.env.DISABLE_HMR !== 'true',
            watch: process.env.DISABLE_HMR === 'true' ? null : {},
        },
    };
});
