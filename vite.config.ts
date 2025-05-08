import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // 빌드된 파일들이 저장될 폴더
    assetsDir: 'assets',  // 자산 파일들이 저장될 폴더
  },
});
