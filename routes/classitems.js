var express = require('express');
var router = express.Router();


var classitem_controller = require('../controllers/ClassItemController');


/* GET home page. */
router.get('/:itemName', classitem_controller.classitem_list);

module.exports = router;