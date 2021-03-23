var redis = require("redis");
var publisher = redis.createClient(6379, process.env.REDIS_HOST || '127.0.0.1');
var subscriber = redis.createClient(6379, process.env.REDIS_HOST || '127.0.0.1');
publisher.auth('sOmE_sEcUrE_pAsS');
subscriber.auth('sOmE_sEcUrE_pAsS');

module.exports = {publisher, subscriber};
