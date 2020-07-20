import React, {Component} from 'react';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Card,
  CardItem,
  Text,
  Body,
  Button,
  
} from 'native-base';

import { Alert, BackHandler, Image, View} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName:'',
      password:'',
      spinner:false,
      connectionType:'',
      isConnected:false
    };
  }

  async componentDidMount(){
    const unsubscribe = NetInfo.addEventListener(async state => {

      await this.setState({connectionType:state.type, isConnected:state.isConnected});

      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      console.log(this.state);
    });

    
    
    // AsyncStorage.getItem('token').then(async(value)=>{
    //   if(value !== null){
    //     await this.props.navigation.navigate('Home');
    //   }
    // });
  }



  validateLogin =async()=>{
    if( (this.state.userName.length === 0) || (this.state.password.length === 0) ){
        alert("Please Enter the Login details");
    }
    else{
        if(this.state.userName==='admin' && this.state.password==='admin'){

          AsyncStorage.setItem('lavazzaLoginToken', 'secret');
          this.props.navigation.navigate('Lavazza');
        }
        else{
          alert("Invalid Login... Please Try Again...!");
        }
            }
          
    
};



  render() {
    return (




      <Container>
        <Image source={require('../lavazza_logo.png')} style={{width:'80%', height:'30%', marginLeft:'auto', marginRight:'auto'}} />
        {this.state.connectionType==='wifi' && this.state.isConnected===true?(
        <Content>
          
          <Card
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 10,
            }}>
            <CardItem header style={{justifyContent: 'center'}}>
              <Text style={{fontSize: 22}}>Log In to Your Account</Text>
              
            </CardItem>
            <CardItem>
              <Body>
                <Form style={{width: '100%'}}>
                  <Item floatingLabel>
                    <Label>User Name</Label>
                    <Input name='userName' onChangeText={async(value)=>{await this.setState({userMail:value})}}/>
                  </Item>
                  <Item floatingLabel last>
                    <Label>Password</Label>
                    <Input name='password' onChangeText={async(value)=>{await this.setState({password:value})}} />
                  </Item>

                  <Button
                    rounded
                    onPress={() => {this.validateLogin()}}
                    style={{
                      justifyContent: 'center',
                      marginTop: 40,
                      width: '80%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: 30,
                      backgroundColor:'#182C61'
                    }}>
                    <Text style={{marginLeft: 'auto'}}>Log In</Text>
                  </Button>
                </Form>
              </Body>
            </CardItem>
          </Card>
        </Content>
        ):(
          <Content>

<View>
                    <Image
                    style={{width:80, height:80, marginLeft:'auto', marginRight:'auto', marginTop:100}}
                    source={require('../warning.png')}
                    />

                    <Text style={{textAlign:'center'}}>Check Your Wifi Connection</Text>
                    </View>
        
        </Content>)}
      </Container>
    );
  }
}
