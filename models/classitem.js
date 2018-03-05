var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ClassItemSchema = Schema(
    {
        name:{type:String, required:true},
        childs: {type: [String]},
        parent: {type:String},
        def:{type:String},
        code:{type:String},
        parent_list:{type:[String]},
        equalclass:{type:[String]}
    }
);

// Virtual for MVD's URL
ClassItemSchema
    .virtual('url')
    .get(function () {
        return '/classitem/' + this.name;
    });

//Export model
module.exports = mongoose.model('Classitems', ClassItemSchema, 'Classitems');