import React, { Component } from 'react';

let style = {
  height: '100px',
  width :'200px',
  border: '1px solid #eee',
  overflow:'auto'
}

export default class ScrollingList extends Component {
  constructor(props) {
    super(props)
    this.listRef = React.createRef() // 取得dom节点
  }
  state = {
    list: []
  }
  addLi() {// 用于增加li
    this.setState( state => ({
      list: [`li: ${ state.list.length }`, ...state.list],
    }))
  }
  componentDidMount() {
    // // 初始化10条
    // for (let i = 0; i < 10; i++) {
    //   this.addLi();
    // }
    this.interval = window.setInterval(() => {
      if (this.state.list.length > 50) {// 大于50条，终止
        window.clearInterval(this.interval);
      } else {
        this.addLi();
      }
    }, 1000)
  }
  componentWillUnmount () { // 清除定时器
    window.clearInterval(this.interval);
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.list.length < this.state.list.length) {
      const list = this.listRef.current
      console.log('111', list.scrollHeight)
      return list.scrollHeight - list.scrollTop
    }
    return null
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // 根据 snapshot 计算得到偏移量，得到最终滚动位置
    if (snapshot !== null) {
      const list = this.listRef.current
      console.log('222', list.scrollHeight)
      list.scrollTop = list.scrollHeight - snapshot
    }
  }
  render() {
    return (
      <div ref={this.listRef} style={style}>
        { this.state.list.map(li => (
            <div key={li}>{ li } </div>
        ))}
      </div>
    )
  }
}

