import React, { 
  useState, 
  useEffect, 
  useReducer, 
  useCallback, 
  useRef,
  useLayoutEffect,

  Component, 
  PureComponent 
} from 'react';

// 1. State Hook
export function StateHookExample() {
  const [count, setCount] = useState(0);

  return (
    <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
      1. State Hook 例子: 
      <p>你点击了  <span>{count}</span> 次</p>
      <button onClick={() => setCount(count + 1)}> 点击 </button>
      <button onClick={() => setCount(count => count + 1)}> 点击(是一个函数) </button>
      <button onClick={() => {
        setCount(count + 1);
        setCount(count + 1);
      }}>              
        测试能否连加两次
      </button>
    </div>
  );
}

// -----------------------------------------
// 2. Effect Hook
export function EffectHookExample01() {
  // 声明一个名为“count”的新状态变量
  const [count, setCount] = useState(0);

  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // console.log('effect')
    // 使用浏览器API更新文档标题
    document.title = `${count}次`;
  }, []);

  return (
      <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
          2. Effect Hook 例子: 
          <p>你点击了 {count} 次</p>
          <button onClick={() => setCount(count + 1)}>点击</button>
      </div>
  );
}

export function EffectHookExample02() {
  const [width, setWidth] = useState(window.innerWidth);

  const setWidthFn = () => {
    setWidth(window.innerWidth);
  };

  // 作用类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
      // console.log('添加')
      window.addEventListener('resize',setWidthFn);
      // 返回的函数会在组件unmount时，以及后续渲染而重新运行effects之前取消订阅
      return () => {
        // console.log('取消')
        window.removeEventListener('resize',setWidthFn)
      }
  });

  /* 每次render的时候都会执行一遍这个函数，有的时候我们并不希望都去执行,可以给useEffect函数传递第二个参数
    当然，第二个参数可以传递进不只一个依赖项，这样就是告诉React多个依赖项有一个发生变化就会重新执行这个函数。
    也可以传递进一个空数组，这样是告诉React这个函数只执行一次。
    具体为什么要传递进去数组，官网文档上没有看到相关的解释。
  */
  // useEffect(() => {
  //   doSomethingWith(id)
  // },[id])


  return(
    <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
      <p>3. Effect Hook 例子: </p>
      <h4>当前窗口宽度{width}px</h4>
    </div>
  )
}

// -----------------------------------------
// 3. useReducer

// 模拟useReducer
function useCustomReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}

const initialState = {count: 0};

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            throw new Error();
    }
}

export function UseReducerExample() {
    // 使用 useReducer 函数创建状态 state 以及更新状态的 dispatch 函数
    const [state, dispatch] = useReducer(reducer, initialState);
    // const [state, dispatch] = useCustomReducer(reducer, initialState);
    
    return (
        <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
            <p>4. useReducer示例</p>
            Count: {state.count}
            <br />
            <button onClick={() => dispatch({type: 'increment'})}>+</button>
            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
            <button onClick={() => {
                dispatch({type: 'increment'});
                dispatch({type: 'increment'});
            }}>
              测试能否连加两次
            </button>
        </div>
    );
}

// -----------------------------------------
// 4. useCallback和useMemo

class ChildTest extends PureComponent {
  render() {
    // console.log('child render')
    return <button onClick={this.props.callback}>点击</button>
  }
}

export function UseCallbackExample() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count => count + 1)
    // setCount(count + 1) // 对比
  }, [])
  // const handleClick = () => setCount(count => count + 1)

  return (
    <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
      5. useCallback和useMemo示例: 
      <p>你点击了 {count} 次</p>
      <ChildTest callback={handleClick} />
    </div>
  );
}

// -----------------------------------------
// 5. useRef 
export function UseRefExample() {
    
  // 使用 useRef 创建 inputEl 
  const inputEl = useRef(null);

  const [text, updateText] = useState('');

  // 使用 useRef 创建 textRef 
  const textRef = useRef();

  useEffect(() => {
      // 将 text 值存入 textRef.current 中
      textRef.current = text;
      console.log('textRef.current：', textRef.current);
  });

  const onButtonClick = () => {
      // current属性指向input元素
      inputEl.current.value = "Hello, useRef";
  };

  return (
      <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
          6. useRef示例: <br/>
          {/* 保存 input 的 ref 到 inputEl */}
          <input ref={ inputEl } type="text" />
          <button onClick={ onButtonClick }>在 input 上展示文字</button>
          <br /><br />
          <input value={text} onChange={e => updateText(e.target.value)} />
      </div>
  );

}

// -----------------------------------------
// 6. useLayoutEffect 
const buttonStyles = {
  border: '1px solid #ccc',
  background: '#fff',
  fontSize: '2em',
  padding: 15,
  margin: 5,
  width: 200,
}
const labelStyles = {
  fontSize: '5em',
  display: 'block',
}

export function UseLayoutEffectExample() {
  // console.log('UseLayoutEffectExample');

  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  // useLayoutEffect(() => {
  useEffect(() => {
    console.log('useEffect')
    if (running) {
      const startTime = Date.now() - time
      const intervalId = setInterval(() => {
        setTime(Date.now() - startTime)
      }, 0)

      return () => clearInterval(intervalId)
    }
  },[running])

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
  })

  function handleRunClick() {
    setRunning(r => !r)
  }

  function handleClearClick() {
    setRunning(false)
    setTime(0)
  }
  
  return (
    <div style={{border: '1px solid #ccc', margin: '30px', padding: '20px'}}>
      7. useLayoutEffect示例: <br/>
      <label style={labelStyles}>{time}ms</label>
      <button onClick={handleRunClick} style={buttonStyles} > {running ? '停止' : '开始'} </button>
      <button onClick={handleClearClick} style={buttonStyles}> 清除 </button>
    </div>
  )
}

// -----------------------------------------
// 7. Custom Hooks
function useUserOnline(userId) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status)
  }

  useEffect(() => {
    setTimeout(() => { // 假设这是一个请求
      handleStatusChange(true)
    }, userId)
  });

  return isOnline;
}

export function User01(props) {
  const isOnline = useUserOnline(props.id);

  if (isOnline === null) {
    return 'Loading...';
  }

  return (
    <div style={{border: '1px solid #ccc', margin: '30px'}}>
      { isOnline ? 'Online' : 'Offline'}
    </div>
  )
}

export function User02(props) {
  const isOnline = useUserOnline(props.id);

  return (
    <ul style={{border: '1px solid #ccc', margin: '30px'}}>
      <li style={{ color: isOnline ? 'red' : 'black' }}>
        {props.name}
      </li>
    </ul>
  );
 }

