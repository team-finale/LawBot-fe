import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',      // 빌드된 파일들이 저장될 폴더
    assetsDir: 'assets', // 자산 파일들이 저장될 폴더
  },
  base: '/',  // 루트 경로에서 배포하려면 base를 빈 문자열로 설정
});