import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Biarkan akses dari luar (misalnya dari HP)
    port: 5175, // Pastikan port sesuai
    strictPort: true, // Gunakan port yang ditentukan
    allowedHosts: ["e46f-202-162-196-21.ngrok-free.app"], // Tambahkan host ngrok
  },
});
