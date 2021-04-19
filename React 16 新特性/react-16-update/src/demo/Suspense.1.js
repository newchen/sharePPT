
import React, { Suspense } from 'react';
import { unstable_createResource as createResource } from 'react-cache';

const getName = (id) =>  {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('我是返回的数据: ' + id);
    }, 2000);
  })
}

let fetcher = createResource(getName);

const Greeting = (props) => {
  let name = fetcher.read(props.name)

  return <div>Hello {name}</div>
};

export default function SuspenseDemo() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Greeting name="chb"/>
    </Suspense>
  );
};



