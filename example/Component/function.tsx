import React, { useReducer, useState } from '@/react';

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { count: (state.count as number) + 1 };
    default:
      return state;
  }
}

export default function FunctionCounter() {
  const [numberState, setNumberState] = useState({ number: 0 });
  const [countState, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <div id="counter1">
        <span>{numberState.number}</span>
        <button
          onClick={() =>
            setNumberState({ number: (numberState.number as number) + 1 })
          }
        >
          加1
        </button>
      </div>
      <div id="counter2">
        <span>{countState.count}</span>
        <button onClick={() => dispatch({ type: 'ADD' })}>加1</button>
      </div>
    </div>
  );
}
