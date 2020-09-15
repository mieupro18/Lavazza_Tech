import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  ToastAndroid,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  SafeAreaView,
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
  Icon,
} from 'native-base';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';

import {SERVER_URL, TOKEN, SUCCESS} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';

class DeviceInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  setStateToInitialState = async () => {
    this.setState({
      isEditDeviceInfo: false,
      deviceType: null,
      deviceName: null,
      deviceId: null,
      deviceData: null,
      isLoading: false,
    });
  };

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
        if (resultData.status === SUCCESS) {
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

  // Post Product Info
  saveDeviceDetails = async () => {
    if (
      this.state.deviceName !== null &&
      this.state.deviceId !== null &&
      this.state.deviceType !== null
    ) {
      let wsRegex = /^\s*|\s*$/g;
      this.setState({deviceId: await this.state.deviceId.replace(wsRegex, '')});
      this.setState({
        deviceName: await this.state.deviceName.replace(wsRegex, ''),
      });
      console.log(this.state);
      if (
        this.state.deviceName.length >= 3 &&
        this.state.deviceId.length >= 3 &&
        this.state.deviceType.length >= 3
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
            if (resultData.status === SUCCESS) {
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
            ToastAndroid.showWithGravityAndOffset(
              'Failed: Check your Wifi connection with the lavazza caffè machine ',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          });
      } else {
        Alert.alert(
          'All Fields are required',
          'Note : Minimum 3 characters length',
          [
            {
              text: 'Close',
            },
          ],
          {cancelable: true},
        );
      }
    } else {
      Alert.alert(
        'All Fields are required',
        'Note : Minimum 3 characters length',
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
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logoStyleInHeader}
            source={require('../../assets/lavazza_white_logo.png')}
          />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={async () => {
                if (this.state.isEditDeviceInfo === false) {
                  await this.setStateToInitialState();
                  await this.fetchDeviceData();
                }
              }}
            />
          }>
          {this.state.isLoading === true ? (
            <View style={styles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={styles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : this.state.deviceData !== null ? (
            <Card style={styles.card}>
              <CardItem header style={styles.cardHeader}>
                <Text style={styles.cardHeaderTextStyle}>Device Identity</Text>
              </CardItem>
              {this.state.isEditDeviceInfo === false ? (
                <CardItem style={styles.flexColumnContainer}>
                  <View style={styles.flexRowContainer}>
                    <View style={styles.keyTextContainer}>
                      <Text style={styles.keyTextStyle}>Device Id</Text>
                    </View>
                    <View style={styles.valueTextContainer}>
                      <Text style={styles.valueTextStyle}>
                        {this.state.deviceData.deviceId === null
                          ? '---Not Set---'
                          : this.state.deviceData.deviceId}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.flexRowContainer}>
                    <View style={styles.keyTextContainer}>
                      <Text style={styles.keyTextStyle}>Device Name</Text>
                    </View>
                    <View style={styles.valueTextContainer}>
                      <Text style={styles.valueTextStyle}>
                        {this.state.deviceData.deviceName === null
                          ? '---Not Set---'
                          : this.state.deviceData.deviceName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.flexRowContainer}>
                    <View style={styles.keyTextContainer}>
                      <Text style={styles.keyTextStyle}>Device Type</Text>
                    </View>
                    <View style={styles.valueTextContainer}>
                      <Text style={styles.valueTextStyle}>
                        {this.state.deviceData.deviceType === null
                          ? '---Not Set---'
                          : this.state.deviceData.deviceType}
                      </Text>
                    </View>
                  </View>
                  <Button
                    rounded
                    iconLeft
                    style={styles.buttonStyle}
                    onPress={async () => {
                      this.setState({isEditDeviceInfo: true});
                    }}>
                    <Icon
                      name="create-outline"
                      style={styles.buttonIconStyle}
                    />
                    <Text style={styles.buttonTextStyle}>Edit</Text>
                  </Button>
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
                        fontSize={responsiveScreenFontSize(1.8)}
                        keyboardType="visible-password"
                        maxLength={100}
                        onSubmitEditing={() => {
                          this.deviceName.focus();
                        }}
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
                        keyboardType="visible-password"
                        ref={input => {
                          this.deviceName = input;
                        }}
                        maxLength={100}
                        fontSize={responsiveScreenFontSize(1.8)}
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
                                color="#000"
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
                        iconLeft
                        style={styles.cancelButtonStyle}
                        onPress={async () => {
                          this.setState({
                            isEditDeviceInfo: false,
                            deviceType: this.state.deviceData.deviceType,
                            deviceId: this.state.deviceData.deviceId,
                            deviceName: this.state.deviceData.deviceName,
                          });
                        }}>
                        <Icon
                          name="close-circle"
                          style={styles.cancelButtonIconStyle}
                        />
                        <Text style={styles.cancelButtonTextStyle}>Cancel</Text>
                      </Button>
                      <Button
                        rounded
                        iconLeft
                        style={styles.buttonStyle}
                        onPress={() => {
                          this.saveDeviceDetails();
                        }}>
                        <Icon
                          name="checkmark-circle"
                          style={styles.buttonIconStyle}
                        />
                        <Text style={styles.buttonTextStyle}>Save</Text>
                      </Button>
                    </View>
                  </Form>
                </CardItem>
              )}
            </Card>
          ) : (
            <View style={styles.errorContainer}>
              <Entypo
                name="warning"
                style={styles.warningImageStyle}
                size={responsiveScreenHeight(10)}
              />

              <Text style={styles.errorTextStyle}>
                Something went wrong...!
              </Text>
              <Text style={styles.errorTextStyle}>
                Please check your wifi connection
              </Text>
              <TouchableHighlight
                underlayColor="#100A45"
                style={styles.tryAgainButtonStyle}
                onPress={async () => {
                  await this.setStateToInitialState();
                  await this.fetchDeviceData();
                }}>
                <Text style={styles.tryAgainButtonTextStyle}>Reload</Text>
              </TouchableHighlight>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
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
    width: '50%',
    alignSelf: 'center',
    borderRadius: responsiveScreenWidth(2),
  },
  cardHeaderTextStyle: {
    fontSize: responsiveScreenFontSize(2),
    fontWeight: 'bold',
    color: '#fff',
  },
  flexRowContainer: {flexDirection: 'row', marginTop: '5%'},
  flexColumnContainer: {flex: 1, flexDirection: 'column'},
  keyTextStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#100A45',
    fontWeight: 'bold',
  },
  keyTextContainer: {width: '50%', padding: '3%'},
  valueTextContainer: {width: '50%', padding: '3%'},
  valueTextStyle: {fontSize: responsiveScreenFontSize(1.8)},
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#100A45',
  },
  buttonIconStyle: {marginLeft: 'auto'},
  buttonTextStyle: {fontSize: responsiveScreenFontSize(2), color: '#fff'},
  cancelButtonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#f1f2f6',
  },
  cancelButtonTextStyle: {color: '#000', fontSize: responsiveScreenFontSize(2)},
  cancelButtonIconStyle: {marginLeft: 'auto', color: '#000'},
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
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
  },
  textInput: {
    height: responsiveScreenHeight(5),
    width: '80%',
    textAlign: 'center',
    color: '#000',
    borderColor: 'gray',
    borderWidth: responsiveScreenWidth(0.1),
    borderRadius: responsiveScreenWidth(2),
    backgroundColor: '#f1f2f6',
    marginTop: '2%',
  },
  pickerItemStyle: {width: '80%', alignSelf: 'center'},
  pickerStyle: {color: '#100A45'},
  errorContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  warningImageStyle: {color: '#CECDCB', marginTop: '10%'},
  errorTextStyle: {
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(1.8),
  },
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
    fontSize: responsiveScreenFontSize(2),
  },
});
