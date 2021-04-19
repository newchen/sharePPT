import React from 'react';
import './App.css';

import { 
  StateHookExample, 
  EffectHookExample01,
  EffectHookExample02, 
  UseReducerExample,
  UseCallbackExample,
  UseRefExample,
  UseLayoutEffectExample
 } from './demo/Hooks.js'

function App() {
  return (
    <div className="App">
      <StateHookExample/>

      <EffectHookExample01/>
      <EffectHookExample02/>
      <UseReducerExample/>
      <UseCallbackExample />
      <UseRefExample />
      <UseLayoutEffectExample />
    </div>
  )
}

export default App;
