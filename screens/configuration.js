import React from 'react';
import {View, SafeAreaView, ScrollView, TouchableOpacity,ToastAndroid, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
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

import NetInfo from "@react-native-community/netinfo";

import AsyncStorage from '@react-native-community/async-storage';

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
                'Milk'],


            isEditProducts:false,

            selectedIndex:'',

            deviceProductInfo:'',
            connectionType:'',
            isConnected:false,

            isProductDataFetching:false
        };
      }

      async componentDidMount(){
        const metworkConnectionInfo = NetInfo.addEventListener(async state => {
    
          await this.setState({connectionType:state.type, isConnected:state.isConnected});
          await this.fetchProductData()
        });
      }

      // Fetch All products Information
      fetchProductData = async() =>{   
        await this.setState({isProductDataFetching:true});  
        fetch('http://192.168.5.1:9876/techapp/productInfo',{
          headers:{
            tokenId:'secret'
          }
  
        })
        .then((response)=> response.json())
        .then(async(resultData)=>{
          if(resultData['status']==='Success'){
            await this.setState({deviceProductInfo:resultData['data']});
          }
          await this.setState({isProductDataFetching:false});
          
        })
        .catch(async(e)=>{
          await this.setState({isProductDataFetching:false});
          alert(e);
        })

      }


      // Wifi connection failed
      networkConnectionFailed = ()=>{
        Alert.alert(
          'Network Failed',
          'Check Your Wifi Connection & Try Again',
          [
            {
              text: 'Close',
            }
          ],
          { cancelable: true }
        );
      }


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
                    onPress: () => console.log('Ask me later pressed')
                  }
                ],
                { cancelable: true }
              );

            }
            else{

              var configuredProductData = {};
              Object.keys(this.state.deviceProductInfo).map((productKey)=>{
                configuredProductData[productKey] = this.state[productKey];
              });

              // POST New Product Configure Data
              fetch('http://192.168.5.1:9876/techapp/configureProductInfo',{
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
                alert(e);
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
          {this.state.connectionType==='wifi' && this.state.isConnected===true ? (

            this.state.isProductDataFetching===true?(
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
                        <View style={{flexDirection:'row', padding:2, width:'95%'}}>
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
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{productKey}:</Text>,
                            <Text style={{ fontSize:19,flexWrap:'wrap', paddingLeft:10}}>{this.state.deviceProductInfo[productKey]}</Text>
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
                      justifyContent:'space-between'

                    }}
                    
                    onPress = {async()=>{await this.setState({isEditProducts:true})}}
                    
                    >
                    
                    <Text style={{marginLeft:3}}>Edit Products</Text>
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

):(
  <View>
                    <Image
                    style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
                    source={require('../warning.png')}
                    />

                    <Text style={{textAlign:'center'}}>Check Your Wifi Connection</Text>
                    </View>
)}
      </ScrollView>
      </SafeAreaView>

    );
  }
}


  

export default ConfigurationScreen;
