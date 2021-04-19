import Graph from './Graph'

class DfsGraph extends Graph {
  visited = new Set() // 标记是否访问过

  // 深度优先遍历, 参考: https://www.bilibili.com/video/BV1ti4y1L73C?p=49
  // isVisitedNeedInit: 可选, this.visited是否需要清空数据, 外部调用都应该清空
  dfs(id, isVisitedNeedClear = true) {
    if (isVisitedNeedClear) {
      this.visited.clear()
    }

    console.log('当前节点:', id)
    // 表示该节点已经搜索过
    this.visited.add(id)
    
    let index = this.points.findIndex(v => v === id)
    this.adjArray[index].forEach(item => {
      if (!this.visited.has(item)) {
        this.dfs(item, false)
      }
    })
  }

  // --------------------使用深度优先: 查找路径-----------------------
  // 参考: https://www.bilibili.com/video/BV1Qi4y177gB?p=30
  distance = {} // 记录dfsPath方法中传入的id点, 到其它每个点的距离
  lookBack = {} // 记录每个顶点的上一个点(或者叫回溯点)

  // 初始化/重置数据
  initDfsPath() {
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
  // 使用深度遍历, 获取顶点(id)的路径数据
  dfsPath(id, isVisitedNeedClear = true) {
    // 初始化或重置
    if (isVisitedNeedClear) {
      this.initDfsPath()
    }

    console.log('当前节点:', id)
    this.visited.add(id)
    
    let index = this.points.findIndex(v => v === id)
    this.adjArray[index].forEach(item => {
      if (!this.visited.has(item)) { // 探索到新顶点
        // 新顶点距离 = 上一级顶点(或者叫回溯点)距离 + 1
        this.distance[item] = this.distance[id] + 1
        // 添加新顶点的回溯点
        this.lookBack[item] = id

        this.dfsPath(item, false)
      }
    })

    return {
      distance: this.distance,
      lookBack: this.lookBack
    }
  }
  // 查找路径: 我们知道每个点的上一个点(或者叫回溯点), 那我们就可以从最后一个点往前找, 一直找到开始点
  lookupPath(from, to) {
    let path = [] // 存放路径点

    // 1. 获取开始顶点的路径信息
    let { lookBack } = this.dfsPath(from)

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
const demo = new DfsGraph(['v0', 'v1', 'v2', 'v3', 'v4'])

// 注册点
demo.addPoints('v0', ['v2', 'v3']);
demo.addPoints('v1', ['v3', 'v4']);
demo.addPoints('v2', ['v0', 'v3', 'v4']);
demo.addPoints('v3', ['v0', 'v1', 'v2']);
demo.addPoints('v4', ['v1', 'v2']);

console.log(demo.print())

// 深度遍历
// console.log(demo.dfs('v0'))
// console.log(demo.dfs('v3'))

// 查找路径
console.log(demo.dfsPath('v0'))
console.log(demo.lookupPath('v0', 'v4'))
