const admin = require("firebase-admin");

admin.initializeApp();

// routes
exports.helloWorld = require("./routes/hello");

// triggers
exports.onUserStatusChanged = require("./triggers/onUserStatusChanged");
exports.onCleverbotMessage = require("./triggers/onCleverbotMessage");
