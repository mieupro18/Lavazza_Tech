import React, { Component } from 'react';


import StackNavigator from './Navigation/stackNavigation';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      
    }
  }
  
  render() { 
    return (
      <StackNavigator/>
      );
  }
}
 
export default App;
