// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import 'firebase/compat/storage' 

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
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export {firebase};