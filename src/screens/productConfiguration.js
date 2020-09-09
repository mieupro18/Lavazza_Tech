import React from 'react';
import {
  Form,
  Item,
  Label,
  Card,
  CardItem,
  Text,
  Body,
  Button,
  Picker,
  Spinner,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  Alert,
  Image,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {SERVER_URL, TOKEN} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';

class ConfigurationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [
        'Cappuccino',
        'Espresso',
        'South Indian Coffee Light',
        'South Indian Coffee Strong',
        'Tea Water',
        'Lemon Tea',
        'Tea Milk',
        'Hot Milk',
        'Ristretto',
        'Black Coffee',
        'Caffe Latte',
        'Macchiato',
        'Green Tea',
        'Badam Milk',
        'Hot Water',
        'Black Tea',
        'Horlicks',
        'Hot Chocolate',
        'Filter Coffee',
        'Boiled Tea',
        'Soup',
        'Tomato Soup',
        'Vegetable Soup',
        'Mug Smoodle',
        'Cup Noodles',
        'Corn Flakes',
        'Sugarless Cereals',
        'Steam',
        'NONE',
      ],
      isEditProducts: false,
      selectedIndex: '',
      deviceProductInfo: '',
      isProductDataFetching: false,
    };
  }

  async componentDidMount() {
    await this.fetchProductData();
  }

  setStateToInitialState = async () => {
    this.setState({
      selectedIndex: '',
      deviceProductInfo: '',
      isProductDataFetching: false,
    });
  };

  // Fetch All products Information
  fetchProductData = async () => {
    this.setState({isProductDataFetching: true, deviceProductInfo: ''});
    fetch(SERVER_URL + '/techapp/productInfo', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        console.log(this.props.navigation.isFocused());
        if (resultData.status === 'Success') {
          console.log('resultData', resultData);
          this.setState({deviceProductInfo: resultData.data});
          console.log(this.state.deviceProductInfo);
          for (var key in this.state.deviceProductInfo) {
            this.state[key] = this.state.deviceProductInfo[key];
          }
          console.log('state', this.state);
        }
        this.setState({isProductDataFetching: false});
      })
      .catch(async e => {
        this.setState({isProductDataFetching: false});
      });
  };

  // Send Edit product request to server
  editProducts = async () => {
    var isInvalidConfiguration = false;

    Object.keys(this.state.deviceProductInfo).map(productKey => {
      if (
        this.state[productKey] === '' ||
        this.state[productKey] === undefined
      ) {
        isInvalidConfiguration = true;
      }
    });

    if (!isInvalidConfiguration) {
      let configuredProductValues = [];
      Object.keys(this.state.deviceProductInfo).map(productKey => {
        configuredProductValues.push(this.state[productKey]);
      });
      var uniqueProducts = [...new Set(configuredProductValues)];

      if (uniqueProducts.length !== 8) {
        Alert.alert(
          'Duplicate Configuration',
          'Please remove duplicate configuration',
          [
            {
              text: 'Close',
            },
          ],
          {cancelable: true},
        );
      } else {
        var configuredProductData = {};
        Object.keys(this.state.deviceProductInfo).map((productKey, index) => {
          configuredProductData[
            'Product' + Number(index + 1).toString()
          ] = this.state[productKey];
        });

        // POST New Product Configure Data
        fetch(SERVER_URL + '/techapp/configureProductInfo', {
          method: 'POST',
          headers: {
            tokenId: TOKEN,
            'Content-Type': 'application/json',
          },
          signal: (await getTimeoutSignal(5000)).signal,
          body: JSON.stringify({
            data: configuredProductData,
          }),
        })
          .then(response => response.json())
          .then(async resultData => {
            if (resultData.status === 'Success') {
              this.setState({
                deviceProductInfo: configuredProductData,
                isEditProducts: false,
              });

              Object.keys(this.state.deviceProductInfo).map(
                async productKey => {
                  this.setState({[productKey]: ''});
                },
              );

              ToastAndroid.showWithGravityAndOffset(
                'Success:  ' + resultData.infoText,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
            } else {
              Object.keys(this.state.deviceProductInfo).map(
                async productKey => {
                  this.setState({[productKey]: ''});
                },
              );

              ToastAndroid.showWithGravityAndOffset(
                'Failed:  ' + resultData.infoText,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
            }
          })
          .catch(e => {
            ToastAndroid.showWithGravityAndOffset(
              'Error:  ' + e,
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          });
      }
    } else {
      Alert.alert(
        'Invalid Configuration',
        'Please Configure All the Parameters',
        [
          {
            text: 'Close',
            onPress: () => console.log('Ask me later pressed'),
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
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={async () => {
                if (this.state.isEditProducts === false) {
                  await this.setStateToInitialState();
                  await this.fetchProductData();
                }
              }}
            />
          }>
          {this.state.isProductDataFetching === true ? (
            <View style={styles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={styles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : this.state.deviceProductInfo !== '' ? (
            <View style={{}}>
              <Card style={styles.card}>
                <CardItem header style={styles.cardHeader}>
                  <Text style={styles.cardHeaderTextStyle}>Product Info</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    {Object.keys(this.state.deviceProductInfo).map(
                      (productKey, index) => {
                        console.log('init', productKey, index);
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              padding: 2,
                              width: '95%',
                              flex: 1,
                              flexWrap: 'wrap',
                              flexGrow: 1,
                            }}>
                            {this.state.isEditProducts === true ? (
                              <Form style={{width: '100%'}}>
                                <Item
                                  picker
                                  style={{
                                    width: '100%',
                                    marginLeft: 15,
                                    marginTop: '2%',
                                  }}>
                                  <Label
                                    style={{
                                      color: '#100A45',
                                      fontWeight: 'bold',
                                      fontSize: 15,
                                    }}>
                                    {productKey}
                                  </Label>

                                  <Picker
                                    placeholder="Select Product"
                                    placeholderStyle={{color: '#bfc6ea'}}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state[productKey]}
                                    onValueChange={async value => {
                                      this.setState({
                                        [productKey]: value,
                                      });
                                      console.log(this.state);
                                      let selectedProducts = [];

                                      Object.keys(
                                        this.state.deviceProductInfo,
                                      ).map((productKey, index) => {
                                        console.log(this.state[productKey]);
                                        if (
                                          this.state[productKey] !==
                                            undefined &&
                                          this.state[productKey] !== ''
                                        ) {
                                          selectedProducts.push(
                                            this.state[productKey],
                                          );
                                        }
                                      });

                                      let uniqueProducts = [
                                        ...new Set(selectedProducts),
                                      ];

                                      if (
                                        uniqueProducts.length <
                                        selectedProducts.length
                                      ) {
                                        if (this.state[productKey] !== 'NONE') {
                                          console.log(
                                            'select',
                                            selectedProducts,
                                          );
                                          this.setState({
                                            [productKey]: this.state
                                              .deviceProductInfo[productKey],
                                          });
                                          Alert.alert(
                                            'Invalid Configuration',
                                            'Already configured',
                                            [
                                              {
                                                text: 'Close',
                                              },
                                            ],
                                            {cancelable: true},
                                          );
                                        }
                                      }
                                    }}>
                                    <Picker.Item
                                      label="---Select Product---"
                                      value=""
                                    />

                                    {this.state.allProducts.map(
                                      (product, index) => {
                                        return (
                                          <Picker.Item
                                            label={product}
                                            value={product}
                                          />
                                        );
                                      },
                                    )}
                                  </Picker>
                                </Item>
                              </Form>
                            ) : (
                              [
                                <Grid>
                                  <Row style={{padding: 5, marginTop: '2%'}}>
                                    <Col>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          fontWeight: 'bold',
                                          color: '#100A45',
                                        }}>
                                        {productKey}
                                      </Text>
                                    </Col>
                                    <Col>
                                      <Text style={{fontSize: 15}}>
                                        {this.state.deviceProductInfo[
                                          productKey
                                        ] === null
                                          ? 'Not Set'
                                          : this.state.deviceProductInfo[
                                              productKey
                                            ]}
                                      </Text>
                                    </Col>
                                  </Row>
                                </Grid>,
                              ]
                            )}
                          </View>
                        );
                      },
                    )}

                    {this.state.isEditProducts === false ? (
                      <View style={styles.editButtonContainer}>
                        <Button
                          rounded
                          style={styles.editButtonStyle}
                          onPress={async () => {
                            this.setState({isEditProducts: true});
                          }}>
                          <Text style={styles.editButtonTextStyle}>Edit</Text>
                        </Button>
                      </View>
                    ) : (
                      <View style={styles.buttonContainer}>
                        <Button
                          rounded
                          style={styles.cancelButtonStyle}
                          onPress={async () => {
                            this.setState({isEditProducts: false});
                            for (var key in this.state.deviceProductInfo) {
                              this.setState({
                                [key]: this.state.deviceProductInfo[key],
                              });
                            }
                          }}>
                          <Text style={styles.cancelButtonTextStyle}>
                            Cancel
                          </Text>
                        </Button>
                        <Button
                          rounded
                          style={styles.submitButtonStyle}
                          onPress={() => {
                            this.editProducts();
                          }}>
                          <Text style={styles.submitButtonTextStyle}>
                            Submit
                          </Text>
                        </Button>
                      </View>
                    )}
                  </Body>
                </CardItem>
              </Card>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Entypo
                name="warning"
                style={styles.warningImageStyle}
                onPress={() => {
                  this.setState({
                    modalVisible: !this.state.modalVisible,
                  });
                }}
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
                  await this.fetchProductData();
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

export default ConfigurationScreen;

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
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  editButtonContainer: {
    width: '100%',
  },
  editButtonStyle: {
    justifyContent: 'center',
    marginTop: 25,
    width: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 5,
    backgroundColor: '#100A45',
  },
  editButtonTextStyle: {fontSize: 14, color: '#fff'},
  cancelButtonStyle: {
    justifyContent: 'space-around',
    width: '40%',
    marginBottom: 30,
    marginTop: 20,
    backgroundColor: '#f1f2f6',
  },
  cancelButtonTextStyle: {color: '#000'},
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
  warningImageStyle: {color: '#CECDCB', marginTop: '10%'},
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
