import React from '@/react';

export default class ClassCounter extends React.Component {
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
