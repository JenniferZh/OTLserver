var express = require('express');
var router = express.Router();


var search_controller = require('../controllers/SearchController');


/* GET home page. */
router.post('/result', search_controller.search_detail);

module.exports = router;