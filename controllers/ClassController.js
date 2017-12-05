var Classcodes = require('../models/classcode');


exports.class_list = function (req, res) {
    //res.send(req.params.itemName);
    console.log(req.params.itemName);
    Classcodes.findOne({name: req.params.itemName}, function (err, classlist) {
        if (err) return handleError(err);
        //res.render('class', {classlist: classlist});
        Classcodes.find({}, 'name', function (err, result) {
            res.render('class',{namelist: result, curclass: classlist});
        });


    });
};

