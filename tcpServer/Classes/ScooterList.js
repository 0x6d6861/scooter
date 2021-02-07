const {Scooter} = require("./Scooter");

class ScooterList {
    constructor() {
        this.list = new Map();
    }

    has(DEVICE_ID) {
        return this.list.has(DEVICE_ID);
    }

    get(DEVICE_ID) {
        return this.list.get(DEVICE_ID);
    }

    delete(DEVICE_ID) {
        return this.list.delete(DEVICE_ID);
    }

    add(scooter = new Scooter()) {
        return this.list.set(scooter.DEVICE_ID, scooter);
    }

    clear(){
        return this.list.clear()
    }

    describe(){
        console.log(this.list.values());
    }
}

module.exports = {ScooterList}
