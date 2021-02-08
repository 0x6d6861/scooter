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
        }
    }
}
