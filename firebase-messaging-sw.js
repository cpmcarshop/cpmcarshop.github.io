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
  const data = payload.data || {};
  const title = '🚗 新しい注文が入りました！';
  const body =
    `${data.buyerName || '購入者'} 様が ${data.carName || '車両'} を注文しました。\n` +
    `グレード: ${data.gradeName || '未選択'}\n` +
    `カラー: ${data.colorName || '未選択'}\n` +
    `オプション: ${data.options || 'なし'}\n` +
    `合計金額: ${data.totalPrice || '0'} CR\n` +
    `クーポン: ${data.couponApplied || 'なし'}\n` +
    `注文ID: ${data.orderId || '不明'}`;

  self.registration.showNotification(title, {
    body: body,
    icon: '/icons/icon-192x192.png',
    data: { url: data.click_action || 'https://twitter.com' }
  });
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
