# OTLserver

回家记得看http://bl.ocks.org/mbostock/2706022

## 关于分类编码的数据库设计思考

1. 所有的内容条目会放在一个collection中，原则是保持精简，不放关系
2. 内容与内容之间的关系，根据每一种关系，分别设置关系表
    - 对于分类编码，我们可以找到的关系是：父子关系（属于关系，包含关系），等价关系；