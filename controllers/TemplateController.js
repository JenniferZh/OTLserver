var Template = require('../models/concept');



exports.template_detail = function (req, res, next) {
    console.log(req.params.uuid);

    Template.findOne({uuid: req.params.uuid}, function (err, template) {

        if (err) return handleError(err);

        res.render('template', {temp: template});
    });
};