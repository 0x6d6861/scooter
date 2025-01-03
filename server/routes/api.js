var express = require('express');
const {GetAllDevices} = require("../database/repositories/ScooterRepo");
const {publisher} = require("../pubsub");
const {DeviceIDByQR} = require("../database/repositories/ScooterRepo");
var router = express.Router();


router.get('/devices', async function (req, res, next) {
    let devices = await GetAllDevices()
    res.json({
        success: true,
        devices
    })
})

/* GET home page. */
router.post('/command', async function(req, res, next) {
    const {qr, command, user} = req.body;
    let commands = ['LOCK', 'UNLOCK'];

    if(commands.includes(command)){

        let device = await DeviceIDByQR({qr});
        /*publisher.publish('action/scooter/alarm', JSON.stringify({
            user: '1',
            DEVICE_ID: device,
            state: '0'
        }));*/

        // TODO: get userID from the jwt
        publisher.publish('action/scooter/lock', JSON.stringify({
            user: user,
            DEVICE_ID: device,
            state: command
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
