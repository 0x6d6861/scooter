module.exports = function (scooterList) {
    return {
        'action/scooter/lock': {
            method: function (DEVICE_ID, {...message}) {

                    let action = message;
                    const selectedScooter = scooterList.get(DEVICE_ID);

                    if(action.state === 'UNLOCK'){
                        selectedScooter.unlockScooter({user: action.user}).then(() => {
                            console.log(`${selectedScooter.DEVICE_ID} => UNLOCKED!`);
                            // selectedScooter.setHeadlightOn();
                        })
                    }

                    if(action.state === 'LOCK'){
                        selectedScooter.lockScooter({user: action.user}).then(() => {
                            console.log(`${selectedScooter.DEVICE_ID} => LOCKED!`);
                            // selectedScooter.setHeadlightOff();
                        })
                    }

            }
        },
        'action/scooter/light': {
            method: function (DEVICE_ID, {headlight, taillight}) {

                const selectedScooter = scooterList.get(DEVICE_ID);

                if(headlight === '1'){
                    selectedScooter.setHeadlightOn();
                } else {
                    selectedScooter.setHeadlightOff();
                }

                if(taillight === '1'){
                    selectedScooter.setTaillightOn();
                } else {
                    selectedScooter.setTaillightOff();
                }
            }
        },
        'action/scooter/beep': {
            method: function (DEVICE_ID, {action = 'HOLD'}) {
                const selectedScooter = scooterList.get(DEVICE_ID);

                switch (action) {
                    case "HOLD":
                        selectedScooter.holdScooter();
                        break;
                    case "FIND":
                        selectedScooter.findScooter();
                        break;
                    case "VOICE_ON":
                        selectedScooter.turnOnVoice();
                        break;
                    case "VOICE_OFF":
                        selectedScooter.turnOffVoice();
                        break;
                }

            }
        },
        'action/scooter/position': {
            method: function (DEVICE_ID, {}) {

                const selectedScooter = scooterList.get(DEVICE_ID);

                selectedScooter.getPosition();
            }
        },
        'action/scooter/reserve': {
            method: function (DEVICE_ID, {state = '1'}) {
                const selectedScooter = scooterList.get(DEVICE_ID);

                if(state === '1'){
                    selectedScooter.markReserved()
                }

                if(state === '0'){
                    selectedScooter.cancelReserved()
                }
            }
        },
        'action/scooter/lost': {
            method: function (DEVICE_ID, {state = '1'}) {
                const selectedScooter = scooterList.get(DEVICE_ID);

                if(state === '1'){
                    selectedScooter.markLost()
                }

                if(state === '0'){
                    selectedScooter.cancelLost()
                }
            }
        },
        'action/scooter/faulty': {
            method: function (DEVICE_ID, {state = '1'}) {
                const selectedScooter = scooterList.get(DEVICE_ID);

                if(state === '1'){
                    selectedScooter.markFaulty()
                }

                if(state === '0'){
                    selectedScooter.cancelFaulty()
                }
            }
        },
        'action/scooter/alarm': {
            method: function (DEVICE_ID, {state = '1'}) {
                const selectedScooter = scooterList.get(DEVICE_ID);

                /*if(state === '1'){
                    selectedScooter.switchOnAlarm()
                }*/

                if(state === '0'){
                    selectedScooter.switchOffAlarm()
                }
            }
        },
        'action/scooter/trackinginterval': {
            method: function (DEVICE_ID, {seconds = '10'}) {
                const selectedScooter = scooterList.get(DEVICE_ID);
                selectedScooter.setTrackingInterval({interval: seconds})
            }
        },
        'action/scooter/info': {
            method: function (DEVICE_ID, {}) {
                const selectedScooter = scooterList.get(DEVICE_ID);

                selectedScooter.getScooterInformation()
            }
        },
    }
}
