import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import Login from '../Login/login';


import BottomNavigation from './bottomNavigation';



const token = AsyncStorage.getItem('lavazzaLoginToken').then(value => {console.log(value); return value;} );

const RouteName = (token === null || token === undefined)?('Login'):('Lavazza');

const AppNavigator = createStackNavigator(
  {
    Login: Login,
    Lavazza: BottomNavigation,
  },
  {
    initialRouteName: RouteName,
  },
);

const AppContainer = createAppContainer(AppNavigator);
export default class StackNavigator extends React.Component {
  render() {
    return <AppContainer />;
  }
}
