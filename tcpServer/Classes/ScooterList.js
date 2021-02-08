const {Scooter} = require("./Scooter");

function ScooterList() {

    const list = new Map();


    function has(DEVICE_ID) {
        return list.has(DEVICE_ID);
    }

    function get(DEVICE_ID) {
        return list.get(DEVICE_ID);
    }

    function remove(DEVICE_ID) {
        return list.delete(DEVICE_ID);
    }

    function add(scooter = new Scooter()) {
        return list.set(scooter.DEVICE_ID, scooter);
    }

    function clear(){
        return list.clear()
    }

    function describe(){
        console.log(list.values());
    }

    return {
        has, get, remove, clear, describe, add
    }
}

module.exports = {ScooterList}
