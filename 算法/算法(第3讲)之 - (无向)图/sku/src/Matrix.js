// 邻接矩阵实现
export default class Matrix {
  constructor(points) {
    this.points = points;
    this.quantity = points.length;
    this.adjArray = Array.from({ length: this.quantity * this.quantity });
  }
  // 获取id所在列的数据
  getColumn(id) {
    const index = this.points.indexOf(id);
    const len = this.adjArray.length;
    let arr = []

    for(let i = index; i < len; i += this.quantity) {
      arr.push(this.adjArray[i])
    }

    return arr;
  }
  // 返回列对应项相加的数组
  getTotal(arr) { 
    arr = arr.map(id => this.getColumn(id));
    const adjoinArr = [];

    // 列数据的每行相加
    for(let i = 0; i < this.quantity; i++) {
      const columnTotal = arr.map(value => value[i]).reduce((total, current) => {
        total += current || 0;
        return total;
      }, 0);
      adjoinArr.push(columnTotal);
    }

    return adjoinArr;
  }
  // 打印格式化数据
  print() {
    let arr = Array.from({ length: this.quantity }, () => [])

    this.adjArray.forEach((item, i) => {
      let row = Math.floor(i / this.quantity)
      let index = i - row  * this.quantity 
      arr[row][index] = item
    })

    return arr;
  }
  // ----------------------------------

  // 通过id所在列的数据, 过滤并获取对应的元素(即连接的点)
  getPoints(id) {
    return this.getColumn(id)
      .map((item, index) => (item ? this.points[index] : ''))
      .filter(Boolean);
  }
  // 列方式初始化
  addPoints(id, points) {
    const pIndex = this.points.indexOf(id);
    points.forEach((item) => {
      const index = this.points.indexOf(item);
      // pIndex + index * this.quantity  当前位置 + 行数 * 每行数量
      this.adjArray[pIndex + index * this.quantity] = 1; 
    });
  }
  // 交集
  getUnions(arr) {
    const column = this.getTotal(arr);
    return column.map((item, index) => item >= arr.length && this.points[index]).filter(Boolean);
  }

  // 并集
  getCollect(arr) {
    arr = this.getTotal(arr);
    return arr.map((item, index) => item && this.points[index]).filter(Boolean);
  }
}

// -------------------------------------------
// 创建矩阵
const demo = new Matrix(['v0', 'v1', 'v2', 'v3', 'v4'])

// 注册邻接点
demo.addPoints('v0', ['v2', 'v3']);
demo.addPoints('v1', ['v3', 'v4']);
demo.addPoints('v2', ['v0', 'v3', 'v4']);
demo.addPoints('v3', ['v0', 'v1', 'v2']);
demo.addPoints('v4', ['v1', 'v2']);

// 打印
console.log(demo.print())

/**
[
  [undefined, undefined, 1, 1, undefined]
  [undefined, undefined, undefined, 1, 1]
  [1, undefined, undefined, 1, 1]
  [1, 1, 1, undefined, undefined]
  [undefined, 1, 1, undefined, undefined]
]
 */