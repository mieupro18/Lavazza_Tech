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
  Icon,
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
import {SERVER_URL, TOKEN, SUCCESS} from '../utilities/macros';
import getTimeoutSignal from '../utilities/commonApis';

class ConfigurationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: null,
      isEditProducts: false,
      selectedIndex: null,
      deviceProductInfo: null,
      isLoading: false,
    };
  }

  async componentDidMount() {
    await this.fetchProductData();
  }

  setStateToInitialState = async () => {
    for (var key in this.state.deviceProductInfo) {
      await this.setState({[key]: null});
    }
    this.setState({
      selectedIndex: null,
      deviceProductInfo: null,
      isLoading: false,
      allProducts: null,
      numberOfProducts: null,
    });
  };

  // Fetch All products Information
  fetchProductData = async () => {
    this.setState({isLoading: true});
    fetch(SERVER_URL + '/techapp/productInfo', {
      headers: {
        tokenId: TOKEN,
      },
      signal: (await getTimeoutSignal(5000)).signal,
    })
      .then(response => response.json())
      .then(async resultData => {
        console.log(this.props.navigation.isFocused());
        if (resultData.status === SUCCESS) {
          console.log('resultData', resultData);
          this.setState({
            deviceProductInfo: resultData.data,
            allProducts: resultData.allProducts,
          });
          this.setState({
            numberOfProducts: (await Object.keys(this.state.deviceProductInfo))
              .length,
          });
          console.log(this.state.deviceProductInfo);
          for (var key in this.state.deviceProductInfo) {
            await this.setState({[key]: this.state.deviceProductInfo[key]});
          }
          console.log('state', this.state);
        }
        this.setState({isLoading: false});
      })
      .catch(async e => {
        this.setState({isLoading: false});
      });
  };

  // Send Edit product request to server
  editProducts = async () => {
    var isInvalidConfiguration = false;

    Object.keys(this.state.deviceProductInfo).map(productKey => {
      if (
        this.state[productKey] === '' ||
        this.state[productKey] === null ||
        this.state[productKey] === undefined
      ) {
        isInvalidConfiguration = true;
      }
    });

    if (!isInvalidConfiguration) {
      var configuredProductData = {};
      Object.keys(this.state.deviceProductInfo).map((productKey, index) => {
        configuredProductData[productKey] = this.state[productKey];
      });
      this.setState({isLoading: true});
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
          if (resultData.status === SUCCESS) {
            this.setState({
              deviceProductInfo: configuredProductData,
              isEditProducts: false,
            });

            ToastAndroid.showWithGravityAndOffset(
              'Success:  ' + resultData.infoText,
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            Object.keys(this.state.deviceProductInfo).map(async productKey => {
              this.setState({
                [productKey]: this.state.deviceProductInfo[productKey],
                isEditProducts: false,
              });
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
          Object.keys(this.state.deviceProductInfo).map(async productKey => {
            this.setState({
              [productKey]: this.state.deviceProductInfo[productKey],
              isEditProducts: false,
            });
          });
          this.setState({isLoading: false, isEditProducts: false});
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
          {this.state.isLoading === true ? (
            <View style={styles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={styles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : this.state.deviceProductInfo !== null ? (
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
                          <View style={styles.bodyViewContainer}>
                            {this.state.isEditProducts === true ? (
                              <Form style={styles.formStyle}>
                                <Item picker style={styles.formItemStyle}>
                                  <Label style={styles.formLableStyle}>
                                    {productKey}
                                  </Label>

                                  <Picker
                                    mode="dropdown"
                                    placeholder="Select Product"
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state[productKey]}
                                    onValueChange={async value => {
                                      console.log('value', value);
                                      console.log(productKey);
                                      await this.setState({
                                        [productKey]: value,
                                      });
                                      console.log(this.state);
                                      let selectedProducts = [];

                                      Object.keys(
                                        this.state.deviceProductInfo,
                                      ).map(
                                        (
                                          productKeyLocalScope,
                                          productKeyindex,
                                        ) => {
                                          console.log(
                                            this.state[productKeyLocalScope],
                                            productKeyindex,
                                          );
                                          if (
                                            this.state[productKeyLocalScope] !==
                                              undefined &&
                                            this.state[productKeyLocalScope] !==
                                              null &&
                                            this.state[productKeyLocalScope] !==
                                              '' &&
                                            this.state[productKeyLocalScope] !==
                                              'NONE'
                                          ) {
                                            selectedProducts.push(
                                              this.state[productKeyLocalScope],
                                            );
                                          }
                                        },
                                      );
                                      console.log(
                                        'selected products',
                                        selectedProducts,
                                      );

                                      let uniqueProducts = [
                                        ...new Set(selectedProducts),
                                      ];

                                      if (
                                        uniqueProducts.length <
                                        selectedProducts.length
                                      ) {
                                        console.log('select', selectedProducts);
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
                                    }}>
                                    <Picker.Item
                                      label="---Select Product---"
                                      value=""
                                    />

                                    {this.state.allProducts.map(
                                      (product, dropDownValueIndex) => {
                                        return (
                                          <Picker.Item
                                            key={dropDownValueIndex}
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
                                  <Row style={styles.rowStyle}>
                                    <Col>
                                      <Text style={styles.columnKeyStyle}>
                                        {productKey}
                                      </Text>
                                    </Col>
                                    <Col>
                                      <Text style={styles.columnValueStyle}>
                                        {this.state.deviceProductInfo[
                                          productKey
                                        ] === null
                                          ? '---Not Set---'
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
                      <Button
                        rounded
                        iconLeft
                        style={styles.buttonStyle}
                        onPress={async () => {
                          this.setState({isEditProducts: true});
                        }}>
                        <Icon
                          name="create-outline"
                          style={styles.buttonIconStyle}
                        />
                        <Text uppercase={false} style={styles.buttonTextStyle}>
                          Edit
                        </Text>
                      </Button>
                    ) : (
                      <View style={styles.buttonContainer}>
                        <Button
                          rounded
                          iconLeft
                          style={styles.cancelButtonStyle}
                          onPress={async () => {
                            this.setState({isEditProducts: false});
                            for (var key in this.state.deviceProductInfo) {
                              this.setState({
                                [key]: this.state.deviceProductInfo[key],
                              });
                            }
                          }}>
                          <Icon
                            name="close-circle"
                            style={styles.cancelButtonIconStyle}
                          />
                          <Text
                            uppercase={false}
                            style={styles.cancelButtonTextStyle}>
                            Cancel
                          </Text>
                        </Button>
                        <Button
                          rounded
                          iconLeft
                          style={styles.buttonStyle}
                          onPress={() => {
                            this.editProducts();
                          }}>
                          <Icon
                            name="checkmark-circle"
                            style={styles.buttonIconStyle}
                          />
                          <Text
                            uppercase={false}
                            style={styles.buttonTextStyle}>
                            Save
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
    borderRadius: 10,
  },
  cardHeaderTextStyle: {
    fontSize: responsiveScreenFontSize(2),
    fontWeight: 'bold',
    color: '#fff',
  },
  rowStyle: {padding: responsiveScreenHeight(1), marginTop: '2%'},
  columnKeyStyle: {
    fontSize: responsiveScreenFontSize(1.8),
    fontWeight: 'bold',
    color: '#100A45',
  },
  columnValueStyle: {fontSize: responsiveScreenFontSize(1.8)},
  bodyViewContainer: {
    flexDirection: 'row',
    padding: 2,
    width: '95%',
    flex: 1,
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  formStyle: {width: '100%'},
  formItemStyle: {
    width: '100%',
    marginLeft: responsiveScreenWidth(1.5),
    marginTop: '2%',
  },
  formLableStyle: {
    color: '#100A45',
    fontWeight: 'bold',
    fontSize: responsiveScreenFontSize(1.8),
  },
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
  cancelButtonIconStyle: {marginLeft: 'auto', color: '#000'},
  cancelButtonStyle: {
    justifyContent: 'center',
    width: '40%',
    marginTop: '5%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#f1f2f6',
  },
  cancelButtonTextStyle: {color: '#000', fontSize: responsiveScreenFontSize(2)},
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
