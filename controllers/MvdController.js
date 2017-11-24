var Mvd = require('../models/mvd');



exports.mvd_detail = function (req, res, next) {

    Mvd.find({}, function (err, mvdlist) {
        if (err) return handleError(err);
        res.render('mvdall', {mvdlist: mvdlist});
    });


};