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
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Image,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
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

  // Fetch All products Information
  fetchProductData = async () => {
    await this.setState({isProductDataFetching: true, deviceProductInfo: ''});
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
          await this.setState({deviceProductInfo: resultData.data});
          console.log(this.state.deviceProductInfo);
          for (var key in this.state.deviceProductInfo) {
            //this.state.deviceProductInfo.forEach((k,v)=>
            console.log(key, this.state.deviceProductInfo[key]);
            this.state[key] = this.state.deviceProductInfo[key];
          }
          //this.state[k]=v);
          //this.state(resultData[data]);
          console.log('state', this.state);
        }
        await this.setState({isProductDataFetching: false});
      })
      .catch(async e => {
        await this.setState({isProductDataFetching: false});
        if (this.props.navigation.isFocused()) {
          //alert(e)
          // ToastAndroid.showWithGravityAndOffset(
          //   e,
          //   ToastAndroid.LONG,
          //   ToastAndroid.CENTER,
          //   25,
          //   50
          // );
        }
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
              await this.setState({
                deviceProductInfo: configuredProductData,
                isEditProducts: false,
              });

              Object.keys(this.state.deviceProductInfo).map(
                async productKey => {
                  await this.setState({[productKey]: ''});
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
                  await this.setState({[productKey]: ''});
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
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#100A45',
            height: responsiveScreenHeight(7),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: responsiveScreenWidth(50),
              height: responsiveScreenHeight(5),
              resizeMode: 'contain',
            }}
            source={require('../../assets/lavazza_white_logo.png')}
          />
        </View>
        <ScrollView>
          {this.state.isProductDataFetching === true ? (
            <View>
              <Spinner color="#100A45" />
              <Text style={{textAlign: 'center'}}>Loading... Please wait!</Text>
            </View>
          ) : this.state.deviceProductInfo !== '' ? (
            <View style={{flex: 1}}>
              <View style={{}}>
                <Card
                  style={{
                    width: '90%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  <CardItem
                    header
                    style={{
                      justifyContent: 'center',
                      backgroundColor: '#100A45',
                      height: responsiveScreenHeight(3),
                      width: '50%',
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{fontSize: 14, fontWeight: 'bold', color: '#fff'}}
                      onPress={async () => {
                        if (this.state.isEditProducts === false) {
                          await this.fetchProductData();
                        }
                      }}>
                      Product Info
                    </Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      {Object.keys(this.state.deviceProductInfo).map(
                        (productKey, index) => {
                          //this.state[productKey] = this.state.deviceProductInfo[productKey];
                          //this.setState({[productKey]: this.state.deviceProductInfo[productKey]});
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
                                        //this.state[productKey] = value
                                        await this.setState({
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
                                          if (
                                            this.state[productKey] !== 'NONE'
                                          ) {
                                            console.log(
                                              'select',
                                              selectedProducts,
                                            );
                                            await this.setState({
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
                                          {
                                            this.state.deviceProductInfo[
                                              productKey
                                            ]
                                          }
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

                      {this.state.isEditProducts === true ? null : (
                        <View
                          style={{
                            //flexDirection: 'row',
                            width: '100%',
                            //justifyContent: 'space-around',
                          }}>
                          <Button
                            rounded
                            style={{
                              justifyContent: 'center',
                              marginTop: 25,
                              width: '30%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              marginBottom: 5,
                              backgroundColor: '#100A45',
                            }}
                            onPress={async () => {
                              await this.setState({isEditProducts: true});
                            }}>
                            <Text style={{fontSize: 14, color: '#fff'}}>
                              Edit
                            </Text>
                          </Button>
                        </View>
                      )}

                      {this.state.isEditProducts == true ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-around',
                          }}>
                          <Button
                            rounded
                            style={{
                              marginBottom: 30,
                              marginTop: 20,
                              width: '40%',
                              backgroundColor: '#f1f2f6',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={async () => {
                              await this.setState({isEditProducts: false});
                              for (var key in this.state.deviceProductInfo) {
                                this.setState({
                                  [key]: this.state.deviceProductInfo[key],
                                });
                              }
                            }}>
                            <Text style={{marginLeft: 'auto', color: '#000'}}>
                              Cancel
                            </Text>
                          </Button>
                          <Button
                            rounded
                            style={{
                              marginBottom: 30,
                              marginTop: 20,
                              width: '40%',
                              backgroundColor: '#100A45',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              this.editProducts();
                            }}>
                            <Text style={{marginLeft: 'auto'}}>Submit</Text>
                          </Button>
                        </View>
                      ) : null}
                    </Body>
                  </CardItem>
                </Card>
              </View>
            </View>
          ) : (
            <View
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                alignItems: 'center',
              }}>
              <Entypo
                name="warning"
                style={{color: '#CECDCB', marginTop: '10%'}}
                onPress={() => {
                  this.setState({
                    modalVisible: !this.state.modalVisible,
                  });
                }}
                size={responsiveScreenHeight(10)}
              />

              <Text style={{textAlign: 'center', fontSize: 14}}>
                Something Went Wrong...!
              </Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>
                Please check your wifi connection
              </Text>
              <TouchableHighlight
                underlayColor="#100A45"
                style={{
                  width: responsiveScreenWidth(25),
                  height: responsiveScreenHeight(5),
                  borderRadius: responsiveScreenHeight(1),
                  backgroundColor: '#100A45',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: responsiveScreenHeight(2),
                }}
                onPress={async () => {
                  await this.fetchProductData();
                  //Keyboard.dismiss();
                  //this.validateLogin();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveScreenFontSize(1.5),
                  }}>
                  Reload
                </Text>
              </TouchableHighlight>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default ConfigurationScreen;
