var subscriber = require('./redis');

subscriber.subscribe("server/status");
subscriber.subscribe("scooter/status");

subscriber.on("message", function (channel, message) {
    console.log("Message: " + message + " on channel: " + channel + " is arrive!");
});
