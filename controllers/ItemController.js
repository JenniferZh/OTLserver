var Item = require('../models/otlentity');
var Classitems = require('../models/classitem');
var RelationSame = require('../models/relationsame');
var AllScopes = require('../models/allscope');

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

exports.item_detail = function (req, res, next) {

    Item.findOne({name:req.params.itemName}, function (err, result) {
       if(err) {

       }
       if(result === null) {
           res.send('Entity Not found');
       } else {
           obj = {};
           obj.Name = result.name;
           obj.Supertype = result.parent;
           obj.Subtypes = result.childs;
           obj.Attribute = result.attr;
           res.send(obj);
       }

    });
};

exports.classcode_detail = function (req, res, next) {
    Classitems.findOne({name:req.params.itemName}, function (err, result) {
        if(err) {

        }
        if(result === null) {

            res.send(req.params.itemName);
        } else {
            obj = {};
            obj.Name = result.name;
            obj.Supertype = result.parent;
            obj.Subtypes = result.childs;
            obj.code = result.code;
            obj.def = result.def;
            res.send(obj);
            //res.send(result);
        }

    });
};