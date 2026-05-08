// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBJxFJ1qChuwU920nBgc5wz-KfqEV0DnaM",
  authDomain: "riko-logistic.firebaseapp.com",
  projectId: "riko-logistic",
  storageBucket: "riko-logistic.firebasestorage.app",
  messagingSenderId: "531492416626",
  appId: "1:531492416626:web:331d5f02ca5268d759e6eb",
  measurementId: "G-P8TXGTQ3Z2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  // Log the entire payload for debugging
  console.log("Received background message:", payload);

  // Extract title, body, and url from the payload
  const title = payload.data.title || "Default Title";
  const body = payload.data.body || "Default message body";
  const url = payload.data.url || "http://localhost:5173/";

  // Log the extracted data
  console.log("Notification Data:", { title, body, url });

  const options = {
    body: body,
    icon: payload.data.icon || '/icons/icon-192x192.png',
    data: {
      url: url,  // Make sure URL is correctly set
    },
  };

  // Show the notification
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  const url = event.notification.data.url;
  console.log("Notification clicked. Navigating to URL:", url); // Log the URL
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
