import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

// ✅ 알림 권한 요청 및 토큰 발급
export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  console.log("🔔 권한 상태:", permission);

  if (permission !== "granted") {
    console.warn("🚫 알림 권한이 허용되지 않았습니다.");
    return;
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration, // ✅ 명시적 등록
    });

    if (token) {
      console.log("✅ FCM Token:", token);
    } else {
      console.warn("⚠️ 토큰을 받아오지 못했습니다.");
    }
  } catch (err) {
    console.error("❌ getToken() 실패:", err);
  }
};

// ✅ 포그라운드 메시지 수신
export const onForegroundMessage = (callback: (payload: any) => void) => {
  onMessage(messaging, callback);
};
