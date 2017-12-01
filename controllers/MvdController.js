var Mvd = require('../models/mvd');
var Template = require('../models/concept');
var View = require('../models/modelview');



exports.mvd_detail = function (req, res, next) {

    Mvd.find({}, function (err, mvdlist) {
        if (err) return handleError(err);
        res.render('mvdall', {mvdlist: mvdlist});
    });
};

exports.more_detail = function (req, res, next) {

    Mvd.findOne({uuid: req.params.mvdname}, function (err, mvd) {
        if(err) return handleError(err);

        templist = mvd.templates;

        Template.find({uuid: {$in: templist}}, function (err, result) {
            if(err) return handleError(err);

            viewlist = mvd.views;

            View.find({uuid: {$in: viewlist}}, function (err, result2) {
                if(err) return handleError(err);

                res.render('mvd',{templist: result, mvd: mvd, viewlist: result2});
                console.log(result2);

            });

        });

    });
};