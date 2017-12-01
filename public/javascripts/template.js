var conceptTemplates = templist;

var myMap = new Map();

for(var i = 0; i < conceptTemplates.length; i++) {
    myMap.set(conceptTemplates[i].uuid, conceptTemplates[i]);
}



function traversal(template) {
    //如果说到这一层有ref的话，从myMap中找到ref，挂在后面
    if(template.ref != undefined && template.ref != 'done') {
        var uuid = template.ref;
        var tempobj = myMap.get(uuid);



        template.children = tempobj.children;
        template.ref = 'done';
    }

    for(var i = 0; i < template.children.length; i++) {
        traversal(template.children[i]);
    }
}

var mySet = new Set();

/**
 * 遍历所有的第二层以及以后，把出现的实体都放在一个集合里
 * @param temp
 */
function trans(temp) {
    mySet.add(temp.name);
    for(var i = 0; i < temp.children.length; i++) {
        trans(temp.children[i]);
    }
}

for(var i = 0; i < conceptTemplates.length; i++) {
    traversal(conceptTemplates[i]);
    //console.log(JSON.stringify(conceptTemplates[i]));
}

for(var i = 0; i < conceptTemplates.length; i++) {
    var childs = conceptTemplates[i].children;
    for(var j = 0; j < childs.length; j++) {
        trans(childs[j]);
    }
}

var child = [];

for(var i = 0; i < conceptTemplates.length; i++) {
    if(!mySet.has(conceptTemplates[i].name))
        child.push(conceptTemplates[i]);

}

var all = {};
all.name = 'templates';
all.children = child;


/**
 * view的数据准备
 * @type {{top: number, right: number, bottom: number, left: number}}
 */
var viewroot = viewlist[0].roots[0];

var viewref = viewroot.applicability.ref;

var targetref = null;

for(var i = 0; i < conceptTemplates.length; i++) {
    if(conceptTemplates[i].uuid == viewref)
        targetref = conceptTemplates[i];
}

targetref.name = viewroot.applicableRootEntity;





// ************** Generate the tree diagram	 *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1400 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root, root2;

var tree = d3.layout.tree()
    .size([height, width]);

var tree2 = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#nav-graph").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var svg2 = d3.select('#view-graph').append('svg')
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


root = all;
root.x0 = height / 2;
root.y0 = 0;

root2 = targetref;
root2.x0 = height / 2;
root2.y0 = 0;

var test1 = {
    root: root,
    svg: svg
};

var test2 = {
    root: root2,
    svg: svg2
};

//update.apply(test1, root);
//update.apply(test2, root2);
update(root, svg, root);
update(root2, svg2, root2);



//d3.select(self.frameElement).style("height", "500px");

function update(source, svg, root) {

    // Compute the new tree layout.
    var nodes = tree.nodes(source).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 140; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? 5 : 13; })
        .attr('y', -18)
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6)
        .style("fill",function (d) {
            if(d.type == 'entity') return "slateblue";
            if(d.type == 'attribute') return "steelblue";
        });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) {
            if(d.type == 'entity') return "slateblue";
            if(d.type == 'attribute') return "steelblue";
            //return d._children ? "lightsteelblue" : "#fff";
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}