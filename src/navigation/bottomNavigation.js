import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductConfig from '../screens/productConfiguration';
import DeviceConfig from '../screens/deviceConfiguration';
import WifiConfig from '../screens/wifiConfiguration';
import SettingConfig from '../screens/settings';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    DeviceIdentity: {
      screen: DeviceConfig,
      navigationOptions: {
        tabBarLabel: 'Device Identity',
        tabBarIcon: ({tintColor}) => (
          <Image
            style={styles.imageStyle}
            source={require('../../assets/coffee_machine_icon.png')}
          />
        ),
        activeColor: '#fff',
        inactiveColor: '#fff',
      },
    },

    ProductInfo: {
      screen: ProductConfig,
      navigationOptions: {
        tabBarLabel: 'Product Info',
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
        inactiveColor: '#fff',
      },
    },

    WiFiInfo: {
      screen: WifiConfig,
      navigationOptions: {
        tabBarLabel: 'Wifi Info',
        tabBarIcon: ({tintColor}) => (
          <View>
            <FontAwesome style={[{color: tintColor}]} size={22} name={'wifi'} />
          </View>
        ),
        activeColor: '#fff',
        inactiveColor: '#fff',
      },
    },
    Settings: {
      screen: SettingConfig,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({tintColor}) => (
          <View>
            <FontAwesome5 style={[{color: tintColor}]} size={22} name={'cog'} />
          </View>
        ),
        activeColor: '#fff',
        inactiveColor: '#fff',
      },
    },
  },
  {
    initialRouteName: 'DeviceIdentity',
    barStyle: {backgroundColor: '#100A45'},
    shifting: true,
  },
);

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  imageStyle: {width: '100%', height: '100%', resizeMode: 'contain'},
});
