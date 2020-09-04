import React from 'react';
import {View, SafeAreaView, ScrollView, TouchableOpacity,ToastAndroid, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SERVERIP from '../Utilities/serverip';
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
  Spinner

} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';


class ConfigurationScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            allProducts:[
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
                'NONE'],


            isEditProducts:false,

            selectedIndex:'',

            deviceProductInfo:'',

            isProductDataFetching:false
        };
      }

      async componentDidMount(){
          await this.fetchProductData()
      }

      // Fetch All products Information
      fetchProductData = async() =>{   
        await this.setState({isProductDataFetching:true});  
          fetch(SERVERIP+'/techapp/productInfo',{
          headers:{
            tokenId:'secret'
          }
  
        })
        .then((response)=> response.json())
        .then(async(resultData)=>{
          console.log(this.props.navigation.isFocused());
          if(resultData['status']==='Success'){
            await this.setState({deviceProductInfo:resultData['data']});
          }
          await this.setState({isProductDataFetching:false});
          
        })
        .catch(async(e)=>{
          await this.setState({isProductDataFetching:false});
          if(this.props.navigation.isFocused()){
            alert(e)
            // ToastAndroid.showWithGravityAndOffset(
            //   e,
            //   ToastAndroid.LONG,
            //   ToastAndroid.CENTER,
            //   25,
            //   50
            // );
        }

        })

      }


// Send Edit product request to server
      editProducts = async() =>{
        var isInvalidConfiguration=false;

        Object.keys(this.state.deviceProductInfo).map((productKey)=>{
          if(this.state[productKey]==='' || this.state[productKey]=== undefined){
            isInvalidConfiguration=true;
          }

        })

        if(!isInvalidConfiguration){
          let configuredProductValues = []
            Object.keys(this.state.deviceProductInfo).map((productKey)=>{
              configuredProductValues.push(this.state[productKey]);
            })
            var uniqueProducts = [...new Set(configuredProductValues)]

            if(uniqueProducts.length !==8){
              Alert.alert(
                'Duplicate Configuration',
                'Please remove duplicate configuration',
                [
                  {
                    text: 'Close',
                  }
                ],
                { cancelable: true }
              );
            }
            else{

              var configuredProductData = {};
              Object.keys(this.state.deviceProductInfo).map((productKey, index)=>{
                configuredProductData['product'+ Number(index+1).toString()] = this.state[productKey];
              });

              // POST New Product Configure Data
              fetch(SERVERIP+'/techapp/configureProductInfo',{
                method:'POST',
                headers:{
                  tokenId:'secret',
                  "Content-Type":'application/json'
                },
                body:JSON.stringify({
                  data:configuredProductData
                })
              })
              .then(response => response.json())
              .then(async(resultData)=>{
                if(resultData['status']==='Success'){

                  await this.setState({deviceProductInfo:configuredProductData, isEditProducts:false});

                  Object.keys(this.state.deviceProductInfo).map(async(productKey)=>{
                    await this.setState({[productKey]:''});
                  })

                  ToastAndroid.showWithGravityAndOffset(
                    "Success:  "+resultData['infoText'],
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,
                    50
                  );

                }
                else{

                  Object.keys(this.state.deviceProductInfo).map(async(productKey)=>{
                    await this.setState({[productKey]:''});
                  });

                  ToastAndroid.showWithGravityAndOffset(
                    "Failed:  "+resultData['infoText'],
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,
                    50
                  );

                }
              })
              .catch((e)=>{
                ToastAndroid.showWithGravityAndOffset(
                  "Error:  "+e,
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50
                );
              })
            }
        }
        else{
          Alert.alert(
            'Invalid Configuration',
            'Please Configure All the Parameters',
            [
              {
                text: 'Close',
                onPress: () => console.log('Ask me later pressed')
              }
            ],
            { cancelable: true }
          );
        }
      }

  render() {
    return (
        <SafeAreaView>
        <ScrollView>
            {this.state.isProductDataFetching===true?(
              <View>
              <Spinner color='#182C61'>
                
              </Spinner>
              <Text style={{textAlign:'center'}}>Loading... Please wait!</Text>
              </View>
            ):(

            this.state.deviceProductInfo!==''?(
            <View style={{flex:1,}}>
        <View style={{}}>
          <Card
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <CardItem header style={{justifyContent: 'center' ,backgroundColor:'#182C61'}}>
              <Text style={{fontSize: 20, color:'#fff'}}>Product Configuration</Text>
            </CardItem>
            <CardItem>
              <Body>
                  {Object.keys(this.state.deviceProductInfo).map((productKey, index)=>{
                      return(
                        <View style={{flexDirection:'row', padding:2, width:'95%', flex:1, flexWrap:'wrap', flexGrow:1,}}>
                            {this.state.isEditProducts===true?(
                                                    <Form style={{width: '100%'}}>
                                                    <Item
                                                        picker
                                                        style={{width: '95%', marginLeft: 15}}>
                                                        <Label style={{color: 'blue', fontWeight: 'bold'}}>
                                                          {productKey}
                                                        </Label>
                                                        <Picker
                                                          mode="dropdown"
                                                          iosIcon={<Icon name="arrow-down" />}
                                    
                                                    placeholder="Select Product"
                                                          placeholderStyle={{color: '#bfc6ea'}}
                                                          placeholderIconColor="#007aff"
                                                          selectedValue={this.state[productKey]}
                                                          onValueChange={async value => {
                                                            await this.setState({[productKey]: value});

                                                            let selectedProducts = [];

                                                            Object.keys(this.state.deviceProductInfo).map((productKey,index)=>{
                                                                console.log(this.state[productKey]);
                                                                if(this.state[productKey]!==undefined && this.state[productKey]!=='' ){
                                                                    selectedProducts.push(this.state[productKey]);
                                                                }
                                                            })

                                                            let uniqueProducts = [...new Set(selectedProducts)]

                                                            if(uniqueProducts.length<selectedProducts.length){
                                                              await this.setState({[productKey]:''})
                                                              Alert.alert(
                                                                'Invalid Configuration',
                                                                'Please Configure All the Parameters',
                                                                [
                                                                  {
                                                                    text: 'Close',

                                                                  }
                                                                ],
                                                                { cancelable: true }
                                                              );
                                                            }

                                                          }}
                                    
                                                  >

                                                    
                                                    <Picker.Item label="---Select Product---" value="" />

                                                    {this.state.allProducts.map((product, index)=>{
                                                        return(<Picker.Item label={product} value={product} />)
                                                    })}

                                                        </Picker>
                                                      </Item>
                                                      </Form>
                            ):([
                              <Grid>
                              <Row style={{padding:5}}>
                    <Col ><Text style={{fontSize:18,fontWeight:'bold', color:'blue'}}>{productKey}</Text></Col>
                    <Col ><Text style={{ fontSize:16}}>{this.state.deviceProductInfo[productKey]}</Text></Col>
                    </Row>
                  </Grid>
                            
                            ])}
                        
                            </View>)
                  })}


                  {this.state.isEditProducts===true ?(null):(
                  <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>

<Button
                    rounded
                    style={{
                      
                      marginBottom: 30,
                      marginTop:20,
                      backgroundColor:'#182C61',
                      width:'65%',
                      justifyContent:'center'

                    }}
                    
                    onPress = {async()=>{await this.setState({isEditProducts:true})}}
                    
                    >
                    
                    <Text style={{}}>Edit Products</Text>
                  </Button>
                  </View>
                  )}

                    {this.state.isEditProducts==true?(
                  <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
<Button
                    rounded
                    style={{
                      
                      
                      marginBottom: 30,
                      marginTop:20,
                      backgroundColor:'#f1f2f6'

                    }}
                    
                    onPress = {async()=>{await this.setState({isEditProducts:false})}}
                    
                    >
                    <Text style={{marginLeft: 'auto', color:'#000'}}>Cancel</Text>
                  </Button>
<Button
                    rounded
                    style={{
                      
                      marginBottom: 30,
                      marginTop:20,
                      backgroundColor:'#182C61'

                    }}

                    onPress={()=>{this.editProducts()}}
                    >
                    <Text style={{marginLeft: 'auto'}}>Submit</Text>
                  </Button>
                  </View>
                  ):(null)}


              </Body>
            </CardItem>
          </Card>
        </View>
      </View>
      ):(

        <View>
        <Image
        style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
        source={require('../warning.png')}
        />

        <Text style={{textAlign:'center'}}>Something Went Wrong...! Please Try Again</Text>
        </View>
      )
            )

}
      </ScrollView>
      </SafeAreaView>

    );
  }
}


  

export default ConfigurationScreen;
