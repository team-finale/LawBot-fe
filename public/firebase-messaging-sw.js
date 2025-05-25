/// <reference lib="webworker" />
/* global firebase */

// @ts-ignore
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// @ts-ignore
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Firebase 초기화
firebase.initializeApp({
  apiKey: "AIzaSyCUXrr2tRzhf73f9hxNf0kvwAMr66ofdHM",
  authDomain: "lawon-8a4c9.firebaseapp.com",
  projectId: "lawon-8a4c9",
  storageBucket: "lawon-8a4c9.firebasestorage.app",
  messagingSenderId: "690630155174",
  appId: "1:690630155174:web:976c91c9c4c9dfd9bccd67"
});

const messaging = firebase.messaging();

// ✅ 타입 지정으로 TypeScript 오류 제거
/** @type {ServiceWorkerGlobalScope} */
const swSelf = self;

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신:", payload);

  const { title, body } = payload.notification;

  swSelf.registration.showNotification(title, {
    body,
    icon: "/firebase-logo.png"
  });
});
