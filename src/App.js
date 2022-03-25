import React, { useState, useEffect } from "react";
import LeftNav from "./components/LeftNav";
import Channel from "./components/Channel";
import { db, setupPresence } from "./firebase";
import { Router } from "@reach/router";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { collection, doc, setDoc } from "@firebase/firestore";

const auth = getAuth();

function App() {
  const user = subscribeUserStateChange();

  // TODO: Router component adds a div outside Channel, which has broken the original layout, somehow remove that added by default div
  return user ? (
    <div className="App">
      <LeftNav user={user} />
      <Router style={{ display: "flex", flex: 1 }}>
        <Channel user={user} path="/channel/:channelId" />
      </Router>
    </div>
  ) : (
    <Login />
  );
}

function Login() {
  const [errMsg, setErr] = useState(null);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="login text-center">
      <h1 className="login__title">Login to Chat with People :D</h1>
      <button className="login__btn" onClick={handleSignIn}>
        Sign in With Google
      </button>
      {errMsg ? <p className="login__warning">{"Ooops! " + errMsg}</p> : null}
    </div>
  );
}

function subscribeUserStateChange() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async function (user) {
      if (user) {
        // User is signed in.
        const signedInUser = {
          name: user.displayName,
          id: user.uid,
          img: user.photoURL,
        };
        setUser(signedInUser);
        // add logged user to db
        const usersRef = collection(db, "users");

        try {
          await setDoc(
            doc(usersRef, user.uid),
            {
              name: user.displayName,
              img: user.photoURL,
            },
            { merge: true }
          );

          console.log("setupPresence for user: ", signedInUser);
          setupPresence(signedInUser);
        } catch (err) {
          console.error(err);
        }

        // collection(db, "users")
        //   .doc(user.uid)
        //   .set(
        //     {
        //       name: user.displayName,
        //       img: user.photoURL,
        //     },
        //     { merge: true }
        //   )
        //   // .then(() => console.log('Update logged user to db'))
        //   .then(
        //     () =>
        //       console.log("setupPresence for user: ", signedInUser) ||
        //       setupPresence(signedInUser)
        //   )
        //   .catch((err) => console.error(err));
      } else {
        // No user is signed in.
        setUser(null);
      }
    });
  }, []);
  return user;
}

export default App;
