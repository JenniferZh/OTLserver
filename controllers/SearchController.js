var Item = require('../models/otlentity');
var RoadItem = require('../models/roaditem');
var RoadClassItem = require('../models/roadclassitem');
var RailClassItem = require('../models/classitem');
var async = require('async');




exports.search_detail = function (req, res, next) {


    async.parallel([
        function(callback) {
            Item.find({name: new RegExp(req.body.name_field,"i")}, function(err, entity) {
                if (err) return handleError(err);
                //console.log(entity.length);
                entity.forEach(function(item){
                    item.from = '铁路数据模型';
                });
                callback(null, entity);

                //console.log(entity);
                //res.render('search', {search_result: entity});
            });
        },
        function (callback) {
            RoadItem.find({name: new RegExp(req.body.name_field,"i")}, function(err, entity) {
                if (err) return handleError(err);
                //console.log(entity.length);
                entity.forEach(function(item){
                    item.from = '公路数据模型';
                });
                callback(null, entity);

                //res.render('search', {search_result: entity});
            });

        },
        function (callback) {
            RoadClassItem.find({name: new RegExp(req.body.name_field,"i")}, function(err, entity) {
                if (err) return handleError(err);
                    //console.log(entity.length);
                entity.forEach(function(item){
                        item.from = '公路分类编码';
                 });
                callback(null, entity);

                    //res.render('search', {search_result: entity});
            });

        },
            function (callback) {
                RailClassItem.find({name: new RegExp(req.body.name_field,"i")}, function(err, entity) {
                    if (err) return handleError(err);
                    //console.log(entity.length);
                    entity.forEach(function(item){
                        item.from = '铁路分类编码';
                    });
                    callback(null, entity);

                    //res.render('search', {search_result: entity});
                });

            }


    ],
    function(err, result){
        var final_result = [];
        result.forEach(function(element){
            final_result = final_result.concat(element);
        });
        console.log(final_result);

        res.render('search', {search_result: final_result});
    });


};