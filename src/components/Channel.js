import React, { Fragment, useEffect } from "react";
import Members from "./Members";
import ChannelInfo from "./ChannelInfo";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Channel({ user, channelId }) {
  useEffect(() => {
    console.log(`update channel ${channelId} for user`);
    // db.collection("users")
    //   .doc(user.id)
    //   .update({
    //     [`channels.${channelId}`]: true,
    //   })
    //   .then((result) => {})
    //   .catch((err) => console.error(err));
    return () => {
      console.log("clean up");
    };
  }, [channelId, user.id]);

  return (
    <Fragment>
      <div className="mainBody">
        <ChannelInfo />

        <MessageList channelId={channelId} />

        <MessageInput channelId={channelId} user={user} />
      </div>
      <Members channelId={channelId} />
    </Fragment>
  );
}

export default Channel;
