import React from 'react';
import Cube from './Cube'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  getCube() {
    return (
      <Cube />
    );
  }

  render() {
    return (
      <>
        {this.getCube() }
      </>
    )
  }
}

export default App;
