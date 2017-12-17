var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var RuleSchema = Schema(
    {
        id:{type:String, required:true},
        source:{type:String},
        content:{type:String},
        SNL:{type:Object},
    }
);

// Virtual for IFC's URL
RuleSchema
    .virtual('url')
    .get(function () {
        return 'rules/road/' + this.id;
    });

//Export model
module.exports = mongoose.model('Rules', RuleSchema, 'Rules');
