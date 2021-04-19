import React, { createContext, useContext } from 'react'

// 1. 使用 createContext 创建上下文
const UserContext = new createContext()

// 2. 创建 Provider
export class UserProvider extends React.Component {
  handleChangeUsername = (val) => {
    this.setState({ username: val })
  }
  state = {
    username: '',
    handleChangeUsername: this.handleChangeUsername
  }
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    ) 
  }
}

// 3. 创建 Consumer, 不使用 useContext：
const Pannel = () => (
  <UserContext.Consumer>
    {({ username, handleChangeUsername }) => (
      <div>
        <div>user: {username}</div>
        <input onChange={e => handleChangeUsername(e.target.value)} />
      </div>
    )}
  </UserContext.Consumer>
)

// 3. 创建 Consumer, 使用 useContext：
const Pannel2 = () => {
    const { username, handleChangeUsername } = useContext(UserContext)
    return (
      <div>
        <div>user: {username}</div>
        <input onChange={e => handleChangeUsername(e.target.value)} />
      </div>
    )
}

// 使用
const App = () => (
  <UserProvider>
    <Pannel />
    <Pannel2 />
  </UserProvider>
)
  
export default App;