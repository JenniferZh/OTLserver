var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ParentSchema = Schema(
    {
        parent:{type:String},
        child: {type: String}
    }
);


//Export model
module.exports = mongoose.model('RelationParent', ParentSchema, 'RelationParent');