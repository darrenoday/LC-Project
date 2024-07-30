import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this matches your frontend port
    cors: true,
    hmr: {
      overlay: true, // Set to false if needed
    },
  },
});
