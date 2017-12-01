var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var MvdSchema = Schema(
    {
        name:{type:String, required:true},
        ns:{type:String},
        uuid:{type:String},
        templates:{type:[String]},
        views:{type:[String]}
    }
);

// Virtual for MVD's URL
MvdSchema
    .virtual('url')
    .get(function () {
        return '/mvd/' + this.uuid;
    });

//Export model
module.exports = mongoose.model('Mvd', MvdSchema, 'MVDs');