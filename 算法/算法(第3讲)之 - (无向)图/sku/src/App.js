import React, { useState, useMemo } from 'react';
import Shop from './Shop'
import classnames from 'classnames'
import './App.css'

export default function App({ data, commoditySpecs }) {
  // specsS 存储选中项, 每种类别只能选一项, 所以取commoditySpecs的长度
  const [specsS, setSpecsS] = useState(Array.from({ length: commoditySpecs.length }));
  
  // 创建一个购物矩阵/表
  const shop = useMemo(() => new Shop(commoditySpecs, data), [
    commoditySpecs,
    data,
  ]);

  // 获得可选项表
  const optionSpecs = shop.querySpecsOptions(specsS);

  const handleClick = function (bool, text, index) {
    if (!bool) return; // 不可选, 返回
    // 是选中还是取消选中
    specsS[index] = specsS[index] === text ? '' : text;
    setSpecsS([...specsS]); // 更新视图
  };

  return (
    <div className="container">
      {
        commoditySpecs.map(({ title, list }, index) => (
          <div key={index} className="wrap">
            <h1>{title}</h1>
            <div className="box">
              {
                list.map((value, i) => (
                  <span
                    key={i}
                    className={classnames({
                      option: optionSpecs.indexOf(value) > -1, // 是否可选
                      active: specsS.indexOf(value) > -1, // 是否选中
                    })}
                    onClick={() => handleClick(optionSpecs.indexOf(value) > -1, value, index)}
                  >{value}
                  </span>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}
