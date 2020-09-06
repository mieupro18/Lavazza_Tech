import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../Login/login';


import BottomNavigation from './bottomNavigation';


const AppNavigator = createStackNavigator(
  {
    Login: Login,
    LavAzza: BottomNavigation,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login',
  },
);

const AppContainer = createAppContainer(AppNavigator);
export default class StackNavigator extends React.Component {
  render() {
    return <AppContainer />;
  }
}
