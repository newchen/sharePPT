import React, { Component } from 'react';

const ThemeContext = React.createContext();

const ThemeProvider = ThemeContext.Provider;
const ThemeConsumer = ThemeContext.Consumer;

// 包含了2个消费者组件: Subject, Paragraph
const Page = () => (
  <div>
    <Subject>这是标题</Subject>
    <Paragraph>这是正文</Paragraph>
  </div>
);

// Subject组件, 使用消费者
class Subject extends React.Component {
  render() {
    return (
      <ThemeConsumer>
        { // 应用了 render props 模式
          (theme) => (
            <h1 style={{color: theme.mainColor}}>
              {this.props.children}
            </h1>
          )
        }
      </ThemeConsumer>
    );
  }
}

// Paragraph组件, 使用消费者, 没有自己的状态, 没必要使用类, 用纯函数实现
const Paragraph = (props, context) => {
  return (
    <ThemeConsumer>
      {
        (theme) => (
          <p style={{color: theme.textColor}}>
            {props.children}
          </p>
          )
      }
    </ThemeConsumer>
  );
};

// ------------------------------------
// 主题
const defaultTheme = {
  mainColor: 'green',
  textColor: 'red',
};
const fooTheme = {
  mainColor: 'red',
  textColor: 'green',
}

export default class ContextTheme extends Component {
  state = {
    theme: defaultTheme
  }
  render() {
    return (
      <ThemeProvider value={this.state.theme} >
        <Page />

        <div>
          <button onClick={() => {
            this.setState(state => ({
              theme: state.theme === defaultTheme ? fooTheme : defaultTheme
            }))
          }}>
            切换主题
          </button>
        </div>
      </ThemeProvider>
    )
  }
}