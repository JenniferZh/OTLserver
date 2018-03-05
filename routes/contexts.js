var express = require('express');
var router = express.Router();


var context_controller = require('../controllers/ContextController');


/* GET home page. */
router.get('/ifcrailway/:itemName', context_controller.context_detail);
router.get('/ifcroad/:itemName', context_controller.context_detail_road);


module.exports = router;