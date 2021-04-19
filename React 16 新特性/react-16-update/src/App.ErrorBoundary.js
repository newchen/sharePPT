
import React, { Component } from 'react';
import { ErrorBoundary,  Counter } from './demo/ErrorBoundary.js'

export class Test  extends Component {
  render() {
    return <div>testetste{this.props.children}</div>
  }
}

function App() {
  return (
    <div>
      <p>
        <b>
          点击数字使之增加
          <br />
          当数字达到5的时候, 模拟了一个JS错误
        </b>
      </p>
      <hr />
      <ErrorBoundary>
        <p>这2个计数器在同一个错误边界里面, 如果其中一个发生了错误, 错误边界将把它们2个都替换</p>
        <Counter />
        <Counter />
      </ErrorBoundary>
      <hr />
      <p>这2个计数器分别在它们自己的错误边界里面, 所以如果其中一个发生了错误, 另一个不会受到影响</p>
      <ErrorBoundary><Counter /></ErrorBoundary>
      <ErrorBoundary><Counter /></ErrorBoundary>
    </div>
  );
}

export default App;