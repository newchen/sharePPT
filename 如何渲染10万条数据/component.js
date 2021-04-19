class Component {
  constructor(props, context) {
    this.props = props
    this.context = context
    this.state = this.state || {}
    this.refs = {}
    this.updater = {}
  }

  setState(updater) {
    scheduleWork(this, updater)
  }

  render() {
    throw 'should implement `render()` function'
  }
}

Component.prototype.isReactComponent = true
// -----------------------------------------

const tag = {
  HostComponent: 'host', // 宿主组件, 也就是原生html元素
  ClassComponent: 'class', // class组件
  HostRoot: 'root', // 根节点
  HostText: 6, // 文本
  FunctionalComponent: 1 // 函数组件
}

const updateQueue = []

function render(Vnode, Container) {
  updateQueue.push({
    fromTag: tag.HostRoot,
    stateNode: Container,
    props: { children: Vnode }
  })

  requestIdleCallback(performWork) //开始干活
}

function scheduleWork(instance, partialState) {
  updateQueue.push({
    fromTag: tag.ClassComponent,
    stateNode: instance,
    partialState: partialState
  })

  requestIdleCallback(performWork) //开始干活
}
// -----------------------------------------

const EXPIRATION_TIME = 1 // ms async 逾期时间
let nextUnitOfWork = null
let pendingCommit = null

function performWork(deadline) {
  workLoop(deadline)

  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork) //继续干
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    //一个周期内只创建一次
    nextUnitOfWork = createWorkInProgress(updateQueue)
  }

  while (nextUnitOfWork && deadline.timeRemaining() > EXPIRATION_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork) // 链表遍历等操作
  }

  if (pendingCommit) {
    //当全局 pendingCommit 变量被负值
    commitAllwork(pendingCommit)
  }
}
// -----------------------------------------------

function createWorkInProgress(updateQueue) {
  const updateTask = updateQueue.shift()
  if (!updateTask) return

  if (updateTask.partialState) {
    // 证明这是一个setState操作
    updateTask.stateNode._internalfiber.partialState = updateTask.partialState
  }

  const rootFiber =
    updateTask.fromTag === tag.HostRoot
      ? updateTask.stateNode._rootContainerFiber
      : getRoot(updateTask.stateNode._internalfiber)

  return {
    tag: tag.HostRoot,
    stateNode: updateTask.stateNode,
    props: updateTask.props || rootFiber.props,
    alternate: rootFiber // 用于链接新旧的 VDOM
  }
}

function getRoot(fiber) {
  let _fiber = fiber
  while (_fiber.return) {
    _fiber = _fiber.return
  }
  return _fiber
}
// -----------------------------------------------

// 开始遍历
function performUnitOfWork(workInProgress) {
  const nextChild = beginWork(workInProgress)
  if (nextChild) return nextChild

  // 没有 nextChild, 我们看看这个节点有没有 sibling
  let current = workInProgress
  while (current) {
    //收集当前节点的effect，然后向上传递
    completeWork(current)
    if (current.sibling) return current.sibling
    //没有 sibling，回到这个节点的父亲，看看有没有sibling
    current = current.return
  }
}
// -----------------------------------------------

function beginWork(currentFiber) {
  switch (currentFiber.tag) {
    case tag.ClassComponent: {
      return updateClassComponent(currentFiber)
    }
    case tag.FunctionalComponent: {
      return updateFunctionalComponent(currentFiber)
    }
    default: {
      return updateHostComponent(currentFiber)
    }
  }
}

function updateHostComponent(currentFiber) {
  // 当一个 fiber 对应的 stateNode 是原生节点，那么他的 children 就放在 props 里
  if (!currentFiber.stateNode) {
    if (currentFiber.type === null) {
      //代表这是文字节点
      currentFiber.stateNode = document.createTextNode(currentFiber.props)
    } else {
      //代表这是真实原生 DOM 节点
      currentFiber.stateNode = document.createElement(currentFiber.type)
    }
  }
  const newChildren = currentFiber.props.children
  return reconcileChildrenArray(currentFiber, newChildren)
}

function updateFunctionalComponent(currentFiber) {
  let type = currentFiber.type
  let props = currentFiber.props
  const newChildren = currentFiber.type(props)

  return reconcileChildrenArray(currentFiber, newChildren)
}

function updateClassComponent(currentFiber) {
  let instance = currentFiber.stateNode
  if (!instance) {
    // 如果是 mount 阶段，构建一个 instance
    instance = currentFiber.stateNode = createInstance(currentFiber)
  }

  // 将新的state,props刷给当前的instance
  instance.props = currentFiber.props
  instance.state = { ...instance.state, ...currentFiber.partialState }

  // 清空 partialState
  currentFiber.partialState = null
  const newChildren = currentFiber.stateNode.render()

  // currentFiber 代表老的，newChildren代表新的
  // 这个函数会返回孩子队列的第一个
  return reconcileChildrenArray(currentFiber, newChildren)
}

function createInstance(fiber) {
  const instance = new fiber.type(fiber.props)
  instance._internalfiber = fiber
  return instance
}
// -----------------------------------------------

const PLACEMENT = 1
const DELETION = 2
const UPDATE = 3

function placeChild(currentFiber, newChild) {
  const type = newChild.type

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 如果这个节点没有 type ,这个节点就可能是 number 或者 string
    return createFiber(tag.HostText, null, newChild, currentFiber, PLACEMENT)
  }

  if (typeof type === 'string') {
    // 原生节点
    return createFiber(tag.HOST_COMPONENT, newChild.type, newChild.props, currentFiber, PLACEMENT)
  }

  if (typeof type === 'function') {
    const _tag = type.prototype.isReactComponent ? tag.CLASS_COMPONENT : tag.FunctionalComponent

    return {
      type: newChild.type,
      tag: _tag,
      props: newChild.props,
      return: currentFiber,
      effectTag: PLACEMENT
    }
  }
}

function reconcileChildrenArray(currentFiber, newChildren) {
  // 对比节点，相同的标记更新
  // 不同的标记 替换
  // 多余的标记删除，并且记录下来
  const arrayfiyChildren = arrayfiy(newChildren)

  let index = 0
  let oldFiber = currentFiber.alternate ? currentFiber.alternate.child : null
  let newFiber = null

  while (index < arrayfiyChildren.length || oldFiber !== null) {
    const prevFiber = newFiber
    const newChild = arrayfiyChildren[index]
    const isSameFiber = oldFiber && newChild && newChild.type === oldFiber.type

    if (isSameFiber) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: newChild.props,
        return: currentFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE
      }
    }

    // 不一致, 创建新的Fiber节点
    if (!isSameFiber && newChild) {
      newFiber = placeChild(currentFiber, newChild)
    }

    // 不一致, 旧的Fiber节点删除
    if (!isSameFiber && oldFiber) {
      // 这时候，我们要将变更的 effect 放在本节点的 list 里
      oldFiber.effectTag = DELETION
      currentFiber.effects = currentFiber.effects || []
      currentFiber.effects.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling || null
    }

    if (index === 0) {
      currentFiber.child = newFiber
    } else if (prevFiber && newChild) {
      prevFiber.sibling = newFiber
    }

    index++
  }
  return currentFiber.child
}


