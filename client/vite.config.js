import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // Load from .env
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
        }
      }
    }
  };
});
