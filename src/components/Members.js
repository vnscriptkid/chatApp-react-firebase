import React from "react";
import { subscribeCollection } from "../helper";

const Members = ({ channelId }) => {
  const query = [`channels.${channelId}`, "==", true];

  const members = subscribeCollection("users", undefined, query);

  return (
    <div className="rightNav">
      <div className="userList">
        {members.sort(sortByName).map((member) => (
          <div key={member.id} className="userItem">
            <span
              className={
                member.status && member.status.state === "online"
                  ? "userItem__status userItem__status--online"
                  : "userItem__status"
              }
            ></span>
            <span className="userItem__name">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function sortByName(a, b) {
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
}

export default Members;
