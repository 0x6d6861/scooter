var {publisher, subscriber} = require('../tcpServer/pubsub/redis');

subscriber.subscribe("server/status");
subscriber.subscribe("scooter/status");

//
subscriber.subscribe("response/scooter/heartbeat");
subscriber.subscribe("response/scooter/position");

let devices = {};

// TODO: know when the command was successful
/*publisher.publish('action/scooter/lock', JSON.stringify({
    user: '1',
    DEVICE_ID: '861123050543063',
    state: 'LOCK'
}));*/

/*publisher.publish('action/scooter/trackinginterval', JSON.stringify({
    user: '1',
    DEVICE_ID: '861123050543063',
    seconds: '10'
}));*/

/*publisher.publish('action/scooter/alarm', JSON.stringify({
    user: '1',
    DEVICE_ID: '861123050543063',
    state: '0'
}));*/

// *SCOS,OM,861123050543063,W0,0#
/*publisher.publish('action/scooter/light', JSON.stringify({
    user: '1',
    DEVICE_ID: '861123050543063',
    taillight: '0',
    headlight: '0'
}));*/

publisher.publish('action/scooter/beep', JSON.stringify({
    user: '1',
    DEVICE_ID: '861123050543063',
    action: 'FIND'
}));

/*publisher.publish('action/scooter/position', JSON.stringify({
    DEVICE_ID: '861123050543063'
}));*/


// process.exit(0);

/*subscriber.on("message", function (channel, message) {
    let state = JSON.parse(message);
    if(channel === 'response/scooter/heartbeat'){
        if(state.data.status === 'LOCKED'){
            publisher.publish('action/scooter/lock', JSON.stringify({
                user: '1',
                DEVICE_ID: state.DEVICE_ID,
                state: 'UNLOCK'
            }));
        }
    }
    devices[state.DEVICE_ID] = {...devices[state.DEVICE_ID],...state.data}
    console.log("DEVICES =>", devices);
});*/
