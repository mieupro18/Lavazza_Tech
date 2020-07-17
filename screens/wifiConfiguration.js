import React, { Component } from 'react';

import { View, Text, Image, ToastAndroid } from 'react-native';

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
import NetInfo from '@react-native-community/netinfo';
class WifiInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditWifiInfo: false,
            deviceType: '',
            connectionType:'',
            isConnected:false,
            token:'hai',
            wifiInfo:'',
            password:'',
            isWifiScreenLoading:false
        }
    }
    async componentDidMount(){
        const networkConnectionInfo = NetInfo.addEventListener(async state => {
    
          await this.setState({connectionType:state.type, isConnected:state.isConnected});
    
          console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected);

          await this.fetchWifiData();
        });
      }


      fetchWifiData = async() =>{
        console.log(this.state);
  
        if(this.state.token!=='' && this.state.token!==null){
  
        
        fetch('https://0732ad524106.ngrok.io/techapp/wifiInfo',{
          headers:{
  
            tokenId:'secret'
          }
  
        })
        .then((response)=> response.json())
        .then(async(resultData)=>{
          console.log(resultData);
          if(resultData['status']==='Success'){
              
            await this.setState({wifiInfo:resultData['data'], isWifiScreenLoading:false});
  
          }
          
        })
        .catch(async(e)=>{
          alert(e);
          await this.setState({isWifiScreenLoading:false})
        })
      }
      }
  
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

      submitWifiDetails = async() =>{

        if(this.state.ssid!=='' && this.state.password!==''){
            fetch('https://0732ad524106.ngrok.io/techapp/configureWifiInfo',{
                method:'POST',
                headers:{
                    "tokenId":'secret',
                    "Content-Type":"application/json"

                },
                body:JSON.stringify({
                    data:{
                        ssid:this.state.ssid,
                        password:this.state.password
                    }
                })

            })
            .then(response => response.json())
            .then(async(resultData)=>{
                console.log(resultData);
                if(resultData['status']==='Success'){

                    let newConfiguredData = {};
                    newConfiguredData['ssid']= this.state.ssid;
                    newConfiguredData['password'] = this.state.password;

                    await this.setState({wifiInfo:newConfiguredData, ssid:'', password:'', isEditWifiInfo:false});

                    ToastAndroid.showWithGravityAndOffset(
                        "Success:  "+resultData['infoText'],
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                        25,
                        50
                      );

                }
                else{

                    await this.setState({ssid:'', password:'', isEditWifiInfo:false});

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
    render() {
        return (
            <View>
                {this.state.isWifiScreenLoading===true?(
                    <Spinner color='blue'/>

                ):(


                (this.state.connectionType !== 'wifi' && this.state.isConnected!==true) ? (
                    <View>
                    <Image
                    style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
                    source={require('../warning.png')}
                    />

                    <Text style={{textAlign:'center'}}>Check Your Wifi Connection</Text>
                    </View>
                ) : (

                                    
                         <View style={{}}>
                        
                            {this.state.isEditWifiInfo === false ? (
                                this.state.wifiInfo!==""?(
                                    <Card
                            style={{
                                width: '90%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}>
                            <CardItem header style={{ justifyContent: 'center', backgroundColor: '#182C61' }}>
                                <Text style={{ fontSize: 20, color: '#fff' }}>Wifi Info</Text>
                            </CardItem>

                                <CardItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SSID</Text>
                                        <Text style={{ fontSize: 20 }}>{this.state.wifiInfo.ssid===null?('Not Set'):(this.state.wifiInfo.ssid)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
                                        <Text style={{ fontSize: 20 }}>{this.state.wifiInfo.password===null?('Not Set'):(this.state.wifiInfo.password)}</Text>
                                    </View>

                                    <Button
                                        rounded
                                        style={{
                                            justifyContent: 'center',
                                            marginTop: 15,
                                            width: '40%',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            marginBottom: 5,
                                            backgroundColor: '#182c61'

                                        }}

                                        onPress={async () => { await this.setState({ isEditWifiInfo: true }) }}



                                    >
                                        <Text style={{ marginLeft: 'auto', color: '#fff' }}>Edit Details</Text>
                                    </Button>




                                </CardItem>
                                </Card>
                                ):( 

                                    <View>
                                    <Image
                                    style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
                                    source={require('../warning.png')}
                                    />
                            
                                    <Text style={{textAlign:'center'}}>Something Went Wrong...! Please Try Again</Text>
                                    </View>
                                )
                            ) : (
                                <Card
                                style={{
                                    width: '90%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}>
                                    <CardItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>

                                        <Form style={{ width: '100%' }}>
                                            <Item >
                                                <Label>SSID</Label>
                                                <Input name='ssid' onChangeText={async (value) => { await this.setState({ ssid: value }) }} />
                                            </Item>

                                            <Item >
                                                <Label>Password</Label>
                                                <Input name='ssid' onChangeText={async (value) => { await this.setState({ password: value }) }} />
                                            </Item>

                                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                                <Button
                                                    rounded
                                                    style={{
                                                        justifyContent: 'center',
                                                        width: '40%',
                                                        marginBottom: 30,
                                                        marginTop: 20,
                                                        backgroundColor: '#f1f2f6'

                                                    }}

                                                    onPress={async () => { await this.setState({ isEditWifiInfo: false }) }}

                                                >
                                                    <Text style={{ marginLeft: 'auto', color: '#000' }}>Cancel</Text>
                                                </Button>
                                                <Button
                                                    rounded
                                                    style={{
                                                        justifyContent: 'center',
                                                        width: '40%',
                                                        marginBottom: 30,
                                                        marginTop: 20,
                                                        backgroundColor: '#182C61'

                                                    }}

                                                    onPress={()=>{this.submitWifiDetails()}}

                                                >
                                                    <Text style={{ color: '#fff' }}>Submit</Text>
                                                </Button>
                                            </View>
                                        </Form>

                                    </CardItem>
                                    </Card>

                                )}

                    </View>
                ))}

            </View>
        );
    }
}

export default WifiInfo;