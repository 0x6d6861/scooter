var redis = require("redis");
var publisher = redis.createClient();
var subscriber = redis.createClient();
publisher.auth('sOmE_sEcUrE_pAsS');
subscriber.auth('sOmE_sEcUrE_pAsS');

module.exports = {publisher, subscriber};
