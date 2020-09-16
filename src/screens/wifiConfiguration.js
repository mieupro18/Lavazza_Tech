import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  TouchableHighlight,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  CardItem,
  Button,
  Form,
  Label,
  Icon,
  Item,
  Spinner,
} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {SERVER_URL, TOKEN, SUCCESS} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';
import {commonStyles} from '../utilities/commonStyleSheet';

class WifiInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditWifiInfo: false,
      wifiInfo: null,
      isLoading: false,
      ssid: null,
    };
  }
  async componentDidMount() {
    await this.fetchWifiData();
  }

  setStateToInitialState = async () => {
    this.setState({
      wifiInfo: null,
      isEditWifiInfo: false,
      isLoading: false,
      ssid: null,
    });
  };

  fetchWifiData = async () => {
    this.setState({isLoading: true, wifiInfo: null});
    fetch(SERVER_URL + '/techapp/wifiInfo', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        console.log(resultData);
        console.log(this.props.navigation.isFocused());
        if (resultData.status === SUCCESS) {
          this.setState({
            wifiInfo: resultData.data,
            ssid: resultData.data.ssid,
          });
        }
        this.setState({isLoading: false});
      })
      .catch(async e => {
        this.setState({isLoading: false});
      });
  };

  saveWifiDetails = async () => {
    if (this.state.ssid !== null) {
      let wsRegex = /^\s*|\s*$/g;
      this.setState({ssid: await this.state.ssid.replace(wsRegex, '')});
      console.log(this.state.ssid);
      console.log(this.state.ssid.length);
      if (this.state.ssid.length >= 3) {
        if (this.state.ssid.match(/^(?=.*[A-Za-z])([ A-Za-z0-9_]+)*$/)) {
          this.setState({isLoading: true});
          fetch(SERVER_URL + '/techapp/configureWifiInfo', {
            method: 'POST',
            headers: {
              tokenId: 'secret',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                ssid: this.state.ssid,
              },
            }),
            signal: (await getTimeoutSignal(5000)).signal,
          })
            .then(response => response.json())
            .then(async resultData => {
              if (resultData.status === SUCCESS) {
                let newConfiguredData = {};
                newConfiguredData.ssid = this.state.ssid;

                this.setState({
                  wifiInfo: newConfiguredData,
                  ssid: newConfiguredData.ssid,
                  isEditWifiInfo: false,
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
                  ssid: this.state.wifiInfo.ssid,
                  isEditWifiInfo: false,
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
            .catch(e => {
              this.setState({
                ssid: this.state.wifiInfo.ssid,
                isLoading: false,
                isEditWifiInfo: false,
              });
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
            'Invalid Format',
            'Note: \n1. Minimum 3 characters length\n2. Must have one alphapet\n3. Numbers are allowed\n4. Allowed special character( _ )',
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
          'All Fields are required.',
          'Note: \n1. Minimum 3 characters length\n2. Must have one alphapet\n3. Numbers are allowed\n4. Allowed special character( "_"underscore )',
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
        'All Fields are required.',
        'Note: \n1. Minimum 3 characters length\n2. Must have one alphapet\n3. Numbers are allowed\n4. Allowed special character( "_"underscore )',
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
                if (this.state.isEditWifiInfo === false) {
                  await this.setStateToInitialState();
                  await this.fetchWifiData();
                }
              }}
            />
          }>
          {this.state.isLoading === true ? (
            <View style={commonStyles.spinnerContainer}>
              <Spinner color="#182c61" size={30} />
              <Text style={commonStyles.spinnerTextStyle}>
                Loading...{'\n'} Please Wait!
              </Text>
            </View>
          ) : this.state.wifiInfo !== null ? (
            <Card style={commonStyles.card}>
              <CardItem header style={commonStyles.cardHeader}>
                <Text style={commonStyles.cardHeaderTextStyle}>Wi-Fi Info</Text>
              </CardItem>
              {this.state.isEditWifiInfo === false ? (
                <CardItem style={commonStyles.flexColumnContainer}>
                  <View style={commonStyles.flexRowContainer}>
                    <View style={commonStyles.keyTextContainer}>
                      <Text style={commonStyles.keyTextStyle}>Wi-Fi SSID</Text>
                    </View>
                    <View style={commonStyles.valueTextContainer}>
                      <Text style={commonStyles.valueTextStyle}>
                        {this.state.wifiInfo.ssid === null
                          ? '---Not Set---'
                          : this.state.wifiInfo.ssid}
                      </Text>
                    </View>
                  </View>

                  <Button
                    rounded
                    iconLeft
                    style={commonStyles.buttonStyle}
                    onPress={async () => {
                      this.setState({isEditWifiInfo: true});
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
                      <Label style={commonStyles.labelStyle}>Wi-Fi SSID</Label>
                    </Item>
                    <Item style={commonStyles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.ssid}
                        keyboardType="visible-password"
                        style={commonStyles.textInput}
                        maxLength={32}
                        fontSize={responsiveScreenFontSize(1.5)}
                        onChangeText={ssid => (this.state.ssid = ssid)}
                      />
                    </Item>
                    <View style={commonStyles.buttonContainer}>
                      <Button
                        iconLeft
                        rounded
                        style={commonStyles.cancelButtonStyle}
                        onPress={async () => {
                          this.setState({
                            isEditWifiInfo: false,
                            ssid: this.state.wifiInfo.ssid,
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
                          this.saveWifiDetails();
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
                  await this.fetchWifiData();
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

export default WifiInfo;
