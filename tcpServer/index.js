const chalk = require('chalk');
const log = console.log;
const net = require('net');
const moment = require('moment');
const port = 7070;
const host = '127.0.0.1';
const {describeCommand} = require('./utils/utils')
const server = net.createServer();
const {Scooter} = require('./Classes/Scooter');
const {ScooterList} = require('./Classes/ScooterList');
const {publisher, subscriber} = require('../pubsub/redis');
const responseTopics = require('../pubsub/response_topics');

let scooterList = new ScooterList();
let scooter = null;

///////////////
const actionTopics = require('../server/actionTopics')(scooterList);
const actionTopicList = Object.keys(actionTopics);
actionTopicList.forEach(topic => {
    subscriber.subscribe(topic);
})
subscriber.on("message", function (channel, message) {

    // registering all the actions
    if(actionTopicList.includes(channel)){
        const device = JSON.parse(message)
        actionTopics[channel].method(device.DEVICE_ID, device)
    }
});
//////////////

server.listen(port, host, () => {
    // TODO: publish tcp server online with host and port
    publisher.publish("server/status", JSON.stringify({
        status: 'online',
        host,
        port
    }));


    console.log('TCP Server is running on port ' + port + '.');
});

server.on('connection', function(sock) {
    log(chalk.black.bgGreen.bold(' CONNECTED ') + ' ' + sock.remoteAddress + ' ' + sock.remotePort);
    sock.on('data', function(data) {
        try {
            console.log('DATA ' + sock.remoteAddress + ': ' + data.toString('utf-8').slice(0, -1));
            let parsed = describeCommand({command: data.toString('utf-8')});
            console.log("Response => ", JSON.stringify(parsed.parsed));

            if(parsed.command.XX){

                // TODO: confirm the response when serve online then offline then online, this might be unnecessary

                if(parsed.command.XX === 'Q0' || parsed.command.XX === 'L0' || parsed.command.XX === 'L1') {
                    if(!scooterList.has(parsed.command.DEVICE_ID)){
                        scooter = new Scooter(parsed.command.DEVICE_ID, sock)
                        // This has been set in the Scooter Constructor
                        //sock.DEVICE_ID = parsed.command.DEVICE_ID;
                        scooterList.add(scooter);
                    } else {
                        scooter = scooterList.get(parsed.command.DEVICE_ID);
                        // TODO: this might be unnecessary because of the onclose event
                        scooter.updateSocket(sock);
                    }

                    if((parsed.command.XX === 'L0' || parsed.command.XX === 'L1')) {
                        // console.log('STATE => ', parsed.command.XX)
                        scooter.initialize({state: parsed.command.XX}).then(resp => {
                            log(chalk.black.bgGreen.bold(` ${scooter.DEVICE_ID} `) + ' ' + chalk.green(' READY!! '));
                        })
                    } else {
                        if(parsed.command.XX !== 'Q0') {
                            console.log("Hello")
                            log(chalk.black.bgGreen.bold(` ${scooter.DEVICE_ID} `) + ' ' + chalk.green(' READY!! '));
                        }
                    }

                } else {
                    // console.log("TOPIC => ", responseTopics[parsed.command.XX])
                    publisher.publish(`response/scooter/${responseTopics[parsed.command.XX].topic}`, JSON.stringify({
                        DEVICE_ID: scooter.DEVICE_ID,
                        data: parsed.parsed
                    }));
                }

                // TODO: publish all the other events

            } else {
                sock.destroy();
            }
        } catch (e) {
            sock.destroy();
            console.log(e)
        }
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        log(chalk.black.bgRed.bold(' CLOSED ') + ' ' + sock.remoteAddress + ' ' + sock.remotePort);
        if(sock.DEVICE_ID && scooterList.has(sock.DEVICE_ID)){
            // TODO: publish a scooter offline
            publisher.publish("scooter/status", JSON.stringify({
                status: 'offline',
                DEVICE_ID: sock.DEVICE_ID,
                ip: sock.remoteAddress,
                port: sock.remotePort
            }));
            scooterList.remove(sock.DEVICE_ID); // Deleted the scooter
        }
    });
});

// TODO: detect when Server is closed
server.on('destroy', function (reason) {
    console.log(reason);
    scooterList.clear();
})
