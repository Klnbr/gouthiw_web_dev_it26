import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import firebaseapp from "firebase/compat/app";
import 'firebase/storage' 
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBob_hsCVI0S8-DoCxAayGQGqdPsY0xGX8",
  authDomain: "gouthiw-246ad.firebaseapp.com",
  projectId: "gouthiw-246ad",
  storageBucket: "gouthiw-246ad.appspot.com",
  messagingSenderId: "71587290592",
  appId: "1:71587290592:web:4f189587232889851f5f85",
  measurementId: "G-QCRKMH5B96"
};

// Initialize Firebase
// if(!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig)
// }
const firebase = initializeApp(firebaseConfig);

const messaging = getMessaging(firebase);
export {firebase , messaging };