import React, {Component} from 'react';

import {
  View,
  Text,
  Alert,
  Image,
  ToastAndroid,
  BackHandler,
  TouchableHighlight,
  StyleSheet,
  TextInput,
} from 'react-native';

import {
  Card,
  CardItem,
  Button,
  Form,
  Label,
  Item,
  Picker,
  Spinner,
} from 'native-base';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import {SERVER_URL, TOKEN} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class DeviceInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      isEditDeviceInfo: false,
      deviceType: null,
      deviceName: null,
      deviceId: null,
      deviceData: null,
      isLoading: false,
    };
  }

  // Check Network connection info
  async componentDidMount() {
    await this.fetchDeviceData();
  }

  // Fetching Device Details
  fetchDeviceData = async () => {
    this.setState({isLoading: true});
    fetch(SERVER_URL + '/techapp/deviceInfo', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        console.log('fetch:', resultData);
        console.log(this.props.navigation.isFocused());
        if (resultData.status === 'Success') {
          this.setState({
            deviceData: resultData.data,
            deviceId: resultData.data.deviceId,
            deviceName: resultData.data.deviceName,
            deviceType: resultData.data.deviceType,
          });
        }
        this.setState({isLoading: false});
      })
      .catch(async e => {
        console.log(e);
        this.setState({isLoading: false});
      });
  };

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
          }
        }
        this.setState({isLoading: false});
      })
      .catch(e => {
        console.log(e);
        Alert.alert(
          '',
          'Check your Wifi connection with the lavazza caffè machine',
          [{text: 'Ok'}],
        );
        this.setState({isLoading: false});
      });
  };

  // Post Product Info
  submitDeviceDetails = async () => {
    if (
      this.state.deviceName.length !== 0 &&
      this.state.deviceId.length !== 0 &&
      this.state.deviceType.length !== 0
    ) {
      this.setState({isLoading: true});
      fetch(SERVER_URL + '/techapp/configureDeviceInfo', {
        method: 'POST',
        headers: {
          tokenId: TOKEN,
          'Content-Type': 'application/json',
        },
        signal: (await getTimeoutSignal(5000)).signal,
        body: JSON.stringify({
          data: {
            deviceName: this.state.deviceName,
            deviceId: this.state.deviceId,
            deviceType: this.state.deviceType,
          },
        }),
      })
        .then(response => response.json())
        .then(async resultData => {
          if (resultData.status === 'Success') {
            var newConfigureData = {};

            newConfigureData.deviceName = this.state.deviceName;
            newConfigureData.deviceId = this.state.deviceId;
            newConfigureData.deviceType = this.state.deviceType;
            newConfigureData.allDeviceTypes = this.state.deviceData.allDeviceTypes;

            this.setState({
              deviceData: newConfigureData,
              deviceName: newConfigureData.deviceName,
              deviceId: newConfigureData.deviceId,
              deviceType: newConfigureData.deviceType,
              isEditDeviceInfo: false,
            });
            ToastAndroid.showWithGravityAndOffset(
              'Success:  ' + resultData.infoText,
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            this.setState({
              deviceName: this.state.deviceData.deviceName,
              deviceId: this.state.deviceData.deviceId,
              deviceType: this.state.deviceData.deviceType,
              isEditDeviceInfo: false,
            });

            ToastAndroid.showWithGravityAndOffset(
              'Failed:  ' + resultData.infoText,
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
          this.setState({isLoading: false});
        })
        .catch(async e => {
          this.setState({
            deviceName: this.state.deviceData.deviceName,
            deviceId: this.state.deviceData.deviceId,
            deviceType: this.state.deviceData.deviceType,
            isEditDeviceInfo: false,
          });
          this.setState({isLoading: false});
          Alert.alert(
            '',
            'Check your Wifi connection with the lavazza caffè machine',
            [{text: 'Ok'}],
          );
        });
    } else {
      Alert.alert(
        '',
        'All Fields are required.',
        [
          {
            text: 'Close',
          },
        ],
        {cancelable: true},
      );
    }
  };
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logoStyleInHeader}
            source={require('../../assets/lavazza_white_logo.png')}
          />
        </View>
        <ScrollView>
          {this.state.isLoading === true ? (
            <View style={styles.spinnerContainer}>
              <Spinner color="#100A45" />
              <Text style={styles.spinnerTextStyle}>
                Loading... Please Wait!
              </Text>
            </View>
          ) : this.state.deviceData !== null ? (
            <Card style={styles.card}>
              <CardItem header style={styles.cardHeader}>
                <Text
                  style={styles.cardHeaderTextStyle}
                  onPress={async () => {
                    if (this.state.isEditDeviceInfo === false) {
                      this.setState({
                        showToast: false,
                        deviceType: null,
                        deviceName: null,
                        deviceId: null,
                        deviceData: null,
                        isLoading: false,
                      });
                      await this.fetchDeviceData();
                    }
                  }}>
                  Device Info
                </Text>
              </CardItem>
              {this.state.isEditDeviceInfo === false ? (
                <CardItem>
                  <View style={styles.flexColumnContainer}>
                    <View style={styles.flexRowContainer}>
                      <View style={styles.fiftyPercentWidthContainer}>
                        <Text style={styles.keyTextStyle}>Device Id</Text>
                      </View>
                      <View style={styles.fiftyPercentWidthContainer}>
                        <Text style={styles.valueTextStyle}>
                          {this.state.deviceData.deviceId === null
                            ? 'Not Set'
                            : this.state.deviceData.deviceId}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.flexRowContainer}>
                      <View style={styles.fiftyPercentWidthContainer}>
                        <Text style={styles.keyTextStyle}>Device Name</Text>
                      </View>
                      <View style={styles.fiftyPercentWidthContainer}>
                        <Text style={styles.valueTextStyle}>
                          {this.state.deviceData.deviceName === null
                            ? 'Not Set'
                            : this.state.deviceData.deviceName}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.flexRowContainer}>
                      <View style={styles.fiftyPercentWidthContainer}>
                        <Text style={styles.keyTextStyle}>Device Type</Text>
                      </View>
                      <View style={styles.fiftyPercentWidthContainer}>
                        <Text style={styles.valueTextStyle}>
                          {this.state.deviceData.deviceType === null
                            ? 'Not Set'
                            : this.state.deviceData.deviceType}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.buttonContainer}>
                      <Button
                        onPress={() => {
                          this.reboot();
                        }}
                        style={styles.rebootButtonStyle}>
                        <Text style={styles.rebootButtonTextStyle}>Reboot</Text>
                      </Button>
                      <Button
                        rounded
                        style={styles.editButtonStyle}
                        onPress={async () => {
                          this.setState({isEditDeviceInfo: true});
                        }}>
                        <Text style={styles.editButtonTextStyle}>Edit</Text>
                      </Button>
                    </View>
                  </View>
                </CardItem>
              ) : (
                <CardItem style={styles.cardItemForm}>
                  <Form style={styles.formStyle}>
                    <Item style={styles.formItemTransparentStyle}>
                      <Label style={styles.labelStyle}>Device Id</Label>
                    </Item>
                    <Item style={styles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.deviceData.deviceId}
                        style={styles.textInput}
                        selectionColor="#100A45"
                        fontSize={responsiveScreenFontSize(1.5)}
                        onChangeText={deviceId =>
                          (this.state.deviceId = deviceId)
                        }
                      />
                    </Item>
                    <Item style={styles.formItemTransparentStyle}>
                      <Label style={styles.labelStyle}>Device Name</Label>
                    </Item>
                    <Item style={styles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.deviceData.deviceName}
                        style={styles.textInput}
                        selectionColor="#100A45"
                        fontSize={responsiveScreenFontSize(1.5)}
                        onChangeText={deviceName =>
                          (this.state.deviceName = deviceName)
                        }
                      />
                    </Item>
                    <Item style={styles.formItemTransparentStyle}>
                      <Label style={styles.labelStyle}>Device Type</Label>
                    </Item>
                    <Item style={styles.pickerItemStyle}>
                      <Picker
                        //note
                        mode="dialog"
                        style={styles.pickerStyle}
                        selectedValue={this.state.deviceType}
                        onValueChange={async value => {
                          this.setState({deviceType: value});
                        }}>
                        <Picker.Item
                          fontSize={10}
                          color="grey"
                          label="---Select Type---"
                          value=""
                        />
                        {this.state.deviceData.allDeviceTypes.map(
                          (type, index) => {
                            return (
                              <Picker.Item
                                key={index}
                                color="#100A45"
                                fontSize={10}
                                label={type}
                                value={type}
                              />
                            );
                          },
                        )}
                      </Picker>
                    </Item>
                    <View style={styles.buttonContainer}>
                      <Button
                        rounded
                        style={styles.cancelButtonStyle}
                        onPress={async () => {
                          this.setState({
                            isEditDeviceInfo: false,
                            deviceType: this.state.deviceData.deviceType,
                            deviceId: this.state.deviceData.deviceId,
                            deviceName: this.state.deviceData.deviceName,
                          });
                        }}>
                        <Text style={styles.cancelButtonTextStyle}>Cancel</Text>
                      </Button>
                      <Button
                        rounded
                        style={styles.submitButtonStyle}
                        onPress={() => {
                          this.submitDeviceDetails();
                        }}>
                        <Text style={styles.submitButtonTextStyle}>Submit</Text>
                      </Button>
                    </View>
                  </Form>
                </CardItem>
              )}
            </Card>
          ) : (
            <View style={styles.errorContainer}>
              <Image
                style={styles.warningImageStyle}
                source={require('../../assets/warning.png')}
              />

              <Text style={styles.errorTextStyle}>
                Something Went Wrong...!
              </Text>
              <Text style={styles.errorTextStyle}>
                Please check your wifi connection
              </Text>
              <TouchableHighlight
                underlayColor="#100A45"
                style={styles.tryAgainButtonStyle}
                onPress={async () => {
                  this.setState({
                    showToast: false,
                    isEditDeviceInfo: false,
                    deviceType: null,
                    deviceName: null,
                    deviceId: null,
                    deviceData: null,
                    isLoading: false,
                  });
                  await this.fetchDeviceData();
                }}>
                <Text style={styles.tryAgainButtonTextStyle}>Reload</Text>
              </TouchableHighlight>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default DeviceInfo;

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
  spinnerTextStyle: {textAlign: 'center'},
  card: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardHeader: {
    justifyContent:'center',
    backgroundColor: '#100A45',
    height: responsiveScreenHeight(3),
    width: '50%',
    alignSelf: 'center',
    //flexDirection:'row',
    borderRadius: 10,
  },
  cardHeaderTextStyle: {fontSize: 14, fontWeight: 'bold', color: '#fff'},
  flexRowContainer: {flexDirection: 'row', marginTop: '5%'},
  flexColumnContainer: {flex: 1, flexDirection: 'column'},
  fiftyPercentWidthContainer: {width: '50%'},
  keyTextStyle: {fontSize: 14, fontWeight: 'bold'},
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
    backgroundColor: '#f1f2f6',
    borderRadius: 100,
  },
  rebootButtonTextStyle: {fontSize: 14, marginLeft: 5, color: '#000'},
  editButtonStyle: {
    justifyContent: 'center',
    marginTop: 25,
    width: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 5,
    backgroundColor: '#100A45',
  },
  editButtonTextStyle: {fontSize: 14, marginLeft: 5, color: '#fff'},
  cardItemForm: {flexDirection: 'column', alignItems: 'flex-start'},
  formStyle: {width: '100%'},
  formItemTransparentStyle: {
    alignSelf: 'center',
    borderColor: 'transparent',
    marginTop: '5%',
  },
  formItemStyle: {alignSelf: 'center'},
  labelStyle: {
    color: '#100A45',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    height: responsiveScreenHeight(5),
    width: '80%',
    textAlign: 'center',
    color: '#100A45',
    borderColor: 'gray',
    borderWidth: responsiveScreenWidth(0.1),
    borderRadius: responsiveScreenWidth(2),
    backgroundColor: '#f1f2f6',
    marginTop: '2%',
  },
  pickerItemStyle: {width: '80%', alignSelf: 'center'},
  pickerStyle: {color: '#100A45'},
  cancelButtonStyle: {
    justifyContent: 'space-around',
    width: '40%',
    marginBottom: 30,
    marginTop: 20,
    backgroundColor: '#f1f2f6',
  },
  cancelButtonTextStyle: {marginLeft: 5, color: '#000'},
  submitButtonStyle: {
    justifyContent: 'space-around',
    width: '40%',
    marginBottom: 30,
    marginTop: 20,
    backgroundColor: '#100A45',
  },
  submitButtonTextStyle: {color: '#fff'},
  errorContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  warningImageStyle: {
    width: 80,
    height: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 100,
  },
  errorTextStyle: {textAlign: 'center'},
  tryAgainButtonStyle: {
    width: responsiveScreenWidth(25),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenHeight(1),
    backgroundColor: '#100A45',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveScreenHeight(2),
  },
  tryAgainButtonTextStyle: {
    color: 'white',
    fontSize: responsiveScreenFontSize(1.5),
  },
});
