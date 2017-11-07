var express = require('express');
var router = express.Router();


var context_controller = require('../controllers/ContextController');


/* GET home page. */
router.get('/:itemName', context_controller.context_detail);

module.exports = router;