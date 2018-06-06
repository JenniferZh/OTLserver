
var AllScopes = require('../models/allscope');
var RelationSame = require('../models/relationsame');
var RelationMatch = require('../models/relationmatch');
var common = require('./comcontroller');

exports.item_same = function (req, res, next) {
    var code = req.params.itemName;
    RelationSame.find({$or:[{a: code},{b: code}]}, function (err, item) {
        if(item !== null) {
            var samelist = item.map(function (each) {
                if(each.a === code) return each.b;
                else return each.a;
            });
            AllScopes.find({code: {$in: samelist}}, function(err, result) {
                res.send(result);
            });

        }
        else {
            res.send([]);
        }

    });
};


exports.allscope_detail = function(req, res, next) {
    AllScopes.findOne({code:req.params.itemName}, function(err, result) {
       if(result === null) {
           res.send(null);
       } else {
           obj = {};
           obj.name = result.name;
           obj.code = result.code;
           obj.scope = result.scope;
           common.getParent(result.code).then(function (value) {
               obj.parent = value;
               common.getChilds(result.code).then(function(value2) {
                   obj.childs = value2;
                   res.send(obj);
               })
           });

       }

    });
};


exports.get_match = function (req, res, next) {
    var code = req.params.itemName;
    RelationMatch.find({ifd: code}, function(err, item) {
       if(err) {
           res.send(null);
       } else {
           if(item.length) {
               res.send(item[0]);
           }
           else {
               res.send(null);
           }
       }
    });
};