var Item = require('../models/otlentity');
var async = require('async');


exports.context_detail = function (req, res, next) {

    var getItem = function (itemName) {
        return new Promise(function(resolve, reject){
            Item.findOne({name: itemName}, function (err, person) {
                if(err) {
                    reject(err);

                } else {
                    resolve(person);
                }

            })
        })
    };

    var getChilds = function (itemName) {
        return new Promise(function(resolve, reject){
            Item.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Item.find({name: {$in: person.child}}, function (err, childs) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(childs);
                        }
                    })
                }
            });
        });
    };

    var getParents = function (itemName) {
        return new Promise(function(resolve, reject){
            Item.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Item.find({name: {$in: person.parents}}, function (err, parents) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(parents);
                        }
                    })
                }
            });
        });
    };

    var name = req.params.itemName;

    Promise.all([getChilds(name), getParents(name), getItem(name)]).then(function(values){


        res.render('context', { child_item: values[0], parent_item: values[1], curitem: values[2]} );

    }).catch(function(error){ console.log(error);});




};



