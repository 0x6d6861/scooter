var redis = require("redis");
var pubsub = redis.createClient();
pubsub.auth('sOmE_sEcUrE_pAsS');

module.exports = pubsub;
