var express = require('express');
var router = express.Router();

var scope_controller = require('../controllers/AllScopeController');



router.get('/:id', scope_controller.scope_item);

module.exports = router;