var Mvd = require('../models/mvd');
var Template = require('../models/concept');



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

            res.render('mvd',{templist: result, mvd: mvd});

        });

    });

};