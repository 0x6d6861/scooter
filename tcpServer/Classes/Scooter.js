const chalk = require('chalk');
const log = console.log;

const moment = require('moment');
const {describeCommand} = require("../utils/utils");
const {sendCommand} = require('../utils/utils');

function Scooter(DEVICE_ID, socket) {

    socket.DEVICE_ID = DEVICE_ID;

        // THIS IS DANGEROUS
        socket.on('data', (data) => {
            let parsed = describeCommand({command: data.toString('utf-8')});
            /*if((parsed.command.XX === 'L0' || parsed.command.XX === 'L1') && parsed.parsed.status !== 'SUCCESS') {
                this.initialize(parsed.command.XX).then(resp => {
                    log(chalk.black.bgGreen.bold(` ${DEVICE_ID} `) + ' ' + chalk.green(' READY!! '));
                })
            } else {
                if(parsed.command.XX !== 'Q0') {
                    log(chalk.black.bgGreen.bold(` ${DEVICE_ID} `) + ' ' + chalk.green(' READY!! '));
                }
            }*/

            });

    function _sendCommand({XX, DDDD}) {
        return sendCommand({
            DEVICE_ID: DEVICE_ID,
            XX: XX,
            DDDD: DDDD
        }, socket);
    }

    function closeSocket() {
        return socket.destroy()
    }

    function initialize({state = 'L1'}) {
        // console.log("INIT")
        return _sendCommand({
            XX: state, // L0 when unlocked
            DDDD: null
        });
     }

     function updateSocket(sock) {
         socket = sock;
     }

     function lockScooter({user = Math.floor(Math.random() * 10) + ''}) {
         return _toggleLock('L1', user)
     }

     function unlockScooter({user = Math.floor(Math.random() * 10) + ''}) {
         return _toggleLock('L0', user)
    }

    function _toggleLock(state = 'L0', userId = Math.floor(Math.random() * 10) + '') {
         // R0 => KEY
         // L0
         // L1

         let wait = '20';

         return new Promise(async (resolve, reject) => {
             let response = await _sendCommand({
                 XX: 'R0', // L0 when unlocked
                 DDDD: `${state === 'L1' ? '1' : '0'},${wait},${userId},${moment().unix()}`
             });
             // console.log("KEY => ",  response);
             if(response.command.XX === 'R0'){
                 let newDDDD = `${response.parsed.KEY},${userId},${moment().unix()}`;
                 if(state === 'L1'){
                     newDDDD = `${response.parsed.KEY}`
                 }
                 let responseLock = await _sendCommand({
                     XX: state, // L0 when unlocked
                     DDDD: newDDDD
                 });
                 if(
                     (responseLock.command.XX === 'L0' || responseLock.command.XX === 'L1') &&
                        responseLock.parsed.status === 'SUCCESS'
                 ){
                     _sendCommand({
                         XX: state, // L0 when unlocked
                         DDDD: null
                     }).then((data) => {
                         // TODO: find the response and decide
                         // console.log("LOCK STATUS", data)
                         resolve({DEVICE_ID: DEVICE_ID, STATUS: state === 'L0' ? 'UNLOCKED' : 'LOCKED', reason: responseLock})
                     })
                 } else {
                     reject({DEVICE_ID: DEVICE_ID, STATUS: responseLock.parsed.status, reason: responseLock})
                 }
             }
         });

     }

     // TODO: if you want to change default settings and behaviour
    function _setIOTSettings({sensitivity='0', unlock_status='0', heartbeat_interval='0', upload_interval='0'}){

        // sensitivity => 0:invalid(Don’t set) 1:low 2:Middle 3:High
        // unlock_status => 0:invalid(Don’t set) 1:shutdown 2:Open
        // heartbeat_interval => 0:invalid(Don’tset) 0:Invalid(notset) Unit:Second(default 240S)
        // upload_interval => 0: Invalid (not set) Unit: Second (default: 10S)

        // *SCOR,OM,123456789123456,S5,3,1,240,10#

         let DDDD = `${sensitivity},${unlock_status},${heartbeat_interval},${upload_interval}`

         return _sendCommand({
            XX: 'S5',
            DDDD: DDDD
        });

     }

     function resetIOTSettings(){
         return _setIOTSettings({sensitivity:'2', unlock_status:'1', heartbeat_interval:'240', upload_interval:'10'})
     }


     function getScooterInformation(){
        // *SCOS,OM,123456789123456,S6#
        return _sendCommand({
            XX: 'S6',
            DDDD: null
        });
     }

     function _setScooterInstructionOne({headlight='0', speed_mode='0', throttle='0',taillight='0'}){
        // *SCOS,OM,123456789123456,S7,0,3,0,0#

        // headlight => 0:invalid(Don’tset)1:shutdown 2:open
        // speed_mode => 0:invalid(Don’tset)1:shutdown 2:Mediumspeed 3:highspeed,
        // throttle => 0:invalid(Don’t set) 1:shut down 2:open,
        // taillight => 0:invalid(Don’tset) 1:shutdown 2:open

        let DDDD = `${headlight},${speed_mode},${throttle},${taillight}`

         return _sendCommand({
            XX: 'S7',
            DDDD: DDDD
        });

     }

     // TODO: if you want to change what the modes mean, what the user can chnage from the device
    function _setScooterInstructionTwo({speed_display = '0', cruise_control = '0', startup_mode = '0', switching_speed_mode = '0', switching_headlight = '0', low_speed_mode = '0', medium_speed_mode = '0', high_speed_mode = '0'}){
        // *SCOS,OM,123456789123456,S4,0,0,0,0,0,15,20,25#

        // speed_display => 0:invalid(Don’tset)1:shutdown 2:open
        // cruise_control => 0:invalid(Don’tset)1:shutdown 2:open
        // startup_mode => 0:invalid(Don’t set) 1:Non-zero start 2:Zero start
        // switching_speed_mode => 0:invalid(Don’t set) 1:shut down 2:open
        // switching_headlight => 0:invalid(Don’tset)1:shutdown 2:open
        // low_speed_mode => 0:invalid(Don’t set) Range:6-25km/h (Defaults:15km/h)
        // medium_speed_mode => 0:invalid(Don’t set) Range:6-25km/h (Defaults:20km/h)
        // high_speed_mode => 0:invalid(Don’t set) Range:6-25km/h (Defaults:25km/h)

        let DDDD = `${speed_display},${cruise_control},${startup_mode},${switching_speed_mode},${switching_headlight},${low_speed_mode},${medium_speed_mode},${high_speed_mode}`;

         return _sendCommand({
            XX: 'S4',
            DDDD: DDDD
        });

    }

     function setHeadlightOn(){
         return _setScooterInstructionOne({headlight: '2'});
     }

     function setHeadlightOff() {
        return _setScooterInstructionOne({headlight: '1'})
     }

     function setTaillightOn(){
        return _setScooterInstructionOne({taillight: '2'})
     }
     function setTaillightOff(){
        return _setScooterInstructionOne({taillight: '1'})
     }

     function switchOffAlarm(){
        // *SCOS,OM,123456789123456,W0#
        return _sendCommand({
            XX: 'WO',
            DDDD: null
        });
     }

    function _switchOnBeep({state = '1'}){
        // 1: Hold
        // 2: Find a scooter alert
        // 80: Turn off voice
        // 81: Turn on voice

        // *SCOS,OM,123456789123456,V0,1#

        return _sendCommand({
            XX: 'VO',
            DDDD: state
        });
    }

    function holdScooter(){
        return _switchOnBeep({state: '1'});
    }

    function findScooter(){
        return _switchOnBeep({state: '2'});
    }

    function turnOnVoice(){
        return _switchOnBeep({state: '80'});
    }

    function turnOffVoice(){
        return _switchOnBeep({state: '81'});
    }

    function getPosition(){
        // *SCOS,OM,123456789123456,D0#
        return _sendCommand({
            XX: 'D0',
            DDDD: null
        });
    }

    function setTrackingInterval({interval = '60'}){
        // *SCOS,OM,123456789123456,D1,60#
        return _sendCommand({
            XX: 'D1',
            DDDD: interval
        });
    }

    function getFirmwareInfo(){
        // *SCOS,OM,123456789123456,G0#
        return _sendCommand({
            XX: 'G0',
            DDDD: null
        });
    }

    function clearLockAlert() {
        // *SCOS,OM,123456789123456,E0#
        return _sendCommand({
            XX: 'E0',
            DDDD: null
        });
    }

    function _sendEvent({event}){
        // 1 IOT turn off
        // 2 IOT restart
        // 10 The scooter is reserved
        // 11 Cancel scooter reservation
        // 12 Mark scooter fault
        // 13 Cancel fault flag
        // 16 Marked scooter lost
        // 17 Cancel the lost scooter tag

        // *SCOS,OM,123456789123456,S1,X#
        return _sendCommand({
            XX: 'S1',
            DDDD: event
        });
    }

    function turnOffIOT(){
        return _sendEvent({event:'1'})
    }

    function restartIOT(){
        return _sendEvent({event:'2'})
    }

    function markReserved(){
        return _sendEvent({event: '10'})
    }

    function cancelReserved(){
        return _sendEvent({event: '11'})
    }

    function markFaulty(){
        return _sendEvent({event: '12'})
    }

    function cancelFaulty(){
        return _sendEvent({event: '13'})
    }

    function markLost(){
        return _sendEvent({event: '16'})
    }

    function cancelLost(){
        return _sendEvent({event: '17'})
    }


    function _unlockExternalComponent({component}) {
        // *SCOS,OM,123456789123456,L5,1#

        // 1-> Unlock battery lock
        // 2-> Unlock wheel lock
        // 3-> Unlock cable lock
        // 17-> lock Battery lock
        // 18-> lock Wheel lock
        // 19-> lock Cable lock
        // 33-> Get battery lock status
        // 34-> Get wheel lock status
        // 35-> Get cable lock status
        return _sendCommand({
            XX: 'L5',
            DDDD: component
        });
    }

    function unlockBatteryComponent(){
        return _unlockExternalComponent({component: '1'})
    }
    function lockBatteryComponent(){
        return _unlockExternalComponent({component: '17'})
    }
    function isBatteryComponentLocked(){
        return _unlockExternalComponent({component: '33'})
    }

    function unlockWheelComponent(){
        return _unlockExternalComponent({component: '2'})
    }
    function lockWheelComponent(){
        return _unlockExternalComponent({component: '18'})
    }
    function isWheelComponentLocked(){
        return _unlockExternalComponent({component: '34'})
    }

    function unlockCableComponent(){
        return _unlockExternalComponent({component: '3'})
    }
    function lockCableComponent(){
        return _unlockExternalComponent({component: '19'})
    }

    function isCableComponentLocked(){
        return _unlockExternalComponent({component: '35'})
    }

    return {
        cancelFaulty,
        cancelLost,
        cancelReserved,
        clearLockAlert,
        closeSocket,
        findScooter,
        getFirmwareInfo,
        getPosition,
        getScooterInformation,
        holdScooter,
        initialize,
        isBatteryComponentLocked,
        isWheelComponentLocked,
        isCableComponentLocked,
        lockScooter,
        lockWheelComponent,
        lockBatteryComponent,
        lockCableComponent,
        markFaulty,
        markLost,
        markReserved,
        resetIOTSettings,
        setTaillightOff,
        setHeadlightOff,
        setTaillightOn,
        setHeadlightOn,
        setTrackingInterval,
        switchOffAlarm,
        restartIOT,
        turnOffIOT,
        turnOffVoice,
        turnOnVoice,
        unlockBatteryComponent,
        unlockCableComponent,
        unlockWheelComponent,
        unlockScooter,
        updateSocket,
        DEVICE_ID,
        socket
    }

}

module.exports = {Scooter}
