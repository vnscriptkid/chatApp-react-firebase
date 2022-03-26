import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";

const auth = getAuth();

export function Login() {
  const [errMsg, setErr] = useState(null);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
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
