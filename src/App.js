import React, { useState, useEffect } from 'react';
import LeftNav from './components/LeftNav';
import Channel from './components/Channel';
import { firebase, db, setupPresence } from './firebase';
import {Router} from '@reach/router';

function App() {
  
  const user = subscribeUserStateChange();  

  // TODO: Router component adds a div outside Channel, which has broken the original layout, somehow remove that added by default div
  return user ? (
    <div className="App">
      <LeftNav user={user} />
      <Router style={{ display: 'flex', flex: 1 }}>
        <Channel user={user} path="/channel/:channelId"/>
      </Router>
    </div>
  )
    :
    (
      <Login />
    );
}

function Login() {

  const [errMsg, setErr] = useState(null);

  const handleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setErr(error.message)
    }
  }

  return (
    <div className="login text-center">
      <h1 className="login__title">Login to Chat with People :D</h1>
      <button className="login__btn" onClick={handleSignIn}>Sign in With Google</button>
      {errMsg ? <p className="login__warning">{'Ooops! ' + errMsg}</p> : null}      
    </div>
  )
}

function subscribeUserStateChange() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        const signedInUser = {
          name: user.displayName,
          id: user.uid,
          img: user.photoURL
        }
        setUser(signedInUser);
        // add logged user to db
        db
          .collection('users')
          .doc(user.uid)
          .set({
            name: user.displayName,
            img: user.photoURL
          }, { merge: true })
          // .then(() => console.log('Update logged user to db'))
          .then(() => console.log('setupPresence for user: ', signedInUser) || setupPresence(signedInUser))
          .catch(err => console.error(err));
      } else {
        // No user is signed in.
        setUser(null);
      }
    });
  }, []);
  return user;
}


export default App;
