const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

const bot = {
  name: "cleverbot",
  photoUrl: "https://i.imgur.com/ydOMC2c.png",
  uid: "cleverbot",
  status: {
    lastChanged: new Date(),
    state: "online",
  },
  channels: {
    general: true,
  },
};

db.collection("users").doc(bot.uid).set(bot, { merge: true });

module.exports = functions.firestore
  .document("channels/general/messages/{messageId}")
  .onCreate((doc, context) => {
    const message = doc.data();

    if (!message.text.startsWith("@cleverbot")) return;

    const msgFromBot = {
      text: "hi, can i help u?",
      userRef: db.collection("users").doc("cleverbot"),
      createdAt: new Date(),
    };

    console.log("@@ bot sending msg ", msgFromBot);

    return db.collection("channels/general/messages").add(msgFromBot);
  });
