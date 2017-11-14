var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ItemSchema = Schema(
    {
        name:{type:String, required:true},
        child:{type:[String]},
        parents:{type:[String]}
    }
);

// Virtual for IFC's URL
ItemSchema
    .virtual('url')
    .get(function () {
        return '/catalog/ifc/' + this.name;
    });

//Export model
module.exports = mongoose.model('Item', ItemSchema, 'Items');
