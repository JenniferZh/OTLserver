var Template = require('../models/concept');



exports.template_detail = function (req, res, next) {
    console.log(req.params.uuid);

    Template.findOne({uuid: req.params.uuid}, function (err, template) {
        console.log(template);
        if (err) return handleError(err);
        //res.send(template);
        res.render('template', {temp: template});
    });
};

