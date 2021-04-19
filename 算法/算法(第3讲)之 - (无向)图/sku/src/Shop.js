// import Adjoin from './Matrix'
import Adjoin from './Graph'

export default class Shop extends Adjoin {
  constructor(commoditySpecs, data) {
    // [ '红色', '紫色', '白色', '黑色', '套餐一', '套餐二', '套餐三', '套餐四', '64G', '128G', '256G' ]
    super(commoditySpecs.reduce((total, current) => [
      ...total,
      ...current.list,
    ], []));

    this.commoditySpecs = commoditySpecs;
    this.data = data;

    // 单规格矩阵创建
    this.initCommodity();
    // 同类顶点创建
    this.initSimilar();
  }

  initCommodity() {
    this.data.forEach((item) => {
      this.applyCommodity(item.specs);
    });
  }

  applyCommodity(arr) {
    arr.forEach((item) => {
      this.addPoints(item, arr);
    });
  }

  initSimilar() {
    // 获得所有可选项
    const specsOption = this.getCollect(this.points);

    this.commoditySpecs.forEach((item) => {
      const arr = [];
      item.list.forEach((value) => {
        if (specsOption.indexOf(value) > -1) arr.push(value);
      });
      // 同级点位创建
      this.applyCommodity(arr);
    });
  }

  querySpecsOptions(arr) {
    // 判断是否存在选中项
    if (arr.some(Boolean)) {
      // 过滤一下选项
      arr = this.getUnions(arr.filter(Boolean));
    } else {
      // 没有选中的, 获得所有可选项
      arr = this.getCollect(this.points);
    }
    return arr;
  }
}