import { addDoc, collection, doc } from "@firebase/firestore";
import React from "react";
import { db } from "../firebase";

const MessageInput = ({ user, channelId }) => {
  async function handleSubmit(e) {
    e.preventDefault();

    const inputEle = e.target.elements[0];

    try {
      const messagesRef = collection(db, "channels", channelId, "messages");
      await addDoc(messagesRef, {
        text: inputEle.value,
        createdAt: Date.now(),
        userRef: doc(db, "users", user.id),
      });
      inputEle.value = "";
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="messageInputBox" onSubmit={handleSubmit}>
      <input
        type="text"
        className="messageInput"
        placeholder={`message #${channelId}`}
      />
    </form>
  );
};

export default MessageInput;
