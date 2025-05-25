import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  console.log("FCM Token:", token);
};

export const onForegroundMessage = (callback: (payload: any) => void) => {
  onMessage(messaging, callback);
};