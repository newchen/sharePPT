import React, { Component } from 'react';
import './App.css';

import Lifecycles from './demo/Lifecycles.js'

class App extends Component {
  state = {
    life: 0
  }
  updateLife() {
    this.setState({
      life: this.state.life + 1
    })
  }
  render() {

    return (
      <div className="App" style={{padding: '100px'}}>
        <div 
          onClick={this.updateLife.bind(this)}  
          style={{padding: '20px', border: '1px solid red'}}
        >点击: 父组件改变props</div>

        <Lifecycles life={ this.state.life }/>
      </div>
    );
  }
}

export default App;
