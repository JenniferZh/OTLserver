var AllScopes = require('../models/allscope');
var RelationParent = require('../models/relationparent');
var RelationSame = require('../models/relationsame');

exports.getParent = function (code) {
    return new Promise(function(resolve, reject){

        RelationParent.findOne({child: code}, function(err, rel) {

            if(rel === null) {
                resolve(null);
            } else {

                AllScopes.findOne({code: rel.parent.split('-')[1], scope: rel.parent.split('-')[0]}, function(err, parent) {
                    resolve(parent);
                })
            }
        });

    });
};

exports.getChilds = function (code) {
    return new Promise(function(resolve, reject){

        RelationParent.find({parent: code}, function(err, rel) {

            if(rel === null) {
                resolve(null);
            } else {



                AllScopes.find({code: {$in: rel.map(function (erel) {
                    return erel.child;
                })}}, function(err, childs) {
                    resolve(childs);
                });
            }
        });

    });
};

exports.getSame = function (code) {
    return new Promise(function(resolve, reject) {
        RelationSame.find({$or:[{a: code},{b: code}]}, function (err, item) {
            if(item !== null) {
                var samelist = item.map(function (each) {
                    if(each.a === code) return each.b;
                    else return each.a;
                });
                console.log(item);


                var conditions = samelist.map(function(s) {

                    return {scope: s.split('-')[0], code: s.split('-')[1]};
                });
                console.log(conditions);

                var promises = conditions.map(function(cond) {
                    return new Promise(function(resolve, reject)
                    {
                        AllScopes.findOne(cond, function (err, result) {
                            if(result !== null) {
                                console.log("herr",result)
                                resolve(result);
                            }
                            else {
                                console.log("null")
                                reject(null);
                            }
                        });
                    });
                });
                console.log(promises);

                const FAIL_TOKEN = {};

                const resolvedPromises = Promise.all(
                    promises.map(p => p.catch(e => FAIL_TOKEN))
                ).then(
                    values => {
                        values.filter(v => v !== FAIL_TOKEN);
                        resolve(values);
                    }
                );

            }
            else {
                resolve(null);
            }

        });
    })
};