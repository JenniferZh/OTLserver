var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var infos = [];
var conceptTemplates = [];



/**
 * 读入mvdmxl，解析，生成相关数据
 * @type {Buffer | string}
 */
var xml = fs.readFileSync('mvd\\example2.xml', {encoding: 'utf-8'});
var doc = new DOMParser().parseFromString(xml);

parseMVD(doc);

xml = fs.readFileSync('mvd\\katalog.mvdxml', {encoding: 'utf-8'});
doc = new DOMParser().parseFromString(xml);

parseMVD(doc);

xml = fs.readFileSync('mvd\\example.xml', {encoding: 'utf-8'});
doc = new DOMParser().parseFromString(xml);

parseMVD(doc);



console.log(infos);
console.log(conceptTemplates);

/**
 * 数据库操作
 */

var MongoClient = require('mongodb').MongoClient, url = 'mongodb://localhost/mylibrary';

var saveMVD = function(db, name, ns, uuid, templates) {
    return new Promise(function (resolve, reject) {
        db.collection('MVDs').insert({name:name, ns:ns, uuid:uuid, templates:templates}, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

var saveTemplate = function (db, name, uuid, templateName, type, children) {
    return new Promise(function(resolve, reject) {
        db.collection('Templates').insert({name: name, uuid: uuid, templateName:templateName, type:type, children: children}, function (err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }

        })
    });

};

MongoClient.connect(url, function (err, db) {
    if(err) {
        console.error(err);
    } else {
        var itemPromises = [];

        for(var i = 0; i < infos.length; i++) {
            itemPromises.push(saveMVD(db, infos[i].name, infos[i].ns, infos[i].uuid, infos[i].templates));
        }

        for(var i = 0; i < conceptTemplates.length; i++) {
            itemPromises.push(saveTemplate(db, conceptTemplates[i].name, conceptTemplates[i].uuid, conceptTemplates[i].templateName, conceptTemplates[i].type, conceptTemplates[i].children));
        }

        Promise.all(itemPromises).then(function () {
            db.close();
            console.log('done');
        })
    }

});



/**
 * 一个mvdxml文件中可能有很多个conceptTemplate
 * 需要存储在数据库里的有两个信息：
 * 1.mvdmxl的相关信息，包括mvd的名称(name)，uuid，namespace(xmlns),和template-uuid:list，放在一个collection里
 * 2.所有的conceptTemplate的json,放在一个collection里
 * @param doc
 */
function parseMVD(doc) {
    /**
     * 提取mvd信息
     */
    var mvdinfo = {};

    //console.log(doc.documentElement);

    var mvd = doc.documentElement;


    mvdinfo.name = mvd.getAttributeNode('name').nodeValue;
    mvdinfo.ns = mvd.getAttributeNode('xmlns').nodeValue;
    mvdinfo.uuid = mvd.getAttributeNode('uuid').nodeValue;
    mvdinfo.templates = [];


    /**
     * 先提取出所有拥有applicableEntity的conceptTemplate
     * @type {NodeList}
     */
    var templates =doc.documentElement.getElementsByTagName('ConceptTemplate');



    //a list of xml Element
    var templist = [];

    for(var i = 0; i < templates.length; i++) {
        //console.log(templates[i].nodeName)
        if(templates[i].hasAttribute('applicableEntity'))
            templist.push(templates[i]);
    }

    for(var i = 0; i < templist.length; i++) {
        var tmp = parseTemplate(templist[i]);
        conceptTemplates.push(tmp);
        //console.log(JSON.stringify(parseTemplate(templist[i])));
        mvdinfo.templates.push(tmp.uuid);
    }

    infos.push(mvdinfo);

}


function parseTemplate(template) {
    var temp = {};
    temp.name = template.getAttributeNode('applicableEntity').nodeValue;
    temp.uuid = template.getAttributeNode('uuid').nodeValue;
    temp.templateName = template.getAttributeNode('name').nodeValue;
    temp.type = 'entity';
    
    var rules = template.getElementsByTagName('Rules')[0];
    
    if(rules == undefined) {
        console.log('conceptTemplate中没有Rules元素，虽然这是不科学的');
    }
    //提取出每个AttributeRule标签，解析
    temp.children = [];
    for(var i = 0; i < rules.childNodes.length; i++) {
        temp.children.push(parseAttributeRule(rules.childNodes[i]));
    }
    return temp;
}

function parseAttributeRule(attribute) {
    var temp = {};
    temp.name = attribute.getAttributeNode('AttributeName').nodeValue;
    temp.children = [];
    temp.type = 'attribute';

    var rules = attribute.getElementsByTagName('EntityRules')[0];

    //如果attributerule里不再嵌套entityrule
    if(rules == undefined) {
        return temp;
    } else {
        for(var i = 0; i < rules.childNodes.length; i++) {
            temp.children.push(parseEntityRule(rules.childNodes[i]));
        }
        return temp;
    }
}

function parseEntityRule(entity) {
    var temp = {};
    temp.name = entity.getAttributeNode('EntityName').nodeValue;
    temp.children = [];
    temp.type = 'entity';



    if(entity.childNodes[0] != undefined && entity.childNodes[0].nodeName == 'References') {
        temp.ref = entity.childNodes[0].childNodes[0].getAttributeNode('ref').nodeValue;
    }

    var rules = entity.getElementsByTagName('Attributes')[0];

    if(rules == undefined) {
        return temp;
    } else {
        for(var i = 0; i < rules.childNodes.length; i++) {
            temp.children.push(parseAttributeRule(rules.childNodes[i]));
        }
        return temp;
    }




    return temp;
}




