importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCffFYNOEcrGu2GKgSiE6q6KgGkCtxJEFw",
  authDomain: "kakuusha-gai.firebaseapp.com",
  projectId: "kakuusha-gai",
  storageBucket: "kakuusha-gai.firebasestorage.app",
  messagingSenderId: "460103021741",
  appId: "1:460103021741:web:40ed966e261ed657e80224"
});

const messaging = firebase.messaging();

// ★ バックグラウンドメッセージ（データメッセージ）の処理
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] バックグラウンドメッセージ受信:', payload);

  // ★ notification がなくてもエラーにならないようにガード
  const notificationTitle = payload.notification?.title || '新着通知';
  const notificationBody = payload.notification?.body || '詳細はアプリで確認してください';
  const clickAction = payload.data?.click_action || 'https://twitter.com';

  const options = {
    body: notificationBody,
    icon: '/icons/icon-192x192.png',
    data: { url: clickAction }
  };

  self.registration.showNotification(notificationTitle, options);
});

// ★ 通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || 'https://twitter.com';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
