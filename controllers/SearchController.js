var Item = require('../models/otlentity');
var async = require('async');


exports.search_detail = function (req, res, next) {
    req.checkBody('otlname', 'Name required').notEmpty();
    var errors = req.validationErrors();
    if(errors) {
        res.render('search', {title: 'ere'});
        return;
    }

    res.render('search', {title:'not ere'});

};