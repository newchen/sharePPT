const a1 = {name: 'a1'};
const b1 = {name: 'b1'};
const b2 = {name: 'b2'};
const b3 = {name: 'b3'};
const c1 = {name: 'c1'};
const c2 = {name: 'c2'};
const d1 = {name: 'd1'};
const d2 = {name: 'd2'};

a1.render = () => [b1, b2, b3];
b1.render = () => [];
b2.render = () => [c1];
b3.render = () => [c2];
c1.render = () => [d1, d2];
c2.render = () => [];
d1.render = () => [];
d2.render = () => [];

// -------------------------------------
class Node {
  constructor(instance) {
    this.instance = instance;
    this.child = null;
    this.sibling = null;
    this.return = null;
  }
}

function link(parent, elements) {
  if (elements === null) elements = [];

  parent.child = elements.reduceRight((previous, current) => {
    const node = new Node(current);//node(3)
    node.return = parent;
    node.sibling = previous;
    return node;
  }, null);

  return parent.child;
}

function doWork(node) {
  console.log('假设是创建dom节点等操作:', node.instance.name);
  const children = node.instance.render();
  return link(node, children);
}

// -------------------------------------------
let root = new Node(a1)
let nextComponent = doWork(root)
console.log('nextComponent:', nextComponent)





