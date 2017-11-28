var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var infos = [];
var conceptTemplates = [];



/**
 * 读入mvdmxl，解析，生成相关数据
 * @type {Buffer | string}
 */
// var xml = fs.readFileSync('mvd\\example2.xml', {encoding: 'utf-8'});
// var doc = new DOMParser().parseFromString(xml);
//
// parseMVD(doc);

xml = fs.readFileSync('mvd\\katalog.mvdxml', {encoding: 'utf-8'});
doc = new DOMParser().parseFromString(xml);

parseModelView(doc);

//parseMVD(doc);

// xml = fs.readFileSync('mvd\\example.xml', {encoding: 'utf-8'});
// doc = new DOMParser().parseFromString(xml);
//
// parseMVD(doc);



//console.log(infos);
//console.log(conceptTemplates);






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

// MongoClient.connect(url, function (err, db) {
//     if(err) {
//         console.error(err);
//     } else {
//         var itemPromises = [];
//
//         //令这两个collection检查uuid,如果重复将不会重复放入
//         db.collection('MVDs').createIndex({uuid:1},{unique:true});
//         db.collection('Templates').createIndex({uuid:1},{unique:true});
//
//         for(var i = 0; i < infos.length; i++) {
//             itemPromises.push(saveMVD(db, infos[i].name, infos[i].ns, infos[i].uuid, infos[i].templates));
//         }
//
//         for(var i = 0; i < conceptTemplates.length; i++) {
//             itemPromises.push(saveTemplate(db, conceptTemplates[i].name, conceptTemplates[i].uuid, conceptTemplates[i].templateName, conceptTemplates[i].type, conceptTemplates[i].children));
//         }
//
//         Promise.all(itemPromises).then(function () {
//             db.close();
//             console.log('done');
//         })
//     }
//
// });



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


function parseModelView(doc) {

    /**
     * 先提取出所有的ModelView
     */
    var modelviews = doc.documentElement.getElementsByTagName('ModelView');

    for(var i = 0; i < modelviews.length; i++) {
        var modelview = {};

        //提取modelview的属性, uuid,name,applicableSchema认为是一定有的属性
        modelview.uuid = modelviews[i].getAttributeNode('uuid').nodeValue;
        modelview.name = modelviews[i].getAttributeNode('name').nodeValue;
        modelview.applicableSchma = modelviews[i].getAttributeNode('applicableSchema').nodeValue;

        //有些是可选的属性，目前支持code, status；其他见文档
        if (modelviews[i].getAttributeNode('code') == undefined) {
            modelview.code = 'undefined';
        } else {
            modelview.code = modelviews[i].getAttributeNode('code').nodeValue;
        }

        if (modelviews[i].getAttributeNode('status') == undefined) {
            modelview.status = 'undefined';
        } else {
            modelview.status = modelviews[i].getAttributeNode('status').nodeValue;
        }

        //解析modelview的子节点，Definition,ExchangeRequirements,Roots
        var childs = modelviews[i].childNodes;

        for(var i= 0; i < childs.length; i++) {

            if(childs[i].nodeName == 'Definitions') {
                modelview.def = parseDefinitions(childs[i]);
            }
            if(childs[i].nodeName == 'ExchangeRequirements') {
                modelview.exr = parseExchangeRequirements(childs[i]);
            }
            if(childs[i].nodeName == 'Roots') {
                modelview.roots = parseRoots(childs[i]);
            }
        }



        console.log(JSON.stringify(modelview));
        //console.log(modelview.roots[0].def);



    }

}

/**
 * 解析Definitions标签
 * @param def 一个根节点为Definitions的dom Element
 * 返回一个list（这个list可能大多情况只有一个元素）,结构如下：
 * [
 * {
 * content:string
 * lang:string 默认是en
 * }
 * ]
 */
function parseDefinitions(def) {
    //根据文档，definitions包括一个definition的list

    var def_list = [];
    var defs = def.childNodes;

    //解析每一个definition, 现只支持解析body
    for(var i = 0; i < defs.length; i++) {
        var defcontent = defs[i].childNodes;

        var def = {};

        for(var j = 0; j < defcontent.length; j++) {
            if(defcontent[j].nodeName == 'Body') {

                //console.log(defcontent[j].childNodes[0]);
                if(defcontent[j].childNodes[0] == undefined)
                    def.content = "undefined";
                else
                    def.content = defcontent[j].childNodes[0].nodeValue;
                def.lang = 'en';
                if(defcontent[j].hasAttribute('lang'))
                    def.lang = defcontent[j].getAttributeNode('lang').nodeValue;

            }

        }

        def_list.push(def);
    }

    return def_list;


}

/**
 * 解析ExchangeRequirements标签
 *
 * @param exrs 一个根节点为ExchangeRequirements的dom element
 * @returns {Array} 返回一个array，结构如下：
 * [
 *{
 * uuid:string
 * name:string
 * applicability:string
 * code:string
 * def:Array
 * }
 * ]
 */
function parseExchangeRequirements(exrs) {

    var require_list = [];

    var exrms = exrs.childNodes;
    //对于每一条exchangerequirement
    for(var i = 0; i < exrms.length; i++) {
        var exrm = exrms[i];

        var require = {};
        //解析属性,支持uuid, name, applicability, code
        require.uuid = exrm.getAttributeNode('uuid').nodeValue;
        require.name = exrm.getAttributeNode('name').nodeValue;

        if(exrm.hasAttribute('applicability')) {
            require.applicability = exrm.getAttributeNode('applicability').nodeValue;
        } else {
            require.applicability = 'undefined';
        }

        if(exrm.hasAttribute('code')) {
            require.code = exrm.getAttributeNode('code').nodeValue;
        } else {
            require.code = 'undefined';
        }

        var child = exrm.childNodes;

        for(var j = 0; j < child.length; j++) {
            if(child[j].nodeName == 'Definitions')
                require.def = parseDefinitions(child[j]);
        }

        require_list.push(require);


    }
    return require_list;
}

function parseRoots(roots) {
    var root_list = [];

    var conceptroots = roots.childNodes;
    //对于每一条ConceptRoot
    for(var i = 0; i < conceptroots.length; i++) {
        var conceptroot = conceptroots[i];

        var root = {};

        //解析conceptroot的属性，支持name, uuid, applicableRootEntity
        root.name = conceptroot.getAttributeNode('name').nodeValue;
        root.uuid = conceptroot.getAttributeNode('uuid').nodeValue;
        root.applicableRootEntity = conceptroot.getAttributeNode('applicableRootEntity').nodeValue;

        var childs = conceptroot.childNodes;

        for(var j = 0; j < childs.length; j++) {
            if(childs[j].nodeName == 'Definitions')
                root.def = parseDefinitions(childs[j]);
            if(childs[j].nodeName == 'Applicability')
                root.applicability = parseApplicability(childs[j]);
            if(childs[j].nodeName == 'Concepts')
                root.concepts = parseConcepts(childs[j]);
        }

        root_list.push(root);


    }
    return root_list;
}

/**
 *
 * @param app 传入一个根节点是Applicability的dom
 * @returns {Object} 内容如下
 * {
 * ref:uuid string
 * rules:object
 * }
 */
function parseApplicability(app) {
    var app_store = {};
    var childs = app.childNodes;

    //applicability中包含Template和TemplateRules
    for(var i = 0; i < childs.length; i++) {
        if(childs[i].nodeName == 'Template') {

            app_store.ref = childs[i].getAttributeNode('ref').nodeValue;
        }

        if(childs[i].nodeName == 'TemplateRules') {
            app_store.rules = parseTemplateRules(childs[i]);
        }
    }

    return app_store;
}

function parseTemplateRules(rules) {
    var rules_store = {};

    rules_store.op = rules.getAttributeNode('operator').nodeValue;

    var allrules = rules.childNodes;
    var rule_list = [];

    for(var i = 0; i < allrules.length; i++) {
        if(allrules[i].nodeName == 'TemplateRules')
            rule_list.push(parseTemplateRules(allrules[i]));
        if(allrules[i].nodeName == 'TemplateRule')
            rule_list.push({parameters: allrules[i].getAttributeNode('Parameters').value})
    }

    rules_store.rules = rule_list;

    return rules_store;
}

/**
 *
 * @param concepts 根节点是concepts的dom
 * @returns {Array}
 * [
 * {
 * uuid:string
 * name:string
 * def:[]
 * req:[]
 * rules:[]
 * }
 * ]
 */
function parseConcepts(concepts) {
    var concept_list = [];

    var cons = concepts.childNodes;

    //对于每一个concept
    for(var i = 0; i < cons.length; i++) {
        var concept = {};
        concept.uuid = cons[i].getAttributeNode('uuid').nodeValue;
        concept.name = cons[i].getAttributeNode('name').nodeValue;

        var childs = cons[i].childNodes;

        for(var j = 0; j < childs.length; j++) {
            if(childs[j].nodeName == "Definitions")
                concept.def = parseDefinitions(childs[j]);
            if(childs[j].nodeName == 'Requirements')
                concept.req = parseRequirements(childs[j]);
            if(childs[j].nodeName == 'TemplateRules')
                concept.rules = parseTemplateRules(childs[j]);
        }
        concept_list.push(concept);
    }

    return concept_list;

}

/**
 *
 * @param requires 一个根节点是Requirements的dom
 * @returns {Array} an array
 * [
 * {
 * applicability:string
 * exchange:string
 * requirement:string,uuid
 * }
 * ]
 */
function parseRequirements(requires) {
    var require_list = [];

    for(var i = 0; i < requires.childNodes.length; i++) {
        var child = requires.childNodes[i];
        var require = {};
        require.applicability = child.getAttributeNode('applicability').nodeValue;
        require.exchange = child.getAttributeNode('exchangeRequirement').nodeValue;
        require.requirement = child.getAttributeNode('requirement').nodeValue;
        require_list.push(require);
    }

    return require_list;
}