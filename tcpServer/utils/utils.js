const deviceResponseList = require('./responseParser');

function describeCommand({command}) {
    const values = command.split(',');
    const DDDD = values.slice(4, values.length).join(',').replace('#', '').replace('\n', '');
    let agents = {'*SCOS': 'Server', '*SCOR': 'Scooter'}

    if(!agents[values[0]]){
        throw new Error('Invalid Format')
    }

    let params = {
        agent: agents[values[0]],
        header: values[0],
        vendor: values[1],
        DEVICE_ID: values[2],
        XX: values[3],
        DDDD: DDDD
    }
    let parsedValues = deviceResponseList[params.XX];
    let parsed = parsedValues.parse({DDDD: params.DDDD})
    return {
        description:parsedValues.description,
        command: params,
        parsed,
        string: command,
        time: Date.now()
    }
}

function sendCommand({DEVICE_ID = '123456789123456', XX = 'R0', DDDD = '0,20,1234,1497689816'}, socket) {

    return new Promise((resolve, reject) => {
        const vendor = 'OM';
        let finalCommand = `*SCOS,${vendor},${DEVICE_ID},${XX},${DDDD}#\n`;
        if(!DDDD) {
            finalCommand = `*SCOS,${vendor},${DEVICE_ID},${XX}#\n`;
        }
        console.log("SERVER_COMAND => ", finalCommand);
        let command = Buffer.concat([Buffer.from('FFFF', 'hex'), Buffer.from(finalCommand, 'utf8')]);
        socket.write(command, () => {
            socket.on('data', function(data) {
                let parsed = describeCommand({command: data.toString('utf8')});
                console.log(`===> ${socket.DEVICE_ID} - ${finalCommand}`)
                return resolve(parsed)
            })
        })
    })
}

// let a = describeCommand({command: '*SCOR,OM,123456789123456,L0,0,1234,1497689816#\n'});
//
// console.log(a);

module.exports = {describeCommand,sendCommand}
