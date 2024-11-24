import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/-vk/miniapp/waatp',
    server: {
        port: 8900,
        proxy: {
            '/-vk/miniapp/waatp/api': {
                target: 'http://127.0.0.1:9000',
                rewrite: (path) => path.replace('/-vk', ''),
            },
            '/-vk/miniapp/waatp/auth': {
                target: 'http://127.0.0.1:9000',
                rewrite: (path) => path.replace('/-vk', ''),
            },
        },
    },
    resolve: {
        alias: {
            '@waatp': path.resolve(__dirname, '../core/src'),
        },
    },
});
