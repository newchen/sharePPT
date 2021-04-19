
import React, { Component, useEffect, useState } from 'react';

// 实现createFetcher
var NO_RESULT = {};

export const createFetcher = (task) => {
  let result = NO_RESULT;

  return (params) => {
    const p = task(params);

    p.then(res => {
      result = res;
    });


    if (result === NO_RESULT) {
      throw p;
    }

    return result;
  }
}

// 实现Suspense
class Suspense extends Component {
  state = {
    pending: false
  }

  componentDidCatch(error, info) {
    // 判断Promise类型
    if (typeof error.then === 'function') {
      this.setState({pending: true});

      error.then(() => this.setState({
        pending: false
      }));
    }
  }

  render() {
    const { fallback, children } = this.props

    return (
      <>
        { this.state.pending ? fallback: children }
      </>
    )
  }
}

// ------------------使用------------------
const getName = (id) =>  {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('我是返回的数据: ' + id);
    }, 2000);
  })
}

let fetcher = createFetcher(getName);

const Greeting = (props) => {
  //  ------------- 方式1 -------------
  // 下面2行代码只保证在v16.6版本之前能运行
  // 因为v16.6开始, componentDidCatch改为捕获commit阶段的异常, 抛出错误(throw p)需要移到componentDidMount中才行
  let name = fetcher(props.name)
  return <div>Hello {name}</div>

  //  ------------- 方式2 -------------
  // 下面代码只保证在^16.8版本运行, 因为v16.8才正式支持React Hooks
  // let [name, setName] = useState('')

  // useEffect(() => {
  //   setName(fetcher(props.name))
  // }, [])

  // return <div>Hello {name}</div>
};

export default function SuspenseDemo() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Greeting name="chb"/>
    </Suspense>
  );
};

