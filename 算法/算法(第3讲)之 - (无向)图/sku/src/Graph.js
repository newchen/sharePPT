// 领接表实现
export default class Graph {
  constructor(points) {
    // 点
    this.points = points
    // 边的数量
    this.sideNum = 0;
    // 每个点都对应一个链表/数组
    this.adjArray = Array.from({ length: points.length }, () => [])
  }
  addPoint(id, point) {
    let index1 = this.points.findIndex(v => v === id)
    this.adjArray[index1].push(point)

    /* 
      对于无向图, 假设A和B相连:
        如果你只想添加1次A和B(A-B或B-A)的相连关系, 就需要下面语句, 
        但是如果你添加了2次(A-B和B-A)相连关系, 就不需要下面语句了
    */
    // let index2 = this.points.findIndex(v => v === point)
    // this.adjArray[index2].push(id) 

    this.sideNum++
  }
  addPoints(id, points) {
    points.forEach(item => {
      this.addPoint(id, item)
    })
  }

  getPoints(id) {
    let index = this.points.findIndex(v => v === id)
    return this.adjArray[index]
  }
  // 打印格式化数据
  print() {
    let str = ''

    this.points.forEach((item, index) => {
      str += item + ' ---> [' + this.adjArray[index].join(', ') + '] \n'
    })

    return str
  }
  getMap(points) {
    let arr = points.reduce((arr, item) => {
      return arr.concat(this.getPoints(item))
    }, [])

    return arr.reduce((map, item) => {
      if (!map[item]) {
        map[item] = 1
      } else {
        map[item]++
      }
      return map
    }, {})
  }
  // 交集
  getUnions(points) {
    let map = this.getMap(points)
    let len = points.length

    return Object.keys(map).filter(key => map[key] >= len)
  }
  // 并集
  getCollect(points) {
    let map = this.getMap(points)
    return Object.keys(map).filter(key => map[key])
  }
}

// -------------------------------------------

const demo = new Graph(['v0', 'v1', 'v2', 'v3', 'v4'])

// 注册点
demo.addPoints('v0', ['v2', 'v3']);
demo.addPoints('v1', ['v3', 'v4']);
demo.addPoints('v2', ['v0', 'v3', 'v4']);
demo.addPoints('v3', ['v0', 'v1', 'v2']);
demo.addPoints('v4', ['v1', 'v2']);

// -----------------------------------
// console.log(demo.getPoints('v0'))
// console.log(demo.getPoints('v1'))
// console.log(demo.getPoints('v2'))
// console.log(demo.getPoints('v3'))
// console.log(demo.getPoints('v4'))

console.log(demo.print())

