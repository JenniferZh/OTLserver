var Classitems = require('../models/classitem');
var Roadclassitems = require('../models/roadclassitem');


exports.classitem_list = function (req, res) {

    var getItem = function (itemName) {
        return new Promise(function(resolve, reject){
            Classitems.findOne({name: itemName}, function (err, person) {
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
            Classitems.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Classitems.find({name: {$in: person.childs}}, function (err, childs) {
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
            Classitems.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Classitems.findOne({name: person.parent}, function (err, parents) {
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
            Classitems.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Classitems.find({name: {$in: person.parent_list}}, function (err, parents) {
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


        res.render('classitem', { child_item: values[0], parent_item: values[1], curitem: values[2], parent_list: values[3]} );


    }).catch(function(error){ console.log(error);});

};



exports.roadclassitem_list = function (req, res) {

    var getItem = function (itemName) {
        return new Promise(function(resolve, reject){
            Roadclassitems.findOne({name: itemName}, function (err, person) {
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
            Roadclassitems.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Roadclassitems.find({name: {$in: person.childs}}, function (err, childs) {
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
            Roadclassitems.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Roadclassitems.findOne({name: person.parent}, function (err, parents) {
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
            Roadclassitems.findOne({name: itemName}, function (err, person) {
                if (err) {
                    reject(err);
                } else {
                    Roadclassitems.find({name: {$in: person.parent_list}}, function (err, parents) {
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

        // values[0].forEach(function (value) {
        //     console.log(value);
        // });


        res.render('classitem', { child_item: values[0], parent_item: values[1], curitem: values[2], parent_list: values[3]} );


    }).catch(function(error){ console.log(error);});

};
