var express = require('express');
var router = express.Router();

var mvd_controller = require('../controllers/MvdController');

/* GET home page. */
router.get('/', mvd_controller.mvd_detail);

module.exports = router;