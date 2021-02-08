function convertW84(value){
    let values = value.split('.');
    let degree = parseInt(Number(values[0]) / 60)
    let sec = parseInt(Number(values[0]) % 60)
    return `${degree} ${sec}.${values[1]}`
}

module.exports = {
    'Q0': {
        description: 'Check-in command, the lock will be sent first after each connection to the server, (including reconnection after disconnection',
        parse: function({DDDD = '412,80,28'}){
            let values = DDDD.split(',')
            return {
                voltage: values[0],
                power: values[1],
                signal: values[2]
            }
        }
    },
    'H0': {
        description: 'Heartbeat command, the lock is sent every 4 minutes to maintain the connection',
        parse: function({DDDD = '0,412,28,80,0'}){
            let values = DDDD.split(',')
            const statuses = {'0': 'READY', '1': 'LOCKED'};
            const charging = {'0': 'UNCHARGED', '1': 'CHARGING'};
            return {
                status: statuses[values[0]],
                voltage: values[1],
                signal: values[2],
                power: values[3],
                charging_status: charging[values[4]]
            }
        }
    },
    'R0': {
        description: 'Unlocking/Lock operation',
        parse: function({DDDD = '0,55,1234,1497689816'}){
            // console.log(DDDD)
            let values = DDDD.split(',')
            const operations = {'0': 'UNLOCK', '1': 'LOCK'};
            return {
                operation: operations[values[0]],
                KEY: values[1],
                userID: values[2],
                timestamp: values[3]
            }
        }
    },
    'L0': {
        description: 'Unlock the command, send the R0 command before sending this command',
        parse: function({DDDD = '0,1234,1497689816'}){
            let values = DDDD.split(',')
            const statuses = {'0': 'SUCCESS', '1': 'FAIL', '2': 'ERROR_KEY'};
            return {
                status: statuses[values[0]],
                userID: values[1],
                timestamp: values[2]
            }
        }
    },
    'L1': {
        description: 'Lock the scooter command, send the R0 command before sending this command',
        parse: function({DDDD = '0,1234,1497689816,3'}){
            let values = DDDD.split(',')
            const statuses = {'0': 'SUCCESS', '1': 'FAIL', '2': 'ERROR_KEY'};
            return {
                status: statuses[values[0]],
                userID: values[1],
                timestamp: values[2],
                cycling: values[3]
            }
        }
    },
    'S5': {
        description: 'IOT device setting instructions',
        parse: function({DDDD = '3,1,240,10'}){
            let values = DDDD.split(',')
            const statuses = {'0': 'INVALID', '1': 'LOW', '2': 'MIDIUM', '3': 'HIGH'};
            const unlocked = {'0': 'INVALID', '1': 'SHUTDOWN', '2': 'OPEN'};
            return {
                sensitivity: statuses[values[0]],
                unlock_status: unlocked[values[1]],
                heartbeat_interval: values[2],
                upload_interval: values[3]
            }
        }
    },
    'S6': {
        description: 'Get scooter information',
        parse: function({DDDD = '80,3,221,0,372,372,0,28'}){
            let values = DDDD.split(',')
            //console.log(values);
            const speeds = {'1': 'LOW', '2': 'MEDIUM', '3': 'HIGH'};
            const charging = {'0': 'UNCHARGED', '1': 'CHARGING'};
            const statuses = {'0': 'UNLOCKED', '1': 'LOCKED'};
            return {
                power: values[0],
                speed_mode: speeds[values[1]],
                speed: values[2],
                charging_status: charging[values[3]],
                charge: {
                    battery_1: values[4],
                    battery_2: values[5]
                },
                status: statuses[values[6]],
                signal: values[7],
                ride_mileage: values[8]
            }
        }
    },
    'S7': {
        description: 'Scooter setting instruction 1',
        parse: function({DDDD = '0,3,0,0'}){
            let values = DDDD.split(',')
            const statuses = {'0': 'INVALID', '1': 'SHUTDOWN', '2': 'OPEN'};
            const speeds = {'0': 'INVALID','1': 'LOW', '2': 'MEDIUM', '3': 'HIGH'};
            return {
                headlight: statuses[values[0]],
                speed_mode: speeds[values[1]],
                throttle: statuses[values[2]],
                taillight: statuses[values[3]]
            }
        }
    },
    'S4': {
        description: 'Scooter setting instruction 2',
        parse: function({DDDD = '0,0,0,0,0,15,20,25'}){
            let values = DDDD.split(',')
            const statuses = {'0': 'INVALID', '1': 'SHUTDOWN', '2': 'OPEN'};
            const starts = {'0': 'INVALID','1': 'NON_ZERO_START', '2': 'ZERO_START'};
            return {
                speed_display: statuses[values[0]],
                cruise_control: statuses[values[1]],
                startup_mode: starts[values[2]],
                switching_speed_mode: statuses[values[3]],
                switching_headlight: statuses[values[4]],
                low_speed_mode: values[5],
                medium_speed_mode: values[6],
                high_speed_mode: values[7]
            }
        }
    },
    'W0': {
        description: 'Alarm command',
        parse: function({DDDD = '1'}){
            let values = DDDD.split(',')
            const statuses = {
                '1': 'ILLEGAL_MOVEMENT',
                '2': 'FALLING',
                '3': 'ILLEGAL_MOVEMENT',
                '4': 'LOW_POWER',
                '6': 'LIFTED',
                '7': 'ILLEGAL_DEMOLITION'
            };
            return {
                reason: statuses[values[0]]
            }
        }
    },
    'V0': {
        description: 'Beep playback command',
        parse: function({DDDD = '1'}){
            let values = DDDD.split(',')
            const statuses = {
                '1': 'HOLD',
                '2': 'LOCATE',
                '80': 'PUT_OFF',
                '81': 'PUT_ON'
            };
            return {
                reason: statuses[values[0]]
            }
        }
    },
    'D0': {
        description: 'Get positioning instructions, single time',
        parse: function({DDDD = '0,124458.00,A,2237.7514,N,11408.6214,E,6,0.21,151216,10,M,A'}){
            let values = DDDD.split(',')
            const status = {
                '0': 'POSITIONING',
                '1': 'TRACKING'
            };
            const positioning = {
                '0': 'EFFECTIVE',
                '1': 'INVALID'
            };
            const indications = {
                'A': 'AUTONOMUS',
                'D': 'DIFFERENTIAL',
                'E': 'ESTIMATE',
                'N': 'INVALID_DATA'
            };
            return {
                status: status[values[0]],
                time: `${values[1]}_hhmmss`,
                positioning_status: positioning[values[2]],
                location: {
                    lat: `${values[4]}${values[3]}`,
                    lng:`${values[6]}${values[5]}`,
                    alt: values[10],
                    value: `${convertW84(values[3])}${values[4]} ${convertW84(values[5])}${values[6]} ${values[10]}`,
                    format: 'WGS84'
                },
                satellites: values[7],
                HDOP: values[8],
                date: `${values[9]}_ddmmyy`,
                height: values[11],
                indication_mode: indications[values[12]]
            }
        }
    },
    'D1': {
        description: 'Positioning tracking instruction',
        parse: function({DDDD = '60'}){
            let values = DDDD.split(',');
            return {
                interval: values[0]
            }
        }
    },
    'G0': {
        description: 'Get the firmware version',
        parse: function({DDDD = '110,Jul 4 2018,1101,0'}){
            let values = DDDD.split(',');
            return {
                software_version: values[0],
                software_date: values[1],
                firmware: values[2],
                reseved: values[3]
            }
        }
    },
    'E0': {
        description: 'Upload controller fault code',
        parse: function({DDDD = '1'}){
            let values = DDDD.split(',');
            return {
                code: values[0]
            }
        }
    },
    'U0': {
        description: 'Detect upgrade/boot upgrade',
        parse: function({DDDD = '110,8A,1101'}){
            let values = DDDD.split(',');
            return {
                identification_code: values[0],
                firmware_version: values[1],
                hardware_version: values[2]
            }
        }
    },
    'U1': {
        description: 'Get upgrade data',
        parse: function({DDDD = '100,8A'}){
            let values = DDDD.split(',');
            return {
                packages: values[0],
                identification_code: values[1]
            }
        }
    },
    'U2': {
        description: 'Notification of upgrade successfully',
        parse: function({DDDD = '100,8A'}){
            let values = DDDD.split(',');
            const result = {'0': 'SUCCESS', '1': 'FAIL'}
            return {
                deviceID: values[0],
                result: result[values[1]]
            }
        }
    },
    'K0': {
        description: 'Setting/Getting BLE 8-byte communication KEY',
        parse: function({DDDD = 'OmniW4GX'}){
            let values = DDDD.split(',');
            return {
                KEY: values[0]
            }
        }
    },
    'S1': {
        description: 'Event notification command',
        parse: function({DDDD = '1'}){
            let values = DDDD.split(',');
            let codes = {
                '1': 'IOT_OFF',
                '2': 'IOT_RESTARTED',
                '10': 'RESERVED',
                '11': 'RESERVATION_CANCLED',
                '12': 'MARKED_FAULTY',
                '13': 'MARKED_FAULTY_CANCELLED',
                '16': 'MARKED_LOST',
                '17': 'MARKED_LOST_CANCELLED'
            };
            return {
                code: codes[values[0]]
            }
        }
    },
    'L5': {
        description: 'Unlock external devices',
        parse: function({DDDD = '1,0'}){
            let values = DDDD.split(',');
            let operations = {
                '1': 'BATTERY_UNLOCK',
                '2': 'WHEEL_UNLOCK',
                '3': 'CABLE_UNLOCK',
                '17': 'BATTERY_LOCK',
                '18': 'WHEEL_LOCK',
                '19': 'CABLE_LOCK',
                '33': 'BATTERY_LOCK_STATUS',
                '34': 'WHEEL_LOCK_STATUS',
                '35': 'CABLE_LOCK_STATUS'
            };
            let statuses = {
                '0': 'SUCCESS',
                '1': 'FAILURE',
                '2': 'TIMEOUT',
                '16': 'LOCK_STATE',
                '17': 'UNLOCK_STATE'
            };
            return {
                operation: operations[values[0]],
                status: statuses[values[1]]
            }
        }
    },
    'Z0': {
        description: 'Get controller custom data',
        parse: function({DDDD = '1,5,A0B1C2D3E4F5'}){
            let values = DDDD.split(',');
            return {
                type: values[0],
                length: values[1],
                data: values[2]
            }
        }
    },
    'I0': {
        description: 'Get the SIM card ICCID number',
        parse: function({DDDD = '123456789AB123456789'}){
            let values = DDDD.split(',');
            return {
                ICCID: values[0]
            }
        }
    },
    'M0': {
        description: 'Get IOT Bluetooth MAC Address',
        parse: function({DDDD = '123456789AB123456789'}){
            let values = DDDD.split(',');
            return {
                MAC: values[0]
            }
        }
    }
}
