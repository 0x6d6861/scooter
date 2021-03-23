var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/command', function(req, res, next) {
    const {qr, command} = req.body;
    res.json({
        success: true,
        message: 'This is good'
    })
});

module.exports = router;
