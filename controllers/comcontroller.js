var AllScopes = require('../models/allscope');
var RelationParent = require('../models/relationparent');
var RelationSame = require('../models/relationsame');

exports.getParent = function (code) {
    return new Promise(function(resolve, reject){

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

exports.getSame = function (code) {
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
};