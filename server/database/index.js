const {sequelize} = require("./database");
require('./relationship')
// TODO: do the Relationship definitions here


sequelize.sync ({ alter: true }).then ( function () {
    console.log("=====END DB SETUP====\n");
}).catch(error => {
    console.error(error)
});
