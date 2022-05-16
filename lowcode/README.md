## 是什么?

低代码 <span style="color: red;">引擎</span>

基于 Low-Code Engine 快速打造高生产力的低代码研发平台



## 能干什么(适用场景)?

1. 官网活动页等静态页面
2. 简单的增删改查需求
3. 图表可视化

前提: 有对应的组件

要求: 看场景:

​	 可以对组件做一些高度封装, 暴露给产品和运营

​     底层和基础组件, 开发负责



效率: 对于开发来说, 不一定会更快...



## 怎么干的?

### 协议

https://lowcode-engine.cn/lowcode



### 引擎包

引擎主包: @alilc/lowcode-engine

扩展的主包: @alilc/lowcode-engine-ext ??

react渲染模块: [@alifd/lowcode-react-renderer](https://github.com/alibaba/lowcode-engine/tree/main/packages/react-renderer)

出码模块: @alilc/lowcode-plugin-code-generator

@alilc/lowcode-designer ??

@alilc/lowcode-editor-skeleton ??

@alilc/lowcode-editor-core ?? 



### 初始化

```
git clone https://github.com/alibaba/lowcode-demo.git
```




## 如何接入项目

开发 `页面管理` 插件



## 如何接入区块

开发 `区块管理` 插件




## 如何接入 组件/模板 库

1. 初始化

```
npm init @alilc/element 你的`组件/模板`名称
```

2. 配置 build.lowcode.js 文件中的 @alifd/build-plugin-lowcode 插件

```
plugins: [
  [
    '@alifd/build-plugin-lowcode',
    {
      engineScope: "@alilc",
      baseUrl: {
        prod: `http://chuanbin.f3322.net:8023/${package.name}@${package.version}`, // 这里, unpkg等cdn地址
      }
    },
  ],
],

```

3. 配置 .npmrc
```
@chb:registry=http://chuanbin.f3322.net:4873/
```

3. 开发调试
```
yarn lowcode:dev
```

4. 构建低代码产物
```
npm run lowcode:build
```

5. 发布
```
npm publish
```
会在 build 文件夹内生成一个 `assets-prod.json` 文件(查看cdn(unpkg)中资源是否存在)

6. 合并内容

  把`assets-prod.json`内容合并到远程的 assets.json 中去



## 基于此引擎需要完善的

1. 同步到远程
2. 预览
3. 修改的历史记录
4. 页面管理功能
5. 区块管理功能
6. 如何使自定义组件方便接入
7. 如何快速部署
7. ...



## 目前的问题: 
  1. 暂不支持任意拖拽布局
  1. 有蛮多的小bug
  1. 对antd支持不太好
  1. 虽然有`出码插件`, 但是这个代码的维护性还是不太好
  1. 开源不久, 社区还不强大, 有些坑还不清楚




## 表单数据回显

0. 拖拽生成UI页面, 设置表单字段名称

1. 写后端接口

2. 配置数据源面板

3. 将表单值和数据源关联

   


## 说明

### 组件库
 1. meta.design.ts 是干什么的?
    比如给产品用, 在url加上`?metaType=design`, 也就是说可以面向不同的用户提供不同的能力



schema.json
  componentsTree // 渲染页面的数据

assets.json // 资产包协议
  // packages // 组件资源, 组件的资源以及组件依赖的资源, 会提前加载好, 可以通过`window.`访问
  // components // 组件的描述, 组件描述协议, 设置器, 比如这个组件有哪些属性, 可以怎么设置

  packages 对象：我们需要在其中定义这个包的获取方式，如果不定义，就不会被低代码引擎动态加载并对应上组件实例。定义方式是 UMD 的包，低代码引擎会尝试在 window 上寻找对应 library 的实例；
  components 对象：我们需要在其中定义物料描述  