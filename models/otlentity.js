var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ItemSchema = Schema(
    {
        name:{type:String, required:true},
        child:{type:[String]},
        parents:{type:[String]}
    }
);

// Virtual for author's URL
ItemSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

//Export model
module.exports = mongoose.model('Item', ItemSchema);
