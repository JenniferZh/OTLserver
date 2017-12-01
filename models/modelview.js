var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ViewSchema = Schema(
    {
        name:{type:String, required:true},
        applicableSchma:{type:String},
        uuid:{type:String},
        code:{type:String},
        status: {type:String},
        def:{type:Object},
        exr:{type:Object},
        roots:{type:Object}
    }
);

// Virtual for MVD's URL
ViewSchema
    .virtual('url')
    .get(function () {
        return '/view/' + this.uuid;
    });

//Export model
module.exports = mongoose.model('View', ViewSchema, 'Views');