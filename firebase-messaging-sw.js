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

messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] バックグラウンドメッセージ受信:', payload);

  var data = payload.data || {};
  var title = '🚗 新しい注文が入りました！';

  // ★ 文字列連結（+演算子）で安全に組み立てる ★
  var body = '';
  body = body + (data.buyerName || '購入者') + ' 様が ';
  body = body + (data.carName || '車両') + ' を注文しました。\n';
  body = body + 'グレード: ' + (data.gradeName || '未選択') + '\n';
  body = body + 'カラー: ' + (data.colorName || '未選択') + '\n';
  body = body + 'オプション: ' + (data.options || 'なし') + '\n';
  body = body + '合計金額: ' + (data.totalPrice || '0') + ' CR\n';
  body = body + 'クーポン: ' + (data.couponApplied || 'なし') + '\n';
  body = body + '注文ID: ' + (data.orderId || '不明');

  self.registration.showNotification(title, {
    body: body,
    icon: '/icons/icon-192x192.png',
    data: { url: data.click_action || 'https://twitter.com' }
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url || 'https://twitter.com';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
