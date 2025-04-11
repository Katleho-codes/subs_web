importScripts(
    "https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js"
);
// todo: switch to env before pushing
firebase.initializeApp({
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);

    const { title, body, image } = payload.notification;

    self.registration.showNotification(title, {
        body,
        icon: image || "/logo192.png",
    });
});

// 🔐 Firebase client config is safe to be public. Even the Firebase docs say so.
// Handles background push notifications when your site isn’t open. Registered via navigator.serviceWorker.register(...).
