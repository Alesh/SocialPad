import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/-vk/standalone/waatp',
    server: {
        port: 8800,
        proxy: {
            '/-vk/standalone/waatp/api': {
                target: 'http://127.0.0.1:9000',
                rewrite: (path) => path.replace('/-vk', ''),
            },
            '/-vk/standalone/waatp/auth': {
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
