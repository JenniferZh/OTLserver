var express = require('express');
var router = express.Router();

var rule_controller = require('../controllers/RulesController');

router.get('/:itemName', rule_controller.rule_list);

module.exports = router;