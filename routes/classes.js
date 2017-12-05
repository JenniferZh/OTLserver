var express = require('express');
var router = express.Router();


var class_controller = require('../controllers/ClassController');


/* GET home page. */
router.get('/:itemName', class_controller.class_list);

module.exports = router;