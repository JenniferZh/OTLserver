var express = require('express');
var router = express.Router();


var context_controller = require('../controllers/ContextController');


/* GET home page. */
router.get('/ifc/:itemName', context_controller.context_detail);
router.get('/roadifc/:itemName', context_controller.context_detail_road);


module.exports = router;