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
import {
  Card,
  CardItem,
  Button,
  Spinner,
  Icon,
  Form,
  Item,
  Label,
  Picker,
} from 'native-base';
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

const lowEnd = 3,
  highEnd = 35;

class SettingConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      additionalSettingsVisible: false,
      additionalSettingsData: null,
      isEditAdditionalSettings: false,
      station: null,
      numberOfStationRange: [],
    };
  }

  // Check Network connection info
  async componentDidMount() {
    for (var i = lowEnd; i <= highEnd; i++) {
      this.state.numberOfStationRange.push(i.toString());
    }
    console.log(this.state);
  }

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

  requestAdditionalSettings = async () => {
    this.setState({isLoading: true});
    fetch(SERVER_URL + '/techapp/stationInfo', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        console.log('fetch:', resultData);
        console.log(this.props.navigation.isFocused());
        if (resultData.status === SUCCESS) {
          this.setState({
            additionalSettingsVisible: true,
          });
          this.setState({
            additionalSettingsData: resultData.data,
            station: resultData.data.station,
          });
        }
        this.setState({isLoading: false});
      })
      .catch(async e => {
        console.log(e);
        ToastAndroid.showWithGravityAndOffset(
          'Failed: Something went wrong',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
        this.setState({isLoading: false});
      });
  };

  saveAdditionalSettings = async () => {
    if (this.state.station !== null) {
      this.setState({isLoading: true});
      fetch(SERVER_URL + '/techapp/configureStationInfo', {
        method: 'POST',
        headers: {
          tokenId: TOKEN,
          'Content-Type': 'application/json',
        },
        signal: (await getTimeoutSignal(5000)).signal,
        body: JSON.stringify({
          data: {
            station: this.state.station,
          },
        }),
      })
        .then(response => response.json())
        .then(async resultData => {
          if (resultData.status === SUCCESS) {
            var newConfigureData = {};

            newConfigureData.station = this.state.station;

            this.setState({
              additionalSettingsData: newConfigureData,
              station: newConfigureData.station,
              isEditAdditionalSettings: false,
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
              station: this.state.additionalSettingsData.station,
              isEditAdditionalSettings: false,
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
            station: this.state.additionalSettingsData.station,
            isEditAdditionalSettings: false,
          });
          ToastAndroid.showWithGravityAndOffset(
            'Failed: Check your Wifi connection with the lavazza caffè machine ',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          this.setState({isLoading: false});
        });
    } else {
      Alert.alert(
        '',
        'All Fields are required',

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
            <View>
              {this.state.additionalSettingsVisible === false ? (
                <View>
                  <Card style={commonStyles.card}>
                    <CardItem header style={commonStyles.cardHeader}>
                      <Text style={commonStyles.cardHeaderTextStyle}>
                        Settings
                      </Text>
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
                        <Icon
                          name="reload-circle"
                          style={styles.buttonIconStyle}
                        />
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
                        Identity, Product List and Wi-Fi SSID), Press 'Clear
                        Data' button.
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
                    <CardItem>
                      <Text style={styles.instructionValueStyle}>
                        For additional settings, Press settings icon below,
                      </Text>
                    </CardItem>
                    <CardItem>
                      <Icon
                        name="md-settings"
                        style={styles.additionalSettingsIcon}
                        onPress={async () => {
                          this.requestAdditionalSettings();
                        }}
                      />
                    </CardItem>
                  </Card>
                </View>
              ) : (
                <View>
                  <Card style={commonStyles.card}>
                    <CardItem header style={commonStyles.cardHeader}>
                      <Text style={commonStyles.cardHeaderTextStyle}>
                        Additional Settings
                      </Text>
                    </CardItem>

                    {this.state.isEditAdditionalSettings === false ? (
                      <CardItem style={commonStyles.flexColumnContainer}>
                        <View style={commonStyles.flexRowContainer}>
                          <View style={commonStyles.keyTextContainer}>
                            <Text style={commonStyles.keyTextStyle}>
                              Max. Number of Mobile Devices
                            </Text>
                          </View>
                          <View style={commonStyles.valueTextContainer}>
                            <Text style={commonStyles.valueTextStyle}>
                              {this.state.additionalSettingsData.station}
                            </Text>
                          </View>
                        </View>
                        <View style={commonStyles.buttonContainer}>
                          <Button
                            iconLeft
                            rounded
                            style={commonStyles.cancelButtonStyle}
                            onPress={async () => {
                              this.setState({
                                additionalSettingsVisible: false,

                                isEditAdditionalSettings: false,
                                additionalSettingsData: null,
                                station: null,
                              });
                            }}>
                            <Icon
                              name="ios-arrow-back-circle"
                              style={commonStyles.cancelButtonIconStyle}
                            />
                            <Text style={commonStyles.cancelButtonTextStyle}>
                              Back
                            </Text>
                          </Button>
                          <Button
                            rounded
                            iconLeft
                            style={commonStyles.buttonStyle}
                            onPress={async () => {
                              this.setState({isEditAdditionalSettings: true});
                            }}>
                            <Icon
                              name="create-outline"
                              style={commonStyles.buttonIconStyle}
                            />
                            <Text style={commonStyles.buttonTextStyle}>
                              Edit
                            </Text>
                          </Button>
                        </View>
                      </CardItem>
                    ) : (
                      <CardItem style={commonStyles.cardItemForm}>
                        <Form style={commonStyles.formStyle}>
                          <Item style={commonStyles.formItemTransparentStyle}>
                            <Label style={commonStyles.labelStyle}>
                              Max. Number of Mobile Devices
                            </Label>
                          </Item>
                          <Item style={styles.pickerItemStyle}>
                            <Picker
                              mode="dialog"
                              style={styles.pickerStyle}
                              selectedValue={this.state.station}
                              onValueChange={async value => {
                                this.setState({station: value});
                              }}>
                              <Picker.Item
                                color="grey"
                                label="---Select Type---"
                                value={null}
                              />
                              {this.state.numberOfStationRange.map(
                                (number, index) => {
                                  return (
                                    <Picker.Item
                                      key={index}
                                      color="#000"
                                      fontSize={10}
                                      label={number}
                                      value={number}
                                    />
                                  );
                                },
                              )}
                            </Picker>
                          </Item>
                          <View style={commonStyles.buttonContainer}>
                            <Button
                              iconLeft
                              rounded
                              style={commonStyles.cancelButtonStyle}
                              onPress={async () => {
                                this.setState({
                                  isEditAdditionalSettings: false,
                                  station: this.state.additionalSettingsData
                                    .station,
                                });
                              }}>
                              <Icon
                                name="close-circle"
                                style={commonStyles.cancelButtonIconStyle}
                              />
                              <Text style={commonStyles.cancelButtonTextStyle}>
                                Cancel
                              </Text>
                            </Button>
                            <Button
                              iconLeft
                              rounded
                              style={commonStyles.buttonStyle}
                              onPress={() => {
                                this.saveAdditionalSettings();
                              }}>
                              <Icon
                                name="checkmark-circle"
                                style={commonStyles.buttonIconStyle}
                              />
                              <Text style={commonStyles.buttonTextStyle}>
                                Save
                              </Text>
                            </Button>
                          </View>
                        </Form>
                      </CardItem>
                    )}
                  </Card>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default SettingConfig;

const styles = StyleSheet.create({
  pickerItemStyle: {width: '50%', alignSelf: 'center'},
  pickerStyle: {color: '#100A45'},
  additionalSettingsIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '2%',
    color: '#100A45',
    fontSize: responsiveScreenFontSize(4),
  },
  additionalSettingsTextStyle: {marginRight: 'auto', marginLeft: 'auto'},
  instructionValueStyle: {
    marginRight: 'auto',
    marginLeft: 'auto',
    fontSize: responsiveScreenFontSize(1.5),
  },
  instructionKeyStyle: {
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
