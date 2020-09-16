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
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';

import {SERVER_URL, TOKEN, SUCCESS} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';
import {commonStyles} from '../utilities/commonStyleSheet';

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
      <SafeAreaView style={commonStyles.mainContainer}>
        <View style={commonStyles.headerContainer}>
          <Image
            style={commonStyles.logoStyleInHeader}
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
            <View style={commonStyles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={commonStyles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : this.state.deviceData !== null ? (
            <Card style={commonStyles.card}>
              <CardItem header style={commonStyles.cardHeader}>
                <Text style={commonStyles.cardHeaderTextStyle}>
                  Device Identity
                </Text>
              </CardItem>
              {this.state.isEditDeviceInfo === false ? (
                <CardItem style={commonStyles.flexColumnContainer}>
                  <View style={commonStyles.flexRowContainer}>
                    <View style={commonStyles.keyTextContainer}>
                      <Text style={commonStyles.keyTextStyle}>Device Id</Text>
                    </View>
                    <View style={commonStyles.valueTextContainer}>
                      <Text style={commonStyles.valueTextStyle}>
                        {this.state.deviceData.deviceId === null
                          ? '---Not Set---'
                          : this.state.deviceData.deviceId}
                      </Text>
                    </View>
                  </View>
                  <View style={commonStyles.flexRowContainer}>
                    <View style={commonStyles.keyTextContainer}>
                      <Text style={commonStyles.keyTextStyle}>Device Name</Text>
                    </View>
                    <View style={commonStyles.valueTextContainer}>
                      <Text style={commonStyles.valueTextStyle}>
                        {this.state.deviceData.deviceName === null
                          ? '---Not Set---'
                          : this.state.deviceData.deviceName}
                      </Text>
                    </View>
                  </View>
                  <View style={commonStyles.flexRowContainer}>
                    <View style={commonStyles.keyTextContainer}>
                      <Text style={commonStyles.keyTextStyle}>Device Type</Text>
                    </View>
                    <View style={commonStyles.valueTextContainer}>
                      <Text style={commonStyles.valueTextStyle}>
                        {this.state.deviceData.deviceType === null
                          ? '---Not Set---'
                          : this.state.deviceData.deviceType}
                      </Text>
                    </View>
                  </View>
                  <Button
                    rounded
                    iconLeft
                    style={commonStyles.buttonStyle}
                    onPress={async () => {
                      this.setState({isEditDeviceInfo: true});
                    }}>
                    <Icon
                      name="create-outline"
                      style={commonStyles.buttonIconStyle}
                    />
                    <Text style={commonStyles.buttonTextStyle}>Edit</Text>
                  </Button>
                </CardItem>
              ) : (
                <CardItem style={commonStyles.cardItemForm}>
                  <Form style={commonStyles.formStyle}>
                    <Item style={commonStyles.formItemTransparentStyle}>
                      <Label style={commonStyles.labelStyle}>Device Id</Label>
                    </Item>
                    <Item style={commonStyles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.deviceData.deviceId}
                        style={commonStyles.textInput}
                        fontSize={responsiveScreenFontSize(1.5)}
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
                    <Item style={commonStyles.formItemTransparentStyle}>
                      <Label style={commonStyles.labelStyle}>Device Name</Label>
                    </Item>
                    <Item style={commonStyles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.deviceData.deviceName}
                        style={commonStyles.textInput}
                        keyboardType="visible-password"
                        ref={input => {
                          this.deviceName = input;
                        }}
                        maxLength={100}
                        fontSize={responsiveScreenFontSize(1.5)}
                        onChangeText={deviceName =>
                          (this.state.deviceName = deviceName)
                        }
                      />
                    </Item>
                    <Item style={commonStyles.formItemTransparentStyle}>
                      <Label style={commonStyles.labelStyle}>Device Type</Label>
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
                    <View style={commonStyles.buttonContainer}>
                      <Button
                        rounded
                        iconLeft
                        style={commonStyles.cancelButtonStyle}
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
                          style={commonStyles.cancelButtonIconStyle}
                        />
                        <Text style={commonStyles.cancelButtonTextStyle}>
                          Cancel
                        </Text>
                      </Button>
                      <Button
                        rounded
                        iconLeft
                        style={commonStyles.buttonStyle}
                        onPress={() => {
                          this.saveDeviceDetails();
                        }}>
                        <Icon
                          name="checkmark-circle"
                          style={commonStyles.buttonIconStyle}
                        />
                        <Text style={commonStyles.buttonTextStyle}>Save</Text>
                      </Button>
                    </View>
                  </Form>
                </CardItem>
              )}
            </Card>
          ) : (
            <View style={commonStyles.errorContainer}>
              <Entypo
                name="warning"
                style={commonStyles.warningImageStyle}
                size={responsiveScreenHeight(10)}
              />

              <Text style={commonStyles.errorTextStyle}>
                Something went wrong...!
              </Text>
              <Text style={commonStyles.errorTextStyle}>
                Please check your wifi connection
              </Text>
              <TouchableHighlight
                underlayColor="#100A45"
                style={commonStyles.tryAgainButtonStyle}
                onPress={async () => {
                  await this.setStateToInitialState();
                  await this.fetchDeviceData();
                }}>
                <Text style={commonStyles.tryAgainButtonTextStyle}>Reload</Text>
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
  pickerItemStyle: {width: '80%', alignSelf: 'center'},
  pickerStyle: {color: '#100A45'},
});
