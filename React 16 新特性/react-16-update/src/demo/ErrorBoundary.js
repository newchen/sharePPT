import React, { Component } from 'react';

// 错误边界
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    // 更新state, 下次渲染的时候将显示错误触发的UI
    console.log('1111')
    return { error: error };
  }
  componentDidCatch(error, errorInfo) {
    // 能够捕获它下面的任何组件错误, 然后使用错误信息重新渲染
    console.log('2222', errorInfo)
    // 你可以在这里记录错误信息, 发送给后端服务器
  }
  
  render() {
    if (this.state.error) {
      // 错误UI
      return (
        <div>
          <h2>发生了错误.</h2>
            {this.state.error && this.state.error.toString()}
        </div>
      );
    }
    // 正常, 渲染子组件
    return this.props.children;
  }  
}

// 计数器
export class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.setState(({counter}) => ({
      counter: counter + 1
    }));
  }
  
  render() {
    if (this.state.counter === 5) {
      // 模拟一个JS错误
      throw new Error('我出错了!');
    }
    return <h1 onClick={this.handleClick}>{this.state.counter}</h1>;
  }
}

