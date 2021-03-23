const {Scooter} = require('../models/index')
function DeviceIDByQR({qr}) {
    return Scooter.findOne({
        where: {qr}
    }).then(function (app) {
        return app.imei
    })
}

module.exports = {DeviceIDByQR}
