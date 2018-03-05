var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ItemSchema = Schema(
    {
        name:{type:String, required:true},
        childs:{type:[String]},
        parent:{type:String},
        parent_list:{type:[String]},
        attr:{type:[String]},
        attr_all:{type:[String]},
        equalclass:{type:[String]}

    }
);

// Virtual for IFC's URL
ItemSchema
    .virtual('url')
    .get(function () {
        return '/catalog/roadifc/' + this.name;
    });

//Export model
module.exports = mongoose.model('RoadItem', ItemSchema, 'RoadItems');