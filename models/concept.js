var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ConceptSchema = Schema(
    {
        name:{type:String, required:true},
        templateName:{type:String},
        uuid:{type:String},
        type:{type:String},
        children: {type: Object}
    }
);

// Virtual for MVD's URL
ConceptSchema
    .virtual('url')
    .get(function () {
        return '/mvd/concept/' + this.uuid;
    });

//Export model
module.exports = mongoose.model('Template', ConceptSchema, 'Templates');