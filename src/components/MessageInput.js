import React from 'react';
import {db} from '../firebase';

const MessageInput = ({ user, channelId }) => {

    function handleSubmit(e) {
        e.preventDefault();
        const inputEle = e.target.elements[0];
        const nextValue = inputEle.value;

        // TODO: make channel dymamic

        db
            .collection('channels')
            .doc(channelId)
            .collection('messages')
            .add({
                text: nextValue,
                createdAt: Date.now(),
                userRef: db.collection('users').doc(user.id)
            })
            .then(docRef => {})
            .catch(err => console.error(err));

        // inputEle.value = "";
        e.target.reset();
    }

    return (
        <form className="messageInputBox" onSubmit={handleSubmit}>
            <input type="text" className="messageInput" placeholder={`message #${channelId}`} />
        </form>
    );
}

export default MessageInput;