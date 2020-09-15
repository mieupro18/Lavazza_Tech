import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  ToastAndroid,
  BackHandler,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Card, CardItem, Button, Spinner, Icon} from 'native-base';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {
  SERVER_URL,
  TOKEN,
  SUCCESS,
  FAILURE,
  CONFIG_ERROR,
} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';

class SettingConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  // Check Network connection info
  async componentDidMount() {}

  // Send Device Reboot request
  reboot = async () => {
    this.setState({isLoading: true});
    fetch(SERVER_URL + '/techapp/reboot', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        if (resultData.status === SUCCESS) {
          ToastAndroid.showWithGravityAndOffset(
            'Success: Reboot Initiated',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          BackHandler.exitApp();
        } else if (resultData.status === FAILURE) {
          if (resultData.infoText === CONFIG_ERROR) {
            ToastAndroid.showWithGravityAndOffset(
              'Failure : Please provision all the device configurations ',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Failure : Something went wrong',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        }
        this.setState({isLoading: false});
      })
      .catch(e => {
        console.log(e);
        ToastAndroid.showWithGravityAndOffset(
          'Failure : Check your Wifi connection with the lavazza caffè machine ',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
        this.setState({isLoading: false});
      });
  };

  clearDeviceData = async () => {
    this.setState({isLoading: true});
    fetch(SERVER_URL + '/techapp/reset', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        if (resultData.status === SUCCESS) {
          ToastAndroid.showWithGravityAndOffset(
            'Success : Clear Device Data Initiated',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          BackHandler.exitApp();
        } else if (resultData.status === FAILURE) {
          if (resultData.infoText === CONFIG_ERROR) {
            ToastAndroid.showWithGravityAndOffset(
              'Failure : Clear data functionality works only after provisioning the device',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Failure : Something went wrong',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        }
        this.setState({isLoading: false});
      })
      .catch(e => {
        console.log(e);
        ToastAndroid.showWithGravityAndOffset(
          'Failure : Check your Wifi connection with the lavazza caffè machine ',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
        this.setState({isLoading: false});
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logoStyleInHeader}
            source={require('../../assets/lavazza_white_logo.png')}
          />
        </View>
        <ScrollView>
          {this.state.isLoading === true ? (
            <View style={styles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={styles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : (
            <Card style={styles.card}>
              <CardItem header style={styles.cardHeader}>
                <Text style={styles.cardHeaderTextStyle}>Settings</Text>
              </CardItem>
              <CardItem style={styles.flexColumnContainer}>
                <View style={styles.flexRowContainer}>
                  <View style={styles.keyTextContainer}>
                    <Text style={styles.keyTextStyle}>
                      Reboot{'\n'}Instruction
                    </Text>
                  </View>
                  <View style={styles.valueTextContainer}>
                    <Text style={styles.valueTextStyle}>
                      To restart the device,{'\n'}Press 'Reboot' button
                    </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem>
                <Button
                  rounded
                  iconLeft
                  onPress={() => {
                    Alert.alert('', 'Do you want to reboot the device?', [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          await this.reboot();
                        },
                      },
                      {text: 'No'},
                    ]);
                  }}
                  style={styles.buttonStyle}>
                  <Icon name="reload-circle" style={styles.buttonIconStyle} />
                  <Text style={styles.buttonTextStyle}>Reboot</Text>
                </Button>
              </CardItem>
              <CardItem style={styles.flexColumnContainer}>
                <View style={styles.flexRowContainer}>
                  <View style={styles.keyTextContainer}>
                    <Text style={styles.keyTextStyle}>
                      Clear Data {'\n'}Instruction
                    </Text>
                  </View>
                  <View style={styles.valueTextContainer}>
                    <Text style={styles.valueTextStyle}>
                      To clear all the device data such as device
                      identity,product list and wifi ssid, Press 'Clear Data'
                      button
                    </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem>
                <Button
                  iconLeft
                  rounded
                  style={styles.buttonStyle}
                  onPress={async () => {
                    Alert.alert('', 'Do you want to clear device data?', [
                      {
                        text: 'Yes',
                        onPress: async () => {
                          await this.clearDeviceData();
                        },
                      },
                      {text: 'No'},
                    ]);
                  }}>
                  <Icon name="trash" style={styles.buttonIconStyle} />
                  <Text style={styles.buttonTextStyle}>Clear Data</Text>
                </Button>
              </CardItem>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default SettingConfig;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyleInHeader: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(5),
    resizeMode: 'contain',
  },
  spinnerContainer: {
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  spinnerTextStyle: {
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(1.8),
  },
  card: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardHeader: {
    justifyContent: 'center',
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(3),
    width: '60%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  cardHeaderTextStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
  },
  flexRowContainer: {flexDirection: 'row', marginTop: '5%'},
  flexColumnContainer: {flex: 1, flexDirection: 'column'},
  keyTextContainer: {width: '40%', padding: '3%'},
  valueTextContainer: {width: '60%', padding: '3%'},
  keyTextStyle: {
    fontSize: responsiveScreenFontSize(1.5),
    color: '#100A45',
    fontWeight: 'bold',
  },
  valueTextStyle: {fontSize: responsiveScreenFontSize(1.5)},
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    justifyContent: 'center',
    width: '50%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#100A45',
  },
  buttonIconStyle: {marginLeft: 'auto'},
  buttonTextStyle: {fontSize: responsiveScreenFontSize(1.5), color: '#fff'},
});
