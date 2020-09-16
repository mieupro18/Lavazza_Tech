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
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {commonStyles} from '../utilities/commonStyleSheet';

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
              'Failed: Please provision all the device configurations ',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Failed: Something went wrong',
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
        if (resultData.status === SUCCESS) {
          ToastAndroid.showWithGravityAndOffset(
            'Success: Clear Device Data Initiated',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          BackHandler.exitApp();
        } else if (resultData.status === FAILURE) {
          if (resultData.infoText === CONFIG_ERROR) {
            ToastAndroid.showWithGravityAndOffset(
              'Failed: Clear data functionality works only after provisioning the device',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'Failed: Something went wrong',
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
      <SafeAreaView style={commonStyles.mainContainer}>
        <View style={commonStyles.headerContainer}>
          <Image
            style={commonStyles.logoStyleInHeader}
            source={require('../../assets/lavazza_white_logo.png')}
          />
        </View>
        <ScrollView>
          {this.state.isLoading === true ? (
            <View style={commonStyles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={commonStyles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : (
            <Card style={commonStyles.card}>
              <CardItem header style={commonStyles.cardHeader}>
                <Text style={commonStyles.cardHeaderTextStyle}>Settings</Text>
              </CardItem>
              <CardItem>
                <Text style={styles.instructionKeyStyle}>
                  Reboot Instruction
                </Text>
              </CardItem>

              <CardItem>
                <Text style={styles.instructionValueStyle}>
                  To restart the device, Press 'Reboot' button.
                </Text>
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
              <CardItem>
                <Text style={styles.instructionKeyStyle}>
                  Clear Data Instruction
                </Text>
              </CardItem>

              <CardItem>
                <Text style={styles.instructionValueStyle}>
                  To clear all the configured device data (i.e., Device
                  Identity, Product List and Wi-Fi SSID), Press 'Clear Data'
                  button.
                </Text>
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
  instructionValueStyle: {
    //alignSelf: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    fontSize: responsiveScreenFontSize(1.5),
  },
  instructionKeyStyle: {
    //alignSelf: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    fontWeight: 'bold',
    fontSize: responsiveScreenFontSize(1.5),
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
  buttonTextStyle: {fontSize: responsiveScreenFontSize(1.8), color: '#fff'},
});
