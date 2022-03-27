import React, { Fragment, useEffect } from "react";
import Members from "./Members";
import ChannelInfo from "./ChannelInfo";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";

function Channel({ user, channelId }) {
  useEffect(() => {
    updateDoc(doc(db, `users/${user.id}`), {
      [`channels.${channelId}`]: true,
    }).catch((err) => console.error(err));
  }, [channelId, user.id]);

  return (
    <Fragment>
      <div className="mainBody">
        <ChannelInfo channelId={channelId} />

        <MessageList channelId={channelId} />

        <MessageInput channelId={channelId} user={user} />
      </div>
      <Members channelId={channelId} />
    </Fragment>
  );
}

export default Channel;
