import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  TouchableHighlight,
  StyleSheet,
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
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {SERVER_URL, TOKEN, SUCCESS} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';
import {SafeAreaView} from 'react-navigation';

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
                if (this.state.isEditWifiInfo === false) {
                  await this.setStateToInitialState();
                  await this.fetchWifiData();
                }
              }}
            />
          }>
          {this.state.isLoading === true ? (
            <View style={styles.spinnerContainer}>
              <Spinner color="#182c61" size={30} />
              <Text style={styles.spinnerTextStyle}>
                Loading...{'\n'} Please Wait!
              </Text>
            </View>
          ) : this.state.wifiInfo !== null ? (
            <Card style={styles.card}>
              <CardItem header style={styles.cardHeader}>
                <Text style={styles.cardHeaderTextStyle}>Wi-Fi Info</Text>
              </CardItem>
              {this.state.isEditWifiInfo === false ? (
                <CardItem style={styles.flexColumnContainer}>
                  <View style={styles.flexRowContainer}>
                    <View style={styles.keyTextContainer}>
                      <Text style={styles.keyTextStyle}>Wi-Fi SSID</Text>
                    </View>
                    <View style={styles.valueTextContainer}>
                      <Text style={styles.valueTextStyle}>
                        {this.state.wifiInfo.ssid === null
                          ? '---Not Set---'
                          : this.state.wifiInfo.ssid}
                      </Text>
                    </View>
                  </View>

                  <Button
                    rounded
                    iconLeft
                    style={styles.buttonStyle}
                    onPress={async () => {
                      this.setState({isEditWifiInfo: true});
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
                      <Label style={styles.labelStyle}>Wi-Fi SSID</Label>
                    </Item>
                    <Item style={styles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.ssid}
                        keyboardType="visible-password"
                        style={styles.textInput}
                        maxLength={32}
                        fontSize={responsiveScreenFontSize(1.5)}
                        onChangeText={ssid => (this.state.ssid = ssid)}
                      />
                    </Item>
                    <View style={styles.buttonContainer}>
                      <Button
                        iconLeft
                        rounded
                        style={styles.cancelButtonStyle}
                        onPress={async () => {
                          this.setState({
                            isEditWifiInfo: false,
                            ssid: this.state.wifiInfo.ssid,
                          });
                        }}>
                        <Icon
                          name="close-circle"
                          style={styles.cancelButtonIconStyle}
                        />
                        <Text style={styles.cancelButtonTextStyle}>Cancel</Text>
                      </Button>
                      <Button
                        iconLeft
                        rounded
                        style={styles.buttonStyle}
                        onPress={() => {
                          this.saveWifiDetails();
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
                  await this.fetchWifiData();
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

export default WifiInfo;

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
    fontSize: responsiveScreenFontSize(1.5),
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
    width: '75%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  cardHeaderTextStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
    color: '#fff',
  },
  flexRowContainer: {
    flexDirection: 'row',
  },
  flexColumnContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: '5%',
  },
  fiftyPercentWidthContainer: {width: '50%'},
  keyTextContainer: {width: '50%', padding: '3%'},
  valueTextContainer: {width: '50%', padding: '3%'},
  keyTextStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    color: '#100A45',
    fontWeight: 'bold',
  },
  valueTextStyle: {fontSize: responsiveScreenFontSize(1.8)},
  buttonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#100A45',
  },
  buttonIconStyle: {marginLeft: 'auto'},
  buttonTextStyle: {fontSize: responsiveScreenFontSize(1.8), color: '#fff'},
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
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  cancelButtonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#f1f2f6',
  },
  cancelButtonTextStyle: {
    color: '#000',
    fontSize: responsiveScreenFontSize(1.8),
  },
  errorContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
  },
  warningImageStyle: {
    color: '#CECDCB',
    marginTop: '10%',
  },
  errorTextStyle: {
    textAlign: 'center',
    fontSize: responsiveScreenFontSize(1.5),
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
    fontSize: responsiveScreenFontSize(1.8),
  },
});
