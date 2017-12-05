var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ClassSchema = Schema(
    {
        name:{type:String, required:true},
        children: {type: Object}
    }
);

// Virtual for MVD's URL
ClassSchema
    .virtual('url')
    .get(function () {
        return '/classcode/' + this.name;
    });

//Export model
module.exports = mongoose.model('Classcodes', ClassSchema, 'Classcodes');