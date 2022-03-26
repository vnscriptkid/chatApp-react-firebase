import React from "react";
import LeftNav from "./components/LeftNav";
import Channel from "./components/Channel";
import { Redirect, Router } from "@reach/router";
import { Login } from "./Login";
import { subscribeUserStateChange } from "./helper";

function App() {
  const user = subscribeUserStateChange();

  return user ? (
    <div className="App">
      <LeftNav user={user} />
      <Router style={{ display: "flex", flex: 1 }}>
        <Channel user={user} path="/channel/:channelId" />
        <Redirect from="/" to="/channel/general" noThrow />
      </Router>
    </div>
  ) : (
    <Login />
  );
}

export default App;
