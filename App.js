import React, { Component } from 'react';


import StackNavigator from './Navigation/stackNavigation';
import { View, Text } from 'native-base';


import {SafeAreaView} from 'react-native'

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
