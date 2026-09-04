self.addEventListener('push', event => {
  let data = {
    title: 'Pagamenti Familiari',
    body: 'Hai nuove scadenze da controllare.',
    url: '/family-payments/'
  };

  try {
    if (event.data) {
      data = {
        ...data,
        ...event.data.json()
      };
    }
  } catch (e) {
    console.error('Errore lettura push payload', e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/family-payments/icon-192.png',
      badge: '/family-payments/icon-192.png',
      data: {
        url: data.url || '/family-payments/'
      }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl =
    event.notification.data?.url ||
    '/family-payments/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {

      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
