import React from '@/react';
import { Fiber } from '@/types';

export class ClassCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  onClick = () => {
    this.setState((state) => ({
      number: (state.number as number) + 1,
    }));
  };

  render() {
    const { number } = this.state;
    return (
      // eslint-disable-next-line react/prop-types
      <div id="counter" name={this.props.name}>
        <span>{number}</span>
        <button onClick={this.onClick}>加1</button>
      </div>
    );
  }
}

const ADD = 'ADD';

function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { count: (state.count as number) + 1 };
    default:
      return state;
  }
}

function FunctionCounter() {
  const [numberState, setNumberState] = React.useState({ number: 0 });
  const [countState, dispatch] = React.useReducer(reducer, { count: 0 });
  return (
    <div>
      <div id="counter1">
        <span>{numberState.number}</span>
        <button
          onClick={() => setNumberState({ number: numberState.number + 1 })}
        >
          加1
        </button>
      </div>
      <div id="counter2">
        <span>{countState.count}</span>
        <button onClick={() => dispatch({ type: ADD })}>加1</button>
      </div>
    </div>
  );
}
