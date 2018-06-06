var express = require('express');
var router = express.Router();
var AllScopes = require('../models/allscope');
var RelationMatch = require('../models/relationmatch');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/manage', function(req, res, next) {
    res.render('Manager');
});

router.post('/upload', function(req, res, next) {
    var uploadcode = req.body.upload;
    if(!/^\w+-[A-Za-z0-9.]+$/.test(req.body.code)) {
        res.send({status:-1});
    } else {
        var classcode_scope = req.body.code.split('-')[0];
        var classcode_code = req.body.code.split('-')[1];
        var ifc_scope = req.body.ifcscope;
        var ifc = req.body.ifc;

        AllScopes.find({scope: ifc_scope, code: ifc}, function(err, result) {
            //console.log(err, result);
            if(!result.length) {
                //没找到
                console.log(ifc_scope, ifc);
                res.send({status:0});
            } else {
                //找到一个
                AllScopes.find({scope: classcode_scope, code: classcode_code}, function (err, result2) {
                    if(!result2.length) {
                        //没找到第二个
                        res.send({status: 1});
                    } else {
                        RelationMatch.create({ifc:ifc_scope+'-'+ifc, ifd: req.body.code}, function(err, result3) {
                            if(err) {
                                res.send({status:2});

                            } else {
                                res.send({status:3});
                            }

                        });
                    }

                });

            }
        })
    }
});

module.exports = router;