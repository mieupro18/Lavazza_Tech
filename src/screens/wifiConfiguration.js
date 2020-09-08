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
} from 'react-native';

import {Card, CardItem, Button, Form, Label, Item, Spinner} from 'native-base';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {SERVER_URL, TOKEN} from '../utilities/macros';
import {ScrollView} from 'react-native-gesture-handler';
import getTimeoutSignal from '../utilities/commonApis';

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
        if (resultData.status === 'Success') {
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

  submitWifiDetails = async () => {
    if (this.state.ssid.length !== 0) {
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
          if (resultData.status === 'Success') {
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
      <View>
        <View style={styles.headerContainer}>
          <Image
            style={styles.logoStyleInHeader}
            source={require('../../assets/lavazza_white_logo.png')}
          />
        </View>
        <ScrollView>
          {this.state.isLoading === true ? (
            <View>
              <Spinner color="#182c61" />
              <Text style={styles.spinnerTextStyle}>
                Loading... Please Wait!
              </Text>
            </View>
          ) : this.state.wifiInfo !== null ? (
            <Card style={styles.card}>
              <CardItem header style={styles.cardHeader}>
                <Text
                  style={styles.cardHeaderTextStyle}
                  onPress={async () => {
                    if (this.state.isEditWifiInfo === false) {
                      this.setState({
                        wifiInfo: null,
                        isLoading: false,
                        ssid: null,
                      });
                      await this.fetchWifiData();
                    }
                  }}>
                  Wifi Info
                </Text>
              </CardItem>
              {this.state.isEditWifiInfo === false ? (
                <CardItem style={styles.flexColumnContainer}>
                  <View style={styles.flexRowContainer}>
                    <Text style={styles.keyTextStyle}>Wifi SSID</Text>
                    <Text style={styles.valueTextStyle}>
                      {this.state.wifiInfo.ssid === null
                        ? 'Not Set'
                        : this.state.wifiInfo.ssid}
                    </Text>
                  </View>

                  <Button
                    rounded
                    style={styles.editButtonStyle}
                    onPress={async () => {
                      this.setState({isEditWifiInfo: true});
                    }}>
                    <Text style={styles.editButtonTextStyle}>Edit</Text>
                  </Button>
                </CardItem>
              ) : (
                <CardItem style={styles.cardItemForm}>
                  <Form style={styles.formStyle}>
                    <Item style={styles.formItemTransparentStyle}>
                      <Label style={styles.labelStyle}>Wifi SSID</Label>
                    </Item>
                    <Item style={styles.formItemStyle}>
                      <TextInput
                        defaultValue={this.state.ssid}
                        style={styles.textInput}
                        selectionColor="#100A45"
                        fontSize={responsiveScreenFontSize(1.5)}
                        onChangeText={ssid => (this.state.ssid = ssid)}
                      />
                    </Item>
                    <View style={styles.buttonContainer}>
                      <Button
                        rounded
                        style={styles.cancelButtonStyle}
                        onPress={async () => {
                          this.setState({
                            isEditWifiInfo: false,
                            ssid: this.state.wifiInfo.ssid,
                          });
                        }}>
                        <Text style={styles.cancelButtonTextStyle}>Cancel</Text>
                      </Button>
                      <Button
                        rounded
                        style={styles.submitButtonStyle}
                        onPress={() => {
                          this.submitWifiDetails();
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
                    wifiInfo: null,
                    isLoading: false,
                    ssid: null,
                  });
                  await this.fetchWifiData();
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
  spinnerTextStyle: {textAlign: 'center'},
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
    borderRadius: 10,
  },
  cardHeaderTextStyle: {fontSize: 14, fontWeight: 'bold', color: '#fff'},
  flexRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  flexColumnContainer: {
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  fiftyPercentWidthContainer: {width: '50%'},
  keyTextStyle: {fontSize: 14, fontWeight: 'bold'},
  valueTextStyle: {fontSize: 14},
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
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
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
