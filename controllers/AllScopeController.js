var AllScopes = require('../models/allscope');
var RelationParent = require('../models/relationparent');
var RelationSame = require('../models/relationsame');

//{name: {$in: person.parent_list}

exports.scope_item = function (req, res) {

    var getItem = function(code) {
        return new Promise(function(resolve, reject) {
            AllScopes.findOne({code: code}, function(err, item) {
                resolve(item);
            });
        });
    };

    var getParent = function (code) {
        return new Promise(function(resolve, reject){
            console.log(code);
            RelationParent.findOne({child: code}, function(err, rel) {

                if(rel === null) {
                    resolve(null);
                } else {
                    AllScopes.findOne({code: rel.parent}, function(err, parent) {
                        resolve(parent);
                    })
                }
            });

        });
    };

    var getChilds = function (code) {
        return new Promise(function(resolve, reject) {
            RelationParent.find({parent:code}, function(err, rel) {
                //console.log("rel",rel);
                if(rel === null) {
                    resolve(null);
                } else {

                    var child_list = rel.map(function(item) {
                        return item.child;
                    });

                    AllScopes.find({code:{$in: child_list}}, function(err, childs) {
                        resolve(childs);
                    })
                }
            })
        });
    };


    function addToPath(code, callback) {
        RelationParent.findOne({child: code}, function(err, item) {
            if(err) {
                return handleError(err);
            }
            //console.log(item);
            if(item !== null) {
                parent_list.push(item.parent);
                if(item.parent !== null) {
                    addToPath(item.parent, callback);
                }
            } else {
                callback();
            }
        });
    }

    function getParentList(code) {
        return new Promise(function(resolve, reject) {
            parent_list = [];
            addToPath(code, function(err) {
                AllScopes.find({code: {$in: parent_list}}, function(err, item) {
                    resolve(item);
                });
            });
        });
    }

    function getSame(code) {
        return new Promise(function(resolve, reject) {
            RelationSame.find({$or:[{a: code},{b: code}]}, function (err, item) {
                if(item !== null) {
                    var samelist = item.map(function (each) {
                        if(each.a === code) return each.b;
                        else return each.a;
                    });
                    AllScopes.find({code: {$in: samelist}}, function(err, result) {
                        resolve(result);
                    });

                }
                else {
                    resolve(null);
                }

            });
        })
    }


    var name = req.params.id;

    Promise.all([getChilds(name), getParent(name), getItem(name), getParentList(name), getSame(name)]).then(function(values){



        res.render('scope', { child_item: values[0], parent_item: values[1], curitem: values[2], parent_list: values[3], same_list: values[4]} );


    }).catch(function(error){ console.log(error);});

    //res.render('classitem', { child_item: values[0], parent_item: values[1], curitem: values[2], parent_list: values[3]} );

};