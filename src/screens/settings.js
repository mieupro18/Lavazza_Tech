import React, {Component} from 'react';
import {Card, CardItem, Button, Spinner} from 'native-base';
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
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {SERVER_URL, TOKEN} from '../utilities/macros';
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
        if (resultData.status === 'Success') {
          ToastAndroid.showWithGravityAndOffset(
            'Reboot Initiated',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          BackHandler.exitApp();
        } else if (resultData.status === 'Failure') {
          if (resultData.infoText === 'config error') {
            ToastAndroid.showWithGravityAndOffset(
              'Reboot Failed. Please provision all the device configurations ',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Reboot Failed. Something went wrong',
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
          'Failed: Check your Wifi connection with the lavazza caffè machine ',
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
        if (resultData.status === 'Success') {
          ToastAndroid.showWithGravityAndOffset(
            'Success: Reboot Initiated',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          BackHandler.exitApp();
        } else if (resultData.status === 'Failure') {
          if (resultData.infoText === 'config error') {
            ToastAndroid.showWithGravityAndOffset(
              'Failed : Clear data functionality works only after provisioning the device',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Device data reset Failed: Something went wrong',
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
          'Failed: Check your Wifi connection with the lavazza caffè machine ',
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
                  <View style={styles.fiftyPercentWidthContainer}>
                    <Text style={styles.keyTextStyle}>
                      Device Reboot{'\n'}Instruction
                    </Text>
                  </View>
                  <View style={styles.fiftyPercentWidthContainer}>
                    <Text style={styles.valueTextStyle}>
                      To restart the device,Press 'Reboot' button below
                    </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem>
                <View style={styles.buttonContainer}>
                  <Button
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
                    style={styles.rebootButtonStyle}>
                    <Text style={styles.rebootButtonTextStyle}>Reboot</Text>
                  </Button>
                </View>
              </CardItem>
              <CardItem style={styles.flexColumnContainer}>
                <View style={styles.flexRowContainer}>
                  <View style={styles.fiftyPercentWidthContainer}>
                    <Text style={styles.keyTextStyle}>
                      Clear Device Data {'\n'}Instruction
                    </Text>
                  </View>
                  <View style={styles.fiftyPercentWidthContainer}>
                    <Text style={styles.valueTextStyle}>
                      To clear all the device data such as device
                      identity,product list,wifi ssid,etc.,Press 'Clear Data'
                      button below
                    </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem>
                <View style={styles.buttonContainer}>
                  <Button
                    rounded
                    style={styles.resetButtonStyle}
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
                    <Text style={styles.resetButtonTextStyle}>Clear Data</Text>
                  </Button>
                </View>
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
  spinnerTextStyle: {textAlign: 'center', fontSize: 13},
  card: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardHeader: {
    justifyContent: 'center',
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(3),
    width: '50%',
    alignSelf: 'center',
    //flexDirection:'row',
    borderRadius: 10,
  },
  cardHeaderTextStyle: {fontSize: 14, fontWeight: 'bold', color: '#fff'},
  cardItemHeadingTextStyle: {fontSize: 14, fontWeight: 'bold', color: '#000'},
  cardItemTextStyle: {
    fontSize: 14,
    marginLeft: '5%',
    marginTop: '2%',
    color: '#000',
  },
  flexRowContainer: {flexDirection: 'row', marginTop: '5%'},
  flexColumnContainer: {flex: 1, flexDirection: 'column'},
  fiftyPercentWidthContainer: {width: '50%'},
  keyTextStyle: {fontSize: 14, color: '#100A45', fontWeight: 'bold'},
  valueTextStyle: {fontSize: 14},
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  rebootButtonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: 25,
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#100A45',
    borderRadius: 100,
  },
  rebootButtonTextStyle: {fontSize: 14, marginLeft: 5, color: '#fff'},
  resetButtonStyle: {
    justifyContent: 'space-around',
    width: '40%',
    marginBottom: 30,
    marginTop: 20,
    backgroundColor: '#100A45',
  },
  resetButtonTextStyle: {color: '#fff'},
});
