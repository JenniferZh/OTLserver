#! /usr/bin/env node

console.log('This script populates a some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');


var async = require('async');

var Item = require('./models/otlentity');


var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/mylibrary';
//var mongoDB = 'mongodb://zym:zym@ds243335.mlab.com:43335/library66';
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


var items = [];

function convert(strs) {
    str = '';
    for (var t = 0; t < strs.length; t++) {
        str = str + '\''+strs[t]+'\'' + ',';
    }

    newstr = str.substr(0, str.length-1);
    console.log(newstr);
    return newstr;
}


function itemCreate(name, child, parents, cb) {
    var itemdetail = {name: name, child: child, parents: parents};

    var item = new Item(itemdetail);

    item.save(
        function (err) {
            if(err) {
                cb(err, null);
                return;
            }
            console.log('new item'+item);
            cb(null, item);
        }
    );
}

var fs = require('fs');
var json = JSON.parse(fs.readFileSync('test.json', 'utf8'));

var i = 0;
var evilstring = '';
for(var value in json) {
    var par = json[value].parents;
    var chil = json[value].child;


    var afun = function (callback) {
        itemCreate(value, chil, par, callback);
    };

    console.log(convert(chil));

    evilstring = evilstring+'function (callback) {' + 'itemCreate(\"'+value+'\", ['+convert(chil)+'], ['+convert(par)+'], callback);' + '},'

    items.push(afun);
}

evilstring = 'async.parallel(['+evilstring+']'+',cb);'

function createItems(cb) {
    eval(evilstring);
}

async.series([
        createItems,
    ],
// optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        mongoose.connection.close();
    }
);



