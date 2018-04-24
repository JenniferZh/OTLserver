var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var SameSchema = Schema(
    {
        a:{type:String},
        b:{type:String}
    }
);


//Export model
module.exports = mongoose.model('RelationSame', SameSchema, 'RelationSame');