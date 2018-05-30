var express = require('express');
var router = express.Router();


var item_controller = require('../controllers/ItemController');


/* GET home page. */
router.get('/Same/:itemName', item_controller.item_same);
router.get('/AllScope/:itemName', item_controller.allscope_detail);

module.exports = router;