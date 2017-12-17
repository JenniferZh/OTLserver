var Rules = require('../models/rules');


exports.rule_list = function (req, res) {
    //res.send(req.params.itemName);
    console.log(req.params.itemName);
    Rules.findOne({id: req.params.itemName}, function (err, rule) {
        if (err) return handleError(err);
        //res.render('class', {classlist: classlist});
        Rules.find({}, 'id', function (err, rulelist) {
            //res.send({rules: rulelist, currule: rule});
            res.render('rules',{rules: rulelist, currule: rule});
        });
    });
};