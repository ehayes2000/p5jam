import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      cors: true,
      proxy: {
        '/api_base': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          ws: false,
          rewrite: (path) => {
            return path.replace(/^\/api_base/, '');
          },
        },
        '/ws/jam': {
          target: 'ws://localhost:3000',
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
