const admin = require("firebase-admin");

admin.initializeApp();

exports.helloWorld = require("./routes/hello");

exports.onUserStatusChanged = require("./triggers/onUserStatusChanged");
