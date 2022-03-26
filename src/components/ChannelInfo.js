import React from "react";
import { subscribeDoc } from "../helper";

const ChannelInfo = ({ channelId }) => {
  const channel = subscribeDoc(`channels`, channelId);

  return (
    <div className="channelInfo">
      <div className="channelInfo__topic">
        Topic: {channel && channel.topic}
      </div>
      <div className="channelInfo__tag">#{channelId}</div>
    </div>
  );
};

export default ChannelInfo;
