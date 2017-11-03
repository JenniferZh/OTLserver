var Item = require('../models/otlentity');
var async = require('async');

exports.author_list = function (req, res) {
    res.send('not implement');
}

exports.item_detail = function (req, res, next) {
    async.parallel({
        item: function(callback) {

            Item.find({name: req.params.itemName})
                .exec(callback);
        },


    }, function(err, results) {
        if (err) {

            return next(err);
        }

        var cnt = results.item.length;
        if(cnt == 0)
            res.send('Not Found');
        else{
            var detail = new Object();
            detail.name = results.item[0].name;
            detail.parents = results.item[0].parents;
            detail.child = results.item[0].child;
            res.send(detail);
        }


        //res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};