var redis = require("redis");
var publisher = redis.createClient(6379,"redis");
var subscriber = redis.createClient(6379,"redis");
publisher.auth('sOmE_sEcUrE_pAsS');
subscriber.auth('sOmE_sEcUrE_pAsS');

module.exports = {publisher, subscriber};
