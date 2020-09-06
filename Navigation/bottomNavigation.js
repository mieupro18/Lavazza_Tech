import React from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ProductConfig from '../screens/productConfiguration';
import DeviceConfig from '../screens/deviceConfiguration';
import WifiConfig from '../screens/wifiConfiguration';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Device: {
      screen: DeviceConfig,
      navigationOptions: {
        tabBarLabel: 'Device Info',
        tabBarIcon: ({tintColor}) => (
          <View>
            <FontAwesome5
              style={[{color: tintColor}]}
              size={22}
              name={'info-circle'}
            />
          </View>
        ),
        activeColor: '#fff',
        inactiveColor: '#ccc',
      },
    },

    Products: {
      screen: ProductConfig,
      navigationOptions: {
        tabBarLabel: 'Products Info',
        tabBarIcon: ({tintColor}) => (
          <View>
            <FontAwesome5
              style={[{color: tintColor}]}
              size={22}
              name={'mug-hot'}
            />
          </View>
        ),
        activeColor: '#fff',
        inactiveColor: '#ccc',
      },
    },

    WiFi: {
      screen: WifiConfig,
      navigationOptions: {
        tabBarLabel: 'WiFi Info',
        tabBarIcon: ({tintColor}) => (
          <View>
            <FontAwesome style={[{color: tintColor}]} size={22} name={'wifi'} />
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
    headerMode: 'none',
    inactiveColor: '#000',
    barStyle: {backgroundColor: '#100A45'},
    shifting: true,
  },
);

export default createAppContainer(TabNavigator);
