import React, { Component } from 'react';

import { View, Text, Alert, Image, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {

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
  import NetInfo from "@react-native-community/netinfo";



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
      const networkConnectionInfo = NetInfo.addEventListener(async state => {
        await this.setState({connectionType:state.type, isConnected:state.isConnected});
        await this.fetchDeviceData();
        });
        }

        // Fetching Device Details
    fetchDeviceData = async() =>{
      if(this.state.connectionType==='wifi' && this.state.isConnected===true){
      await this.setState({isDeviceDataFetching:true});
      fetch('http://192.168.5.1:9876/techapp/deviceInfo',{
        headers:{
          tokenId:'secret'
        }

      })
      .then((response)=> response.json())
      .then(async(resultData)=>{
        if(resultData['status']==='Success'){
          await this.setState({deviceData:resultData['data']});
        }
        await this.setState({isDeviceDataFetching:false});
        
      })
      .catch(async(e)=>{
        await this.setState({isDeviceDataFetching:false});
        alert(e);
      })
    }

    }

    // Send Device Reboot request
    reboot = async () =>{
      fetch('http://192.168.5.1:9876/techapp/reboot',{
        headers:{
          tokenId:'secret',
        }
      })
      .then((response)=> response.json())
      .then(async(resultData)=>{
        if(resultData.status === 'Success'){
          ToastAndroid.showWithGravityAndOffset(
            "Success:  "+resultData['infoText'],
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
          );
        }
      })
      .catch(e =>{
        alert(e)
      })
    }

    // Alert if network signal disconnected
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


    // Post Product Info
    submitDeviceDetails = async() =>{
      if(this.state.deviceName!=='' && this.state.deviceId!=='' && this.state.deviceType!==''){

      fetch("http://192.168.5.1:9876/techapp/configureDeviceInfo",{
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
            <View>
                    {this.state.connectionType!=='wifi' || this.state.isConnected!==true ?(
                      
                      <View>
                    <Image
                    style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
                    source={require('../warning.png')}
                    />

                    <Text style={{textAlign:'center'}}>Check Your Wifi Connection</Text>

                    </View>):(
                    
                    this.state.isDeviceDataFetching===true?(
                      <View>
                            <Spinner color='#182c61'>

                            </Spinner>
                            <Text style={{textAlign:'center'}}>Loading... Please Wait!</Text>
                            </View>

                    ):(

                      this.state.deviceData!==''?(
        <View style={{}}>
          <Card
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <CardItem header style={{justifyContent: 'center',backgroundColor:'#182C61'}}>
              <Text style={{fontSize: 20, color:'#fff'}}>Device Info</Text>
            </CardItem>
            {this.state.isEditDeviceInfo===false?(   
            <CardItem style={{flexDirection:'column',alignItems:'flex-start'}}>

                         <View style={{flexDirection:'row', justifyContent:'space-between', width:'95%'}}>
                  <Text style={{fontSize:20,fontWeight:'bold'}}>Device Id</Text>
            <Text style={{fontSize:18}}>{this.state.deviceData.deviceId===null?("Not Set"):(this.state.deviceData.deviceId)}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', width:'95%'}}>
                  <Text style={{fontSize:20,fontWeight:'bold'}}>Device Name</Text>
                  <Text style={{fontSize:18}}>{this.state.deviceData.deviceName===null?("Not Set"):(this.state.deviceData.deviceName)}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', width:'95%'}}>
                  <Text style={{fontSize:20,fontWeight:'bold'}}>Device Type</Text>
                  <Text style={{fontSize:20}}>{this.state.deviceData.deviceType === null?("Not Set"):(this.state.deviceData.deviceType)}</Text>
                </View>
                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>

                <Button
                            onPress={()=>{this.reboot()}}
                            style={{
                              justifyContent:'center',
                              width:'40%',
                              marginTop:15,
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
                      marginTop:15,
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
        )}

            </View>
         );
    }
}
 
export default DeviceInfo;