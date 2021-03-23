const redis = require("redis");
const publisher = redis.createClient(6379, process.env.REDIS_HOST || '127.0.0.1');
const subscriber = redis.createClient(6379, process.env.REDIS_HOST || '127.0.0.1');
publisher.auth('sOmE_sEcUrE_pAsS');
subscriber.auth('sOmE_sEcUrE_pAsS');

module.exports = {publisher, subscriber};
