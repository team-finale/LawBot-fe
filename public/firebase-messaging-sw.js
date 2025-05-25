/* global firebase */
// @ts-ignore
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// @ts-ignore
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Firebase 초기화 (하드코딩된 설정값 사용 — .env는 여기서 못 씀)
firebase.initializeApp({
  apiKey: "AIzaSyCUXrr2tRzhf73f9hxNf0kvwAMr66ofdHM",
  authDomain: "lawon-8a4c9.firebaseapp.com",
  projectId: "lawon-8a4c9",
  storageBucket: "lawon-8a4c9.firebasestorage.app",
  messagingSenderId: "690630155174",
  appId: "1:690630155174:web:976c91c9c4c9dfd9bccd67"
});

// FCM 백그라운드 메시지 핸들링
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신:", payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/firebase-logo.png" // public 폴더에 있는 아이콘 (필요시 변경 가능)
  });
});
