import Graph from './Graph'

class BfsGraph extends Graph {
  visited = new Set() // 标记是否访问过

  // 广度优先遍历, 参考: https://www.bilibili.com/video/BV1ti4y1L73C?p=49
  // 先看有问题的
  bfs(id) {
    // 清空
    this.visited.clear()

    // 1. 新建一个队列, 把根节点入队
    let queue = [id]

    // 4. 不断重复第2, 3步, 直到队列为空
    while(queue.length > 0) {
      // 2. 队头出队并访问
      let node = queue.shift()
      console.log('当前节点: ', node);

      /* 
      ps: 该语句在此处是有问题的, 
        因为有些节点在队列queue里面, 但是还没访问过
        这样的话, 下面的forEach语句中, this.visited.has过滤时就会漏掉已经在queue里面, 但不在this.visited里面的元素
        导致队列queue里面出现重复的元素
      */
      this.visited.add(node)

      // 3. 把队头的 '没访问过的相邻节点' 入队
      let index = this.points.findIndex(v => v === node)
      let links = this.adjArray[index]
      links.forEach(v => {
        if (!this.visited.has(v)) {
          queue.push(v)
        }
      })
    }
  }

  bfs2(id) {
    // 先清空
    this.visited.clear()

    let queue = [id]
    this.visited.add(id) // 把起始节点加入this.visited

    while(queue.length > 0) {
      let node = queue.shift()

      console.log('当前节点: ', node);
     
      // this.visited.add(node)

      let index = this.points.findIndex(v => v === node)
      let links = this.adjArray[index]
      links.forEach(v => {
        if (!this.visited.has(v)) {
          queue.push(v)
          // 一旦入对列(queue)了, 就认为访问过了, 这样可以防止队列queue出现重复的元素
          this.visited.add(v)
        }
      })
    }
  }

  // --------------------使用广度优先: 查找路径-----------------------
  // 参考: https://www.bilibili.com/video/BV1Qi4y177gB?p=30
  distance = {} // 记录bfsPath方法中传入的id点, 到其它每个点的距离
  lookBack = {} // 记录每个顶点的上一个点(或者叫回溯点)

  // 初始化/重置数据
  initBfsPath() {
    // 清空访问过的顶点
    this.visited.clear()

    // 初始化/重置: 每个顶点的初始距离(0)
    this.distance = this.points.reduce((obj, v) => {
      obj[v] = 0
      return obj
    }, {})

    // 初始化/重置: 每个顶点的回溯点(null)
    this.lookBack = this.points.reduce((obj, v) => {
      obj[v] = null
      return obj
    }, {})
  }
  // 使用广度遍历, 获取顶点(id)的路径数据
  bfsPath(id) {
    this.initBfsPath()

    let queue = [id]
    this.visited.add(id) 

    while(queue.length > 0) {
      let node = queue.shift()

      console.log('当前节点: ', node);
     
      let index = this.points.findIndex(v => v === node)
      let links = this.adjArray[index]
      links.forEach(v => {
        if (!this.visited.has(v)) { // 探索到新顶点
          // 新顶点距离 = 上一级顶点(或者叫回溯点)距离 + 1
          this.distance[v] = this.distance[node] + 1
          // 添加新顶点的回溯点
          this.lookBack[v] = node

          queue.push(v)
          this.visited.add(v)
        }
      })
    }

    return {
      distance: this.distance,
      lookBack: this.lookBack
    }
  }
  // 查找路径: 我们知道每个点的上一个点(或者叫回溯点), 那我们就可以从最后一个点往前找, 一直找到开始点
  lookupPath(from, to) {
    let path = [] // 存放路径点

    // 1. 获取开始顶点的路径信息
    let { lookBack } = this.bfsPath(from)

    // 2. 从最后一个点往前找, 一直找到开始点
    let cur = to
    while (cur !== from) {
      path.unshift(cur)
      cur = lookBack[cur]
    }
    path.unshift(cur)

    return path
  }
}

// -----------------------------------
const demo = new BfsGraph(['v0', 'v1', 'v2', 'v3', 'v4'])

// 注册点
demo.addPoints('v0', ['v2', 'v3']);
demo.addPoints('v1', ['v3', 'v4']);
demo.addPoints('v2', ['v0', 'v3', 'v4']);
demo.addPoints('v3', ['v0', 'v1', 'v2']);
demo.addPoints('v4', ['v1', 'v2']);

console.log(demo.print())

// 广度遍历
// console.log(demo.bfs('v0'))
// console.log(demo.bfs2('v0'))

// 查找路径
console.log(demo.bfsPath('v0'))
console.log(demo.lookupPath('v0', 'v4'))
