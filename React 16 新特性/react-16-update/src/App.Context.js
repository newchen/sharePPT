import React, { Component } from 'react';

import ContextDemo from './demo/Context'
import ContextTheme from './demo/Context.theme'
import ContextType from './demo/Context.contextType'
import UseContext from './demo/Context.useContext'
import ContextLevel from './demo/Context.level'

export default function App() {
  return <div>
    <ContextDemo />
    -----------分割线: theme--------------
    <ContextTheme />
    -----------分割线: contextType--------------
    <ContextType/>
    -----------分割线: useContext--------------
    <UseContext />
    -----------分割线: ContextLevel--------------
    <ContextLevel />
  </div>
}


