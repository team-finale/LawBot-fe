import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ✅ 서비스워커 수동 등록 (중요)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ Service Worker 등록 완료:", registration);
    })
    .catch((err) => {
      console.error("❌ 등록 실패:", err);
    });
}
