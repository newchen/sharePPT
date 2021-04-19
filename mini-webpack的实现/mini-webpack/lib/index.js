const fs = require('fs');
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

// ---------------------依赖关系解析-------------------------
let ID = 0

function createAsset(filename) {
  // 读取文件内容
	const content = fs.readFileSync(filename, 'utf8');
  
  // 转化成AST
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });

  // 该文件的所有依赖
  const dependencies = []

  // 获取依赖声明
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    }
  })

  // 转化ES6语法到ES5
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  })

  // 分配ID
  const id = ID++

  // 返回这个模块
  return {
    id,
    filename,
    dependencies,
    code,
  }
}

// ---------------------建立依赖关系图集-------------------------
function createGragh (entry) {
  // 解析传入的文件为模块
  const mainAsset = createAsset(entry)
  
  // 维护一个数组，传入第一个模块
  const queue = [mainAsset]

  // 遍历数组，分析每一个模块是否还有其它依赖，若有则把依赖模块推进数组
  for (const asset of queue) {
    asset.mapping = {}
    // 由于依赖的路径是相对于当前模块，所以要把相对路径都处理为绝对路径
    const dirname = path.dirname(asset.filename)
    // 遍历当前模块的依赖项并继续分析
    asset.dependencies.forEach(relativePath => {
      // 构造绝对路径
      const absolutePath = path.join(dirname, relativePath)
      // 生成依赖模块
      const child = createAsset(absolutePath)
      // 把依赖关系写入模块的mapping当中
      asset.mapping[relativePath] = child.id
      // 把这个依赖模块也推入到queue数组中，以便继续对其进行以来分析
      queue.push(child)
    })
  }

  // 最后返回这个queue，也就是依赖关系图集
  return queue
}

// ---------------------打包-------------------------
function bundle (graph) {
  let modules = ''

  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)},
    ],`
  })

  const result = `
    (function(modules) {
      function require(id) {
        var fn = modules[id][0];
        var mapping = modules[id][1];

        function localRequire(name) {
          return require(mapping[name]);
        }

        var module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `
  return result
}

// --------------------读取配置--------------------------
let { mkdirSync, getAbsPath } = require('./utils.js')

let webpackConfig = require('../webpack.config')
let { 
  enrty, 
  output: { path: outputPath, filename } 
} = webpackConfig

let result = bundle(createGragh(getAbsPath(enrty)))
let fOutputPath = getAbsPath(outputPath)

mkdirSync(fOutputPath, () => {
  fs.writeFileSync(`${fOutputPath}/${filename}`, result)
})
