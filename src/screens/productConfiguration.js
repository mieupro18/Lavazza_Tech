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
import {commonStyles} from '../utilities/commonStyleSheet';

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

  // Send save product request to server
  saveProductDetails = async () => {
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
      <SafeAreaView style={commonStyles.mainContainer}>
        <View style={commonStyles.headerContainer}>
          <Image
            style={commonStyles.logoStyleInHeader}
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
            <View style={commonStyles.spinnerContainer}>
              <Spinner color="#100A45" size={30} />
              <Text style={commonStyles.spinnerTextStyle}>
                Loading...{'\n'}Please Wait!
              </Text>
            </View>
          ) : this.state.deviceProductInfo !== null ? (
            <View style={{}}>
              <Card style={commonStyles.card}>
                <CardItem header style={commonStyles.cardHeader}>
                  <Text style={commonStyles.cardHeaderTextStyle}>
                    Products Info
                  </Text>
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
                        style={commonStyles.buttonStyle}
                        onPress={async () => {
                          this.setState({isEditProducts: true});
                        }}>
                        <Icon
                          name="create-outline"
                          style={commonStyles.buttonIconStyle}
                        />
                        <Text
                          uppercase={false}
                          style={commonStyles.buttonTextStyle}>
                          Edit
                        </Text>
                      </Button>
                    ) : (
                      <View style={commonStyles.buttonContainer}>
                        <Button
                          rounded
                          iconLeft
                          style={commonStyles.cancelButtonStyle}
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
                            style={commonStyles.cancelButtonIconStyle}
                          />
                          <Text
                            uppercase={false}
                            style={commonStyles.cancelButtonTextStyle}>
                            Cancel
                          </Text>
                        </Button>
                        <Button
                          rounded
                          iconLeft
                          style={commonStyles.buttonStyle}
                          onPress={() => {
                            this.saveProductDetails();
                          }}>
                          <Icon
                            name="checkmark-circle"
                            style={commonStyles.buttonIconStyle}
                          />
                          <Text
                            uppercase={false}
                            style={commonStyles.buttonTextStyle}>
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
                  await this.fetchProductData();
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

export default ConfigurationScreen;

const styles = StyleSheet.create({
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
});
