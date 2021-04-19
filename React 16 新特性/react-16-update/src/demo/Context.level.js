// Context 层级嵌套

import React, { Component } from 'react';

const LevelContext = React.createContext();

const LevelProvider = LevelContext.Provider;
const LevelConsumer = LevelContext.Consumer;

export default (props) => {
  return (
    <Parent>
      <Child2><Grandchild /></Child2>
      <Child1 />
      
    </Parent>
  )
}

class Parent extends Component {
  render() {
    return (
      <LevelProvider value={{ name: '1', age: '2' }}>
        {this.props.children}
      </LevelProvider>
    )
  }
}

const Child1 = (props) => {
  return (
    <LevelConsumer>
      {
        (obj) => {
          console.log('child1: ', obj)

          return <p>Child1 name: {obj.name}, age: {obj.age}</p>
        }
      }
    </LevelConsumer>
  )
}

const Child2 = (props) => {
  return (
    <LevelConsumer>
      {
        (obj) => {
          console.log('child2: ', obj)

          return (
            <LevelProvider value={{name: '11', age: '22'}}>{props.children}</LevelProvider>
          )
        }
      }
    </LevelConsumer>
  )
}

const Grandchild = (props) => {
  return (
    <LevelConsumer>
      {
        (obj) => {
          console.log('Grandchild: ', obj)

          return <p>Grandchild name: {obj.name}, age: {obj.age}</p>
        }
      }
    </LevelConsumer>
  )
}
