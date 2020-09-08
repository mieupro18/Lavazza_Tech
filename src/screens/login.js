import React, {Component} from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import {
  Alert,
  Image,
  TextInput,
  View,
  TouchableHighlight,
  Keyboard,
  StyleSheet,
  Text,
} from 'react-native';

import NetInfo from '@react-native-community/netinfo';

const technicianLoginCredentials = [
  {
    username: '1',
    password: '123',
  },
  {
    username: 'admin',
    password: 'admin',
  },
  {
    username: '!@V@ZZ@TECH',
    password: 'TECH456',
  },
];

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      connectionType: '',
      isConnected: false,
      splashScreenVisible: true,
    };
  }

  // Get Connection status
  async componentDidMount() {
    setTimeout(async => {
      this.setState({splashScreenVisible: false});
    }, 2000);
    this.unsubscribe = NetInfo.addEventListener(async state => {
      this.setState({
        connectionType: state.type,
        isConnected: state.isConnected,
      });
    });
  }

  async componentWillUnmount() {
    this.unsubscribe();
  }

  // Login Form Validation
  validateLogin = async () => {
    console.log(this.state);
    if (this.state.userName.length === 0 || this.state.password.length === 0) {
      Alert.alert('', 'Please Enter the Login details', [{text: 'Ok'}]);
    } else {
      if (
        this.state.connectionType === 'wifi' &&
        this.state.isConnected === true
      ) {
        let matchedLoginCredentials = technicianLoginCredentials.find(
          loginDetails =>
            loginDetails.username === this.state.userName &&
            loginDetails.password === this.state.password,
        );
        if (typeof matchedLoginCredentials !== 'undefined') {
          this.props.navigation.replace('technicianWindow');
        } else {
          Alert.alert('', 'Invalid technician login\nPlease try again...!', [
            {text: 'Ok'},
          ]);
        }
      } else {
        Alert.alert(
          '',
          'Check Your Wifi Connection with the lavazza caffè machine',
          [{text: 'Ok'}],
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.splashScreenVisible ? (
          <View style={styles.splashScreenLogoContainer}>
            <Image
              style={styles.splashScreenLogo}
              source={require('../../assets/lavazza_logo.png')}
            />
          </View>
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.loginScreenContainer}>
                <Image
                  style={styles.logoStyleInModal}
                  source={require('../../assets/lavazza_logo_without_year.png')}
                />
              </View>
              <View style={styles.loginScreenContainer}>
                <Text style={styles.loginTextStyle}>Technician Login</Text>
                <TextInput
                  style={styles.textInput}
                  selectionColor="#100A45"
                  maxLength={15}
                  placeholder="Username"
                  onSubmitEditing={() => {
                    this.password.focus();
                  }}
                  blurOnSubmit={false}
                  fontSize={responsiveScreenFontSize(1.5)}
                  onChangeText={username => (this.state.userName = username)}
                />
                <TextInput
                  style={styles.textInput}
                  selectionColor="#100A45"
                  secureTextEntry={true}
                  maxLength={15}
                  ref={input => {
                    this.password = input;
                  }}
                  placeholder="Password"
                  fontSize={responsiveScreenFontSize(1.5)}
                  onChangeText={password => (this.state.password = password)}
                />
              </View>
              <View style={styles.loginScreenContainer}>
                <TouchableHighlight
                  underlayColor="#100A45"
                  style={styles.loginButtonStyle}
                  onPress={() => {
                    Keyboard.dismiss();
                    this.validateLogin();
                  }}>
                  <Text style={styles.buttonTextStyle}>Login</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashScreenLogoContainer: {
    flex: 1,
    height: responsiveScreenHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashScreenLogo: {
    width: responsiveScreenWidth(50),
    height: '100%',
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    margin: '10%',
    backgroundColor: 'white',
    borderRadius: responsiveScreenWidth(5),
    borderColor: '#100A45',
    borderWidth: responsiveScreenWidth(0.5),
    paddingLeft: responsiveScreenWidth(5),
    paddingRight: responsiveScreenWidth(5),
    paddingBottom: responsiveScreenWidth(5),
    paddingTop: responsiveScreenWidth(2),
  },
  loginScreenContainer: {
    marginTop: '7%',
    alignItems: 'center',
  },
  logoStyleInModal: {
    width: responsiveScreenWidth(25),
    height: responsiveScreenHeight(4),
    resizeMode: 'contain',
  },
  loginTextStyle: {
    color: '#100A45',
    fontSize: responsiveScreenFontSize(1.5),
    fontWeight: 'bold',
  },
  textInput: {
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(50),
    textAlign: 'center',
    color: '#100A45',
    borderColor: 'gray',
    borderWidth: responsiveScreenWidth(0.1),
    borderRadius: responsiveScreenWidth(2),
    backgroundColor: '#EBEBEB',
    marginTop: '5%',
  },
  loginButtonStyle: {
    width: responsiveScreenWidth(25),
    height: responsiveScreenHeight(5),
    borderRadius: responsiveScreenHeight(1),
    backgroundColor: '#100A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: responsiveScreenFontSize(1.5),
  },
});
