var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ScopeSchema = Schema(
    {
        name:{type:String},
        code: {type: String},
        scope: {type: String}
    }
);

// Virtual for MVD's URL
ScopeSchema
    .virtual('url')
    .get(function () {
        return '/allscope/' + this.scope+"-"+this.code;
    });

//Export model
module.exports = mongoose.model('AllScopes', ScopeSchema, 'AllScopes');