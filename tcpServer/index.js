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
const pubsub = require('../pubsub/redis');

server.listen(port, host, () => {
    // TODO: publish tcp server online with host and port
    pubsub.publish("server/status", JSON.stringify({
        status: 'online',
        host,
        port
    }));
    console.log('TCP Server is running on port ' + port + '.');
});

let scooterList = new ScooterList();
let scooter = null;

server.on('connection', function(sock) {
    log(chalk.black.bgGreen.bold(' CONNECTED ') + ' ' + sock.remoteAddress + ' ' + sock.remotePort);
    // console.log(sock);
    //sockets.push(sock);
    sock.on('data', function(data) {
        try {
            //console.log('DATA ' + sock.remoteAddress + ': ' + data);
            let parsed = describeCommand({command: data.toString('utf-8')});

            if(parsed.command.XX){

                // TODO: confirm the response when serve online then offline then online, this might be unnecessary
                // if(parsed.command.XX === 'Q0' || parsed.command.XX === 'L0' || parsed.command.XX === 'L1')

                if(parsed.command.XX === 'Q0') {
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
                    // scooter.initialize();
                    // TODO: publish a scooter event 'connected', with ip and all the goodies
                    pubsub.publish("scooter/status", JSON.stringify({
                        status: 'online',
                        DEVICE_ID: sock.DEVICE_ID,
                        ip: sock.remoteAddress,
                        port: sock.remotePort
                    }));

                    // log(chalk.black.bgYellow.bold(` ${scooter.DEVICE_ID} `) + ' ' + chalk.green('READY'));

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
            pubsub.publish("scooter/status", JSON.stringify({
                status: 'offline',
                DEVICE_ID: sock.DEVICE_ID,
                ip: sock.remoteAddress,
                port: sock.remotePort
            }));
            scooterList.delete(sock.DEVICE_ID); // Deleted the scooter
        }
    });
});

// TODO: detect when Server is closed
server.on('destroy', function (reason) {
    console.log(reason);
    scooterList.clear();
})
