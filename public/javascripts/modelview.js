var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1400 - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;



var svgs = [];
var roots = [];
var tests = [];

var tree = d3.layout.tree()
    .size([height, width]);

var target = viewlist[0].roots;

for(var i = 0; i < target.length; i++) {


    if(target[i].applicability !== undefined) {




        var viewref = target[i].applicability.ref;

        var targetref = null;

        for(var j = 0; j < conceptTemplates.length; j++) {
            if(conceptTemplates[j].uuid == viewref)
                targetref = conceptTemplates[j];
        }
        //
        targetref.name = target[i].applicableRootEntity;
        var id = '#app'+target[i].uuid+'1';

        var asvg = d3.select(id).append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svgs.push(asvg);
        roots.push(targetref);

        var test = {
            svg: asvg,
            root: targetref
        };

        tests.push(test);







        var id = '#app'+target[i].uuid+'2';
        console.log(id);
        var asvg = d3.select(id).append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var aroot = target[i].applicability.rules;

        aroot.x0 = height/2;
        aroot.y0 = 0;

        svgs.push(asvg);
        roots.push(aroot);

        var test = {
            svg: asvg,
            root: aroot
        };

        tests.push(test);


    }



    for(var j = 0; j < target[i].concepts.length; j++) {
        //console.log(i);
        var singleconcept = target[i].concepts[j];

        if(singleconcept.rules !== undefined) {
            var id = '#'+'a'+singleconcept.uuid;

            var asvg = d3.select(id).append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var aroot = singleconcept.rules;
            aroot.x0 = height/2;
            aroot.y0 = 0;

            svgs.push(asvg);
            roots.push(aroot);

            var test = {
                svg: asvg,
                root: aroot
            };

            tests.push(test);

            //update.call(test, aroot);
        }

    }
}



// console.log(svgs);
// console.log(roots);

// for(var i = 0; i < svgs.length; i++) {
//     update.call(tests[i], roots[i]);
// }



// var svg = d3.select("#app0").append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
// var svg2 = d3.select("#nav-graph2").append('svg')
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//
// root = {
//     name:"haha",
//     children:[{name:"nana"}, {name:"lolo"}]
// };
//
// root2 = {
//     name:'hoho',
//     children:[{name:"nana"}, {name:"lolo"}]
// };


// test1 = {
//     root : roots[0],
//     svg : svgs[0]
// };
//
// test2 = {
//     root : roots[1],
//     svg : svgs[1]
// };
//
// update.call(tests[0], roots[0]);
// update.call(tests[1], roots[1]);
// update.call(tests[2], roots[2]);

var command = "";

for(var i = 0; i < tests.length; i++) {
    command = command + 'update.call(tests['+i+'],roots['+i+']);'
}

eval(command);


