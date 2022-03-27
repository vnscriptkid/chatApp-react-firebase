import { subscribeCollection, useDocWithCache } from "../helper";
import React, { Fragment, useRef, useEffect } from "react";
import { format } from "date-fns";

const ChatScroller = (props) => {
  let msgListRef = useRef();
  let shouldScroll = useRef(true);

  const handleScroll = (e) => {
    const node = msgListRef.current;
    const { scrollHeight, clientHeight, scrollTop } = node;
    const atBottom = clientHeight + scrollTop >= scrollHeight;

    shouldScroll.current = atBottom;
  };

  useEffect(() => {
    if (shouldScroll.current) {
      const node = msgListRef.current;
      node.scrollTop = node.scrollHeight;
    }
  });
  return (
    <div {...props} onScroll={handleScroll} ref={msgListRef}>
      {props.children}
    </div>
  );
};

const MessageList = ({ channelId }) => {
  const msgList = subscribeCollection(
    `channels/${channelId}/messages`,
    "createdAt"
  );

  return (
    <ChatScroller className="messageList">
      <div className="channelSubInfo text-center">That's every message!</div>

      {msgList.map((msg, index, list) => {
        // case 1: no prev msg: DateLine + MsgWithInfo
        // case 2: different user from the prev
        //      2.1: hasBeenAWhile: DateLine + MsgWithInfo
        //      2.1: !hasBeenAWhile: MsgWithInfo
        // case 3: hasBeenAWhile: DateLine + MsgWithInfo
        // case 4: otherwise: TextMsg
        const noPrevMsg = !list[index - 1];
        if (!noPrevMsg) {
          var differentUserFromPrev =
            msg.userRef.id !== list[index - 1].userRef.id;
          var hasBeenAWhile =
            msg.createdAt - list[index - 1].createdAt > 12 * 3600 * 1000;
        }
        const msgOnlyText = (
          <div className="messageItem__textOnly" key={msg.id}>
            {msg.text}
          </div>
        );
        if (noPrevMsg || hasBeenAWhile) {
          return (
            <Fragment key={msg.id}>
              <DateLine timestamp={msg.createdAt} />
              <MessageWithInfo key={msg.id} msg={msg} />
            </Fragment>
          );
        } else if (differentUserFromPrev) {
          return <MessageWithInfo key={msg.id} msg={msg} />;
        } else {
          return msgOnlyText;
        }
      })}
    </ChatScroller>
  );
};

const DateLine = ({ timestamp }) => (
  <div className="dayinfo">
    <div className="dayinfo__line"></div>
    <div className="dayinfo__text">{format(timestamp, "DD/MM/YYYY")}</div>
    <div className="dayinfo__line"></div>
  </div>
);

function MessageWithInfo({ msg }) {
  const user = useDocWithCache("users", msg.userRef.id);

  return (
    <div className="messageItem">
      <img
        src={user && user.img}
        alt={`msg-${msg.id}`}
        className="messageItem__userImg"
      />
      <div className="messageItem__content">
        <span className="messageItem__userName">{user && user.name}</span>
        <span className="messageItem__time">
          {format(msg.createdAt, "hh:mm A")}
        </span>
        <p className="messageItem__text">{msg.text}</p>
      </div>
    </div>
  );
}

export default MessageList;

// first time render
//<MessageWithInfo key={1} msg={userId: 1, ...}/> state={}, effectFn ->
//user = cache['1'] (undefined),
//pendingCache['1'] = promise

//<MessageWithInfo key={2} msg={userId: 2, ...}/> state={}, effectFn
//user = cache['2'] (undefined)
//pendingCache['2'] = promise

//<MessageWithInfo key={3} msg={userId: 1, ...}/> state={}, effectFn -> [already cache]
