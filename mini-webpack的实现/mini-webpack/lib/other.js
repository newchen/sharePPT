import {
  AsyncSeriesHook, SyncHook, 
  AsyncSeriesHook, AsyncParallelHook,
  SyncBailHook 
} from 'Tapable'

// ps: Tapable其实就是使用了发布-订阅模式
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      afterCompile: new AsyncSeriesHook(["compilation"]),
      make: new AsyncParallelHook(["compilation"]),
      entryOption: new SyncBailHook(["context", "entry"]),
      // 定义了很多不同类型的钩子
    };
    // ...
  }
}

// ---------------------------------
const webpack = (options, callback) => {
  let compiler = new Compiler(options.context);
  // ...
}

// ---------------------------------
let compiler = webpack(options);

// ---------------------------------
if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
        plugin.apply(compiler);
    }
}


