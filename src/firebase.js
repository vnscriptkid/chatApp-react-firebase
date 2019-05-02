import firebase from 'firebase/app'; 
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';

var config = {
  apiKey: "AIzaSyD3pmVVnQ-JbbrXdB1v4aCijaPgGyyj2sQ",
  authDomain: "chatapp-react-firebase-fffb8.firebaseapp.com",
  databaseURL: "https://chatapp-react-firebase-fffb8.firebaseio.com",
  projectId: "chatapp-react-firebase-fffb8",
  storageBucket: "chatapp-react-firebase-fffb8.appspot.com",
  messagingSenderId: "555261399879"
};

firebase.initializeApp(config);

const db = firebase.firestore();
const rtdb = firebase.database();

function setupPresence(loggedInUser) {
  const statusRef = rtdb.ref(`state/${loggedInUser.id}`);
  const userDoc = db.doc(`users/${loggedInUser.id}`)
  
  rtdb.ref('.info/connected').on('value', async (snapshot) => {
    const isOnline = snapshot.val();
    const online = {
      status: true,
      lastChanged: firebase.database.ServerValue.TIMESTAMP
    }
    const offline = {
      status: false,
      lastChanged: firebase.database.ServerValue.TIMESTAMP 
    }
    const onlineForFirestore = {
      status: true,
      lastChanged: firebase.firestore.FieldValue.TIMESTAMP
    }
    const offlineForFirestore = {
      status: true,
      lastChanged: firebase.firestore.FieldValue.TIMESTAMP
    }
    if (isOnline) { 
      // tell firebase in advance (when you are online), in case you are off, set this data for the ref
      await statusRef.onDisconnect().set(offline);

      await statusRef.set(online)
      // await userDoc.update({
      //   status: onlineForFirestore
      // })
    } else {
      // await userDoc.update({
      //   status: offlineForFirestore
      // })
    }
  })
}


export { db, rtdb, firebase, setupPresence }