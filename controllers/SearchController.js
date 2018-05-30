var AllScope = require('../models/allscope');


exports.search_detail = function (req, res, next) {

    AllScope.find({name: new RegExp(req.body.name_field,"i")}, function(err, entity) {
        if (err) return handleError(err);
        //console.log(entity.length);
        entity.forEach(function(item){
            item.from = '多领域分类编码';
        });
        res.render('search', {search_result: entity});
    });


};