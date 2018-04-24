// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('nav-graph'));

function generateLinks() {
    var links = [];
    //add all childs
    child.forEach(function(item) {
        var newlink = {};
        newlink.source = cur.name;
        newlink.target = item.name;
        newlink.value = "子类";
        links.push(newlink);
    });
    //add parent
    if(parent !== null) {
        console.log('haha');
        links.push({
            source:cur.name,
            target:parent.name,
            value:"父类",
        })
    }
    //add same
    same_list.forEach(function(item) {
        var newlink = {};
        newlink.source = cur.name;
        newlink.target = item.name;
        newlink.value = "等价类";
        links.push(newlink);
    });

    return links;
}

function generateData() {
    var nodes = [];
    cur.name = cur.scope+':'+cur.name;
    cur.value = cur.code;
    cur.draggable = true;
    cur.category = 0;
    nodes.push(cur);
    child.forEach(function(item) {
        item.name = item.scope+':'+item.name;
        item.draggable = true;
        item.value = item.code;
        item.category = 1;
        nodes.push(item);
    });
    if(parent !== null) {
        parent.draggable = true;
        parent.value = parent.code;
        parent.name = parent.scope+':'+parent.name;
        parent.category = 2;
        nodes.push(parent);
    }
    same_list.forEach(function(item) {
        item.name = item.scope+':'+item.name;
        item.draggable = true;
        item.value = item.code;
        item.category = 3;
        nodes.push(item);
    });
    return nodes;
}


var datas = generateData();
var links = generateLinks();

// 指定图表的配置项和数据
option = {
    title: {
        text: ''
    },
    tooltip: {
        formatter:'名称-{b}<br />编码-{c}'
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    label: {
        normal: {
            show: true,
            textStyle: {
                fontSize: 12
            },
        }
    },
    legend: {
        x: "center",
        show: false,
    },
    series: [

        {
            type: 'graph',
            layout: 'force',
            symbolSize: 45,
            focusNodeAdjacency: true,
            roam: true,
            categories: [{
                name: '自己',
                itemStyle: {
                    normal: {
                        color: "#009800",
                    }
                }
            }, {
                name: '父类',
                itemStyle: {
                    normal: {
                        color: "#4592FF",
                    }
                }
            }, {
                name: '子类',
                itemStyle: {
                    normal: {
                        color: "#9900cc",
                    }
                }
            }, {
                name: '等价类',
                itemStyle: {
                    normal: {
                        color: "#FF9B4F",
                    }
                }
            }],
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 12,
                        color: "#000"
                    },
                }
            },
            force: {
                repulsion: 1500,
                edgeLength: 80
            },
            edgeSymbolSize: [4, 50],
            edgeLabel: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 10
                    },
                    formatter: "{c}"
                }
            },
            data: datas,
            links: links,
            lineStyle: {
                normal: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0
                }
            }
        }
    ]
};

myChart.setOption(option);