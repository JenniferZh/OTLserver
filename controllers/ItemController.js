var Item = require('../models/otlentity');
var Classitems = require('../models/classitem');

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