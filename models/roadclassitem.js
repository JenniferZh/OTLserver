var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var RoadClassItemSchema = Schema(
    {
        name:{type:String, required:true},
        childs: {type: [String]},
        parent: {type:String},
        def:{type:String},
        code:{type:String},
        parent_list:{type:[String]}
    }
);

// Virtual for MVD's URL
RoadClassItemSchema
    .virtual('url')
    .get(function () {
        return '/roadclassitem/' + this.name;
    });

//Export model
module.exports = mongoose.model('RoadClassitems', RoadClassItemSchema, 'RoadClassitems');