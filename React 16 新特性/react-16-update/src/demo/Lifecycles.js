
import React, { Component } from 'react';

export default class Lifecycles extends Component {
  state = {
    life: 0,
    a: 'a'
  }
  // 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state.
  // 静态方法: 1. 无法通过 ref 访问到 DOM 对象;  2. 无法访问到this
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps')
    return null; //{ a: 'aaa' };
  }
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    console.log('constructor')
  }
  // componentWillMount() {
  // 	console.log('componentWillMount')
  // }
  componentDidMount() {
    console.log('componentDidMount')
  }
  // componentWillReceiveProps() {
  // 	console.log('componentWillReceiveProps')
  // }
  shouldComponentUpdate() {
    console.log('shouldComponentUpdate')
    return true;
  }
  // componentWillUpdate(nextProps, nextState) {
  // 	console.log('componentWillUpdate')
  // }
  handleClick() {
    this.setState({
      life: this.state.life + 1
    })
  }
  render() {
    console.log('render', this.state);

    return (
      <div 
        onClick={this.handleClick} 
        style={{padding: '20px', border: '1px solid green'}}
      >点击: 本身调用setState</div>
    )
  }
  // 返回一个值，作为componentDidUpdate的第三个参数
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate')
    return 'aaaaa'
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate', 'getSnapshotBeforeUpdate返回的值: ' + snapshot)
  }
  
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }
  // 错误捕获
  componentDidCatch(error, info) {
    console.log('componentDidCatch')
  }
}