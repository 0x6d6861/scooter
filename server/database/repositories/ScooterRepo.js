const {Scooter} = require('../models/index')
function DeviceIDByQR({qr}) {
    return Scooter.findOne({
        where: {qr}
    }).then(function (app) {
        return app.imei
    })
}

function GetAllDevices() {
    return Scooter.findAll()
}

function AddDeviceByIMEI({imei}) {
    return Scooter.findOne({
        where: {imei}
    }).then(obj => {
        if(!obj) {
            return Scooter.create({imei})
        }
        return obj;
    })
}

module.exports = {DeviceIDByQR, AddDeviceByIMEI,GetAllDevices}
