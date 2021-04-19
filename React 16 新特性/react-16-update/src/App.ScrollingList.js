import React, { Component } from 'react';
import './App.css';

import ScrollingList from './demo/ScrollingList.js'

class App extends Component {
  render() {
    return (
      <div className="App" style={{padding: '100px'}}>
        <ScrollingList />
      </div>
    );
  }
}

export default App;
