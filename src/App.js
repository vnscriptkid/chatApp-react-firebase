import React from "react";
import LeftNav from "./components/LeftNav";
import Channel from "./components/Channel";
import { Router } from "@reach/router";
import { Login } from "./Login";
import { subscribeUserStateChange } from "./helper";

function App() {
  const user = subscribeUserStateChange();

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

export default App;
