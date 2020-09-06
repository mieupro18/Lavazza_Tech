import React, { Component } from 'react';

import { View, Text, Alert, Image, ToastAndroid, BackHandler, StyleSheet } from 'react-native';
import SERVERIP from '../Utilities/serverip';

import {
    Body,
    Card,
    CardItem,
    Button,
    Form,
    Label,
    Input,
    Item, 
    Picker,
    Spinner
  } from 'native-base';
import {Row, Col, Grid} from 'react-native-easy-grid';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';



class DeviceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          showToast:false,
          isEditDeviceInfo:false,
          deviceType:'',
          deviceName:'',
          deviceId:'',
          connectionType:'',
          isConnected:false,
          deviceData:'',
          isDeviceDataFetching:false
         }
    }

    // Check Network connection info
    async componentDidMount(){

      
  
          await this.fetchDeviceData();
        }

        // Fetching Device Details
    fetchDeviceData = async() =>{
      
      await this.setState({isDeviceDataFetching:true});
        fetch(SERVERIP+'/techapp/deviceInfo',{
        headers:{
          tokenId:'secret'
        }

      })
      .then((response)=> response.json())
      .then(async(resultData)=>{
        console.log("fetch:",resultData);
        console.log(this.props.navigation.isFocused());

        if(resultData['status']==='Success'){
          await this.setState({deviceData:resultData['data']});
        }
        await this.setState({isDeviceDataFetching:false});
        
      })
      .catch(async(e)=>{
        await this.setState({isDeviceDataFetching:false});
        
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

    // Send Device Reboot request
    reboot = async () =>{
        fetch(SERVERIP+'/techapp/reboot',{
        
        headers:{
          tokenId:'secret',
        }
      })
      .then((response)=> response.json())
      .then(async(resultData)=>{
        if(resultData.status === 'Success'){
          ToastAndroid.showWithGravityAndOffset(
            "Reboot Initiated",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
          );
          BackHandler.exitApp()
        }
        else if(resultData.status === 'Failure'){
          if(resultData.infoText === 'config error'){
          ToastAndroid.showWithGravityAndOffset(
            "Reboot Failed. Please configure all parameters",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
          );
          }
        }

      })
      .catch(e =>{
        console.log(e);
      })
    }



    // Post Product Info
    submitDeviceDetails = async() =>{
      if(this.state.deviceName!=='' && this.state.deviceId!=='' && this.state.deviceType!==''){

      // fetch("http://192.168.5.1:9876/techapp/configureDeviceInfo",{
        fetch(SERVERIP+"/techapp/configureDeviceInfo",{
        
        method:'POST',
        headers:{
          tokenId:'secret',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({data:{

          deviceName:this.state.deviceName,
          deviceId:this.state.deviceId,
          deviceType:this.state.deviceType
          
        }
          })})
        .then((response)=> response.json())
        .then(async(resultData)=>{

          if(resultData['status']==='Success'){
            var newConfigureData = {}

            newConfigureData['deviceName']=this.state.deviceName,
            newConfigureData['deviceId'] = this.state.deviceId,
            newConfigureData['deviceType'] = this.state.deviceType
            newConfigureData['allDeviceTypes'] = this.state.deviceData.allDeviceTypes

            await this.setState({deviceData:newConfigureData, deviceName:'', deviceId:'', deviceType:'', isEditDeviceInfo:false});
            ToastAndroid.showWithGravityAndOffset(
              "Success:  "+resultData['infoText'],
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50
            );
          }
          else{

            await this.setState({deviceName:'', deviceId:'', deviceType:'', isEditDeviceInfo:false});

            ToastAndroid.showWithGravityAndOffset(
              "Failed:  "+resultData['infoText'],
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50
            );

          }
        })
        .catch( async e=>{
          await this.setState({deviceName:'', deviceId:'', deviceType:'', isEditDeviceInfo:false});
          alert(e)
        })
    
    }
    else{
      Alert.alert(
        'Field are missing',
        'All Fields are required.',
        [
          {
            text: 'Close',
          }
        ],
        { cancelable: true }
      );
    }
    }
    render() { 
        return ( 
            <View style={{}}>                    
                      <View style={{backgroundColor: '#100A45',
    height: responsiveScreenHeight(7),
    alignItems: 'center',
    justifyContent: 'center',}}>
        <Image
          style={{width: responsiveScreenWidth(50),
            height: responsiveScreenHeight(5),
            resizeMode: 'contain',}}
          source={require('../assets/lavazza_white_logo.png')}
        />
      </View>
                    
                    {this.state.isDeviceDataFetching===true?(
                      <View style={{justifyContent:'center', marginLeft:'auto', marginRight:'auto'}}>
                            <Spinner color='#182c61'>

                            </Spinner>
                            <Text style={{textAlign:'center'}}>Loading... Please Wait!</Text>
                            </View>

                    ):(

                      this.state.deviceData!==''?(
        // <View  >
          <Card
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              // height:300
              
              
            }}>
            <CardItem header style={{justifyContent: 'center',backgroundColor:'#182C61'}}>
              <Text style={{fontSize: 20, color:'#fff'}}>Device Info</Text>
            </CardItem>
            {this.state.isEditDeviceInfo===false?(
          <CardItem>
             <View style={{flex: 1, flexDirection: 'column'}}>
               <View style={{flexDirection:'row'}}>
        <View style={{width: '50%'}} ><Text style={{fontSize:18,fontWeight:'bold'}}>Device Id</Text></View>
        <View style={{width: '50%'}} ><Text>{this.state.deviceData.deviceId===null?("Not Set"):(this.state.deviceData.deviceId)}</Text></View>
        </View>
        <View style={{flexDirection:'row'}}>
        <View style={{width: '50%'}} ><Text style={{fontSize:18,fontWeight:'bold'}}>Device Name</Text></View>
        <View style={{width: '50%'}} ><Text>{this.state.deviceData.deviceName===null?("Not Set"):(this.state.deviceData.deviceName)}</Text></View>
        </View>
        <View style={{flexDirection:'row'}}>
        <View style={{width: '50%'}} ><Text style={{fontSize:18,fontWeight:'bold'}}>Device Type</Text></View>
        <View style={{width: '50%'}} ><Text>{this.state.deviceData.deviceType===null?("Not Set"):(this.state.deviceData.deviceType)}</Text></View>
        </View>
                          <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>

                  <Button
                             onPress={()=>{this.reboot()}}
                             style={{
                              justifyContent:'center',
                              width:'40%',
                              marginTop:25,
                              marginRight: 'auto',
                              marginLeft:'auto',
                              backgroundColor:'red',
                              borderRadius:100
        
                            }}>
                               <Text style={{marginLeft: 5, color:'#fff'}}>Reboot</Text></Button>

                 <Button
            
                    rounded
                    style={{
                      justifyContent: 'center',
                      marginTop:25,
                      width: '40%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: 5,
                      backgroundColor:'#182c61'

                    }}

                  onPress={async()=>{await this.setState({isEditDeviceInfo:true})}}
                    >
                     <Text style={{marginLeft: 5, color:'#fff'}}>Edit Details</Text>
                   </Button>
               
                   </View>

        </View>
        </CardItem>
                  ):(
                    <CardItem style={{flexDirection:'column',alignItems:'flex-start'}}>
              
                <Form style={{width: '100%'}}>
                  <Item >
                    <Label>Device Id</Label>
                    <Input name='deviceId' onChangeText={async(value)=>{await this.setState({deviceId:value})}}/>
                  </Item>
                  <Item >
                    <Label>Device Name</Label>
                    <Input name='deviceName' onChangeText={async(value)=>{await this.setState({deviceName:value})}} />
                  </Item>
<Item>
<Label>Device Type</Label>
                  <Picker
              note
              mode="dropdown"
              style={{ width: 120 }}
              selectedValue={this.state.deviceType}
              onValueChange={async(value)=>{
                await this.setState({deviceType:value})
              }}
            >

              <Picker.Item label="---Select Type---" value="" />
              {this.state.deviceData.allDeviceTypes.map((type)=>{
                return <Picker.Item label={type} value={type} />
              })}

              
            </Picker>
            </Item>
            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
<Button
                    rounded
                    style={{
                      justifyContent:'space-around',
                      width:'40%',
                      marginBottom: 30,
                      marginTop:20,
                      backgroundColor:'#f1f2f6'

                    }}
                    
                    onPress = {async()=>{await this.setState({isEditDeviceInfo:false, deviceName:'', deviceId:'', deviceType:''})}}
                    
                    >
                    <Text style={{marginLeft: 5, color:'#000'}}>Cancel</Text>
                  </Button>
<Button
                    rounded
                    style={{
                      justifyContent:'space-around',
                      width:'40%',
                      marginBottom: 30,
                      marginTop:20,
                      backgroundColor:'#182C61'

                    }}

                    onPress={()=>{this.submitDeviceDetails()}}
                    >

                    <Text style={{color:'#fff'}}>Submit</Text>
                  </Button>
                  </View>
                </Form>
              
                  </CardItem>

                  )}
          </Card>

        // </View>
        ):(
          <View style={{marginLeft:'auto', marginRight:'auto'}}>
          <Image
          style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
          source={require('../warning.png')}
          />

          <Text style={{textAlign:'center'}}>Something Went Wrong...! Please Try Again</Text>
          </View>

        )
                    )
        }

            </View>
         );
    }
}
 
export default DeviceInfo;
