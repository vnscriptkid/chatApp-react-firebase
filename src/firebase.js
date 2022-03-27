import {
  getFirestore,
  serverTimestamp as firestoreServerTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getDatabase,
  serverTimestamp,
  ref,
  onValue,
  onDisconnect,
  set,
} from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCBrWUXTNA6xpyZB2hj2m_okTvbCvTaJpQ",
  authDomain: "chat-app-55b89.firebaseapp.com",
  projectId: "chat-app-55b89",
  storageBucket: "chat-app-55b89.appspot.com",
  messagingSenderId: "234952156129",
  appId: "1:234952156129:web:5cec626461fcdb0720a8a0",
  measurementId: "G-5D4VPC0LRQ",
  databaseURL:
    "https://chat-app-55b89-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const rtdb = getDatabase(app);

function setupPresence(loggedInUser) {
  const statusRef = ref(rtdb, `/status/${loggedInUser.id}`);
  const userDoc = doc(db, `users/${loggedInUser.id}`);

  const onlineForFirebase = {
    state: "online",
    lastChanged: serverTimestamp(),
  };

  const offlineForFirebase = {
    state: "offline",
    lastChanged: serverTimestamp(),
  };
  const onlineForFirestore = {
    state: "online",
    lastChanged: firestoreServerTimestamp(),
  };
  const offlineForFirestore = {
    state: "offline",
    lastChanged: firestoreServerTimestamp(),
  };
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, async (snapshot) => {
    const isOnline = snapshot.val();

    if (isOnline) {
      // tell firebase what to do in advance when you go offline
      onDisconnect(statusRef).set(offlineForFirebase);

      set(statusRef, onlineForFirebase);

      await updateDoc(userDoc, {
        status: onlineForFirestore,
      });
    } else {
      await updateDoc(userDoc, {
        status: offlineForFirestore,
      });
    }
  });
}

export { db, rtdb, setupPresence };
