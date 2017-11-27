var express = require('express');
var router = express.Router();

var temp_controller = require('../controllers/TemplateController');

/* GET home page. */
router.get('/:uuid', temp_controller.template_detail);

module.exports = router;