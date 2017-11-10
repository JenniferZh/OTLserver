var links = [];

//add cur and it parent
var parent_list = cur.parents;
for(var i = 0; i < parent_list.length; i++) {
    links.push({source: parent_list[i], target: cur.name, type:"1"});
}

var child_list = cur.child;
for(var i = 0; i < child_list.length; i++) {
    links.push({source: cur.name, target: child_list[i], type:'2'});
}

for(var i = 0; i < child.length; i++) {
    this_item = child[i];
    this_item_child = this_item.child;
    for(var j = 0; j < this_item_child.length; j++) {
        links.push({source: this_item.name, target: this_item_child[j], type:'3'});
    }
}

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(110)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("#nav-graph").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .call(force.drag);

node.append("circle")
    .attr("r", 8);

node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

function tick() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover() {
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 16);
}

function mouseout() {
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 8);
}
