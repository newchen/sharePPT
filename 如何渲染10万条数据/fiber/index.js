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
// -------------------------------------------

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
    const node = new Node(current);
    node.return = parent;
    node.sibling = previous;
    return node;
  }, null);

  return parent.child;
}

function doWork(node, callback) {
  callback && callback(node)

  const children = node.instance.render();
  return link(node, children);
}


function walk(o, root, callback) {
  if (!o) return;
  // let root = o;
  let current = o;

  while (true) {
    // 为当前的 node 执行一些工作，并将它与其孩子节点连接起来，并返回第一个孩子节点引用
    let child = doWork(current, callback);

    // 如果孩子节点存在，则将它设置为接下来 被 doWork 方法处理的 node
    if (child) {
      current = child;
      // continue;
      return current;
    }

    // 如果已经返回到更节点说明遍历完成，则直接退出
    if (current === root) {
      return;
    }

    // 当前节点的兄弟节点不存在的时候，返回到父节点，继续寻找父节点的兄弟节点，以此类推
    while (!current.sibling) {

      // 如果已经返回到更节点说明遍历完成，则直接退出
      if (!current.return || current.return === root) {
        return;
      }

      // current 指向父节点
      current = current.return;
    }

    // current 指向兄弟节点
    current = current.sibling;
  }

  return current;
}

// -------------------------------------------------
// walk(new Node(a1))

let root = new Node(a1)
let nextComponent = root


function wait(delay) {
  const end = performance.now() + Number(delay);
  while (performance.now() <= end) {}
}

let btn = document.querySelector('#btn')
btn.onclick = function() {
  requestIdleCallback((deadline) => {
    // while we have time, perform work for a part of the components tree
    while (deadline.timeRemaining() > 0 && nextComponent) {
      console.log('nextComponent:',nextComponent)
      nextComponent = walk(nextComponent, root, callback)
    }
  });
}

