/**
 * Created by Orange on 2017/11/2.
 */
var MongoClient = require('mongodb').MongoClient,
    fs = require('fs'),
    url = 'mongodb://localhost/mylibrary';

var json = JSON.parse(fs.readFileSync('test.json', 'utf8'));
// console.log(json)

var saveItem = function(db, name, child, parents) {
    return new Promise(function (resolve, reject) {
        db.collection('Items').insert({name:name, child:child, parents:parents}, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

MongoClient.connect(url, function (err, db) {
    if(err) {
        console.error(err);
    } else {
        var itemPromises = [];
        for(var value in json)
            itemPromises.push(saveItem(db, value, json[value].child, json[value].parents));
        Promise.all(itemPromises).then(function () {
            db.close();
        })
    }

});