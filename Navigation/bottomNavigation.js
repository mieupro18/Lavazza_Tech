import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';

import Configuration from '../screens/configuration';
import DeviceInfo from '../screens/deviceInfo';
import WifiInfo from '../screens/wifiConfiguration';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Device: {
      screen: DeviceInfo,
      navigationOptions: {
        tabBarLabel: 'Device Info',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={22} name={'infocirlceo'} />
          </View>
        ),

        activeColor: '#fff',
        inactiveColor: '#ccc',
      },
    },

    Products: {
      screen: Configuration,
      navigationOptions: {
        tabBarLabel: 'Products Info',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={22} name={"rest"} />
          </View>
        ),
        activeColor: '#fff',
        inactiveColor: '#ccc',
      },
    },

    WiFi: {
        screen: WifiInfo,
        navigationOptions: {
          tabBarLabel: 'WiFi Config',
          tabBarIcon: ({tintColor}) => (
            <View>
              <Icon style={[{color: tintColor}]} size={22} name={"wifi"} />
            </View>
          ),
          activeColor: '#fff',
          inactiveColor: '#ccc',
          
        },
      },
  },
  {
    initialRouteName: 'Device',
    activeColor: '#182C61',
    inactiveColor: '#000',
    barStyle: {backgroundColor: '#182C61'},
    shifting:true
  },
);

export default createAppContainer(TabNavigator);
