import { subscribeCollection } from "../helper";
import React from "react";
import { Link } from "@reach/router";
import { signOut, getAuth } from "firebase/auth";

function LeftNav({ user }) {
  const channels = subscribeCollection("channels");

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(getAuth());
    } catch (err) {
      console.error(err);
    }
  };

  const { name, img } = user;

  return (
    <div className="leftNav">
      <div className="userBox">
        <img src={img} alt="avatar" className="userBox__avatar" />
        <p className="userBox__name">{name}</p>
        <a
          href="http://www.google.com"
          onClick={handleSignOut}
          className="userBox__action"
        >
          log out
        </a>
      </div>
      <ul className="channelList">
        {channels.map((channel) => (
          <Link
            key={channel.id}
            className="channelItem"
            to={`/channel/${channel.id}`}
          >
            #{channel.id}
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default LeftNav;
