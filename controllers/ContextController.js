var Item = require('../models/otlentity');
var RoadItem = require('../models/roaditem');
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
                    Item.find({name: {$in: person.childs}}, function (err, childs) {
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

    var getParent = function (itemName) {
        return new Promise(function(resolve, reject){
            Item.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Item.findOne({name: person.parent}, function (err, parents) {
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

    var getParentList = function (itemName) {
        return new Promise(function(resolve, reject){
            Item.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Item.find({name: {$in: person.parent_list}}, function (err, parents) {
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

    Promise.all([getChilds(name), getParent(name), getItem(name), getParentList(name)]).then(function(values){


        res.render('context', { child_item: values[0], parent_item: values[1], curitem: values[2], parent_list: values[3], hostname: "localhost:3000"} );


    }).catch(function(error){ console.log(error);});




};


exports.context_detail_road = function (req, res, next) {

    var getItem = function (itemName) {
        return new Promise(function(resolve, reject){
            RoadItem.findOne({name: itemName}, function (err, person) {
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
            RoadItem.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    RoadItem.find({name: {$in: person.childs}}, function (err, childs) {
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

    var getParent = function (itemName) {
        return new Promise(function(resolve, reject){
            RoadItem.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    RoadItem.findOne({name: person.parent}, function (err, parents) {
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

    var getParentList = function (itemName) {
        return new Promise(function(resolve, reject){
            RoadItem.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    RoadItem.find({name: {$in: person.parent_list}}, function (err, parents) {
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

    Promise.all([getChilds(name), getParent(name), getItem(name), getParentList(name)]).then(function(values){


        res.render('context', { child_item: values[0], parent_item: values[1], curitem: values[2], parent_list: values[3], hostname: "localhost:3000"} );


    }).catch(function(error){ console.log(error);});
};



