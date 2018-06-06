var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var MatchSchema = Schema(
    {
        ifc:{type:String},
        ifd: {type: String}
    }
);

MatchSchema.index({ ifc: 1, ifd: 1 }, { unique: true });


//Export model
module.exports = mongoose.model('RelationMatch', MatchSchema, 'RelationMatch');