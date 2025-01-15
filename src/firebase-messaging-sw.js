importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBob_hsCVI0S8-DoCxAayGQGqdPsY0xGX8",
    authDomain: "gouthiw-246ad.firebaseapp.com",
    projectId: "gouthiw-246ad",
    storageBucket: "gouthiw-246ad.appspot.com",
    messagingSenderId: "71587290592",
    appId: "1:71587290592:web:4f189587232889851f5f85",
    measurementId: "G-QCRKMH5B96"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
