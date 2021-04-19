import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const data = [
  { id: '1', specs: [ '紫色', '套餐一', '64G' ] },
  { id: '2', specs: [ '紫色', '套餐一', '128G' ] },
  { id: '3', specs: [ '紫色', '套餐二', '128G' ] },
  { id: '4', specs: [ '黑色', '套餐三', '256G' ] },
];
const commoditySpecs = [
  { title: '颜色', list: [ '红色', '紫色', '白色', '黑色' ] },
  { title: '套餐', list: [ '套餐一', '套餐二', '套餐三', '套餐四' ]},
  { title: '内存', list: [ '64G', '128G', '256G' ] }
];

ReactDOM.render(<App data={data} commoditySpecs={commoditySpecs}/>, document.getElementById('root'));

// ----------------------
// import './Graph'

// ----------------------深度优先遍历-------------------------------
// import './dfs'

// ----------------------广度优先遍历-------------------------------
// import './bfs'