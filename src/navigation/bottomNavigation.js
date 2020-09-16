import React from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ProductConfig from '../screens/productConfiguration';
import DeviceConfig from '../screens/deviceConfiguration';
import WifiConfig from '../screens/wifiConfiguration';
import SettingConfig from '../screens/settings';

DeviceConfig.navigationOptions = {
  tabBarLabel: 'Device',
  tabBarIcon: ({tintColor}) => (
    <View>
      <FontAwesome5 style={[{color: tintColor}]} size={22} name={'server'} />
    </View>
  ),
  activeColor: '#fff',
  inactiveColor: '#ccc',
};

ProductConfig.navigationOptions = {
  tabBarLabel: 'Products',
  tabBarIcon: ({tintColor}) => (
    <View>
      <FontAwesome5 style={[{color: tintColor}]} size={22} name={'mug-hot'} />
    </View>
  ),
  activeColor: '#fff',
  inactiveColor: '#ccc',
};

WifiConfig.navigationOptions = {
  tabBarLabel: 'Wi-Fi',
  tabBarIcon: ({tintColor}) => (
    <View>
      <FontAwesome style={[{color: tintColor}]} size={22} name={'wifi'} />
    </View>
  ),
  activeColor: '#fff',
  inactiveColor: '#ccc',
};

SettingConfig.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({tintColor}) => (
    <View>
      <FontAwesome5 style={[{color: tintColor}]} size={22} name={'cog'} />
    </View>
  ),
  activeColor: '#fff',
  inactiveColor: '#ccc',
};

const TabNavigator = createMaterialBottomTabNavigator(
  {
    DeviceIdentity: {
      screen: DeviceConfig,
    },

    ProductInfo: {
      screen: ProductConfig,
    },

    WiFiInfo: {
      screen: WifiConfig,
    },
    Settings: {
      screen: SettingConfig,
    },
  },
  {
    initialRouteName: 'DeviceIdentity',
    barStyle: {backgroundColor: '#100A45'},
    shifting: true,
  },
);

export default createAppContainer(TabNavigator);
