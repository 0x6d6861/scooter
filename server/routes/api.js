var express = require('express');
const {publisher} = require("../pubsub");
const {DeviceIDByQR} = require("../database/repositories/ScooterRepo");
var router = express.Router();

/* GET home page. */
router.post('/command', async function(req, res, next) {
    const {qr, command} = req.body;
    let commands = ['LOCK', 'UNLOCK'];

    if(commands.includes(command)){

        let device = await DeviceIDByQR({qr});
        publisher.publish('action/scooter/alarm', JSON.stringify({
            user: '1',
            DEVICE_ID: device,
            state: '0'
        }));

        // TODO: get userID from the jwt
        publisher.publish('action/scooter/lock', JSON.stringify({
            user: '1',
            DEVICE_ID: device,
            state: 'LOCK'
        }));
        res.json({
            success: true,
            message: 'Command executed'
        })
    } else {
        res.json({
            success: false,
            message: 'Unknown command provided'
        })
    }
});

module.exports = router;
