var Item = require('../models/otlentity');
var async = require('async');


exports.search_detail = function (req, res, next) {
    // req.checkBody('otlname', 'Name required').notEmpty();
    // var errors = req.validationErrors();
    // if(errors) {
    //     res.render('search', {title: 'ere'});
    //     return;
    // }

    //res.send(req);
    //console.log(req.params);

    //res.render('search', {title:req.body.name_field});
    var regexstring = '\''+req.body.name_field +'\'';
    //console.log(regexstring);
    Item.find({name: new RegExp(req.body.name_field,"i")}, function(err, entity) {
        if (err) return handleError(err);
        //console.log(entity.length);
        res.render('search', {search_result: entity});
    });

};