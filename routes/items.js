var express = require('express');
var router = express.Router();


var item_controller = require('../controllers/ItemController');


/* GET home page. */
router.get('/:itemName', item_controller.item_detail);

module.exports = router;