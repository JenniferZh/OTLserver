var express = require('express');
var router = express.Router();


var item_controller = require('../controllers/ItemController');


/* GET home page. */
router.get('/IFC/:itemName', item_controller.item_detail);
router.get('/Classcode/:itemName', item_controller.classcode_detail);
router.get('/Same/:itemName', item_controller.item_same);

module.exports = router;