import React from "react";
import { subscribeCollection } from "../helper";

const Members = ({ channelId }) => {
  const query = [`channels.${channelId}`, "==", true];

  const members = subscribeCollection("users", "name", query);

  return (
    <div className="rightNav">
      <div className="userList">
        {members.map((member) => (
          <div key={member.id} className="userItem">
            <span
              className={
                member.status && member.status.status
                  ? "userItem__status userItem__status--online"
                  : "userItem__status"
              }
            ></span>
            <span className="userItem__name">{member.name}</span>
          </div>
        ))}
        {/* <div className="userItem">
                <span className="userItem__status userItem__status--online"></span>
                <span className="userItem__name">cleverbot</span>
            </div> */}
      </div>
    </div>
  );
};

export default Members;
