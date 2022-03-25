// import firebase from 'firebase/app';
import {
  getFirestore,
  serverTimestamp as firestoreServerTimestamp,
} from "firebase/firestore";
import { getDatabase, serverTimestamp } from "firebase/database";
import { initializeApp } from "firebase/app";

// var config = {
//   apiKey: "AIzaSyD3pmVVnQ-JbbrXdB1v4aCijaPgGyyj2sQ",
//   authDomain: "chatapp-react-firebase-fffb8.firebaseapp.com",
//   databaseURL: "https://chatapp-react-firebase-fffb8.firebaseio.com",
//   projectId: "chatapp-react-firebase-fffb8",
//   storageBucket: "chatapp-react-firebase-fffb8.appspot.com",
//   messagingSenderId: "555261399879"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCBrWUXTNA6xpyZB2hj2m_okTvbCvTaJpQ",
  authDomain: "chat-app-55b89.firebaseapp.com",
  projectId: "chat-app-55b89",
  storageBucket: "chat-app-55b89.appspot.com",
  messagingSenderId: "234952156129",
  appId: "1:234952156129:web:5cec626461fcdb0720a8a0",
  measurementId: "G-5D4VPC0LRQ",
};

const app = initializeApp(firebaseConfig);
// const firestoreApp = initializeFirestore(app);

const db = getFirestore(app);

const rtdb = getDatabase(app);

function setupPresence(loggedInUser) {
  const statusRef = rtdb.ref(`state/${loggedInUser.id}`);
  const userDoc = db.doc(`users/${loggedInUser.id}`);

  rtdb.ref(".info/connected").on("value", async (snapshot) => {
    const isOnline = snapshot.val();
    const online = {
      status: true,
      lastChanged: serverTimestamp(),
    };
    const offline = {
      status: false,
      lastChanged: serverTimestamp(),
    };
    const onlineForFirestore = {
      status: true,
      lastChanged: firestoreServerTimestamp(),
    };
    const offlineForFirestore = {
      status: true,
      lastChanged: firestoreServerTimestamp(),
    };
    if (isOnline) {
      // tell firebase in advance (when you are online), in case you are off, set this data for the ref
      await statusRef.onDisconnect().set(offline);

      await statusRef.set(online);
      // await userDoc.update({
      //   status: onlineForFirestore
      // })
    } else {
      // await userDoc.update({
      //   status: offlineForFirestore
      // })
    }
  });
}

export { db, rtdb, setupPresence };
