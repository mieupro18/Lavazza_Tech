import {React, Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

export default class CustomHeader extends Component {
  constructor(props) {}
  render() {
    return (
      <View style={styles.headerContainer}>
        <Image
          style={styles.logoStyleInHeader}
          source={require('../assets/lavazzaname.jpg')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
  },
  logoStyleInHeader: {
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    marginLeft: 10,
  },
});
