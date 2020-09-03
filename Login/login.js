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
  CheckBox,
  ListItem
  
} from 'native-base';

import { Alert, BackHandler, Image, View} from 'react-native';

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

// Get Connection status
  async componentDidMount(){
    const neworkConnectionInfo = NetInfo.addEventListener(async state => {
      await this.setState({connectionType:state.type, isConnected:state.isConnected});
    });

  }


// Logi Form Validation
  validateLogin =async()=>{
    console.log(this.state);
    if( (this.state.userName.length === 0) || (this.state.password.length === 0) ){
        alert("Please Enter the Login details");
    }
    else{
      if(this.state.connectionType==='wifi' && this.state.isConnected===true){

      
        if(this.state.userName==='admin' && this.state.password==='admin'){

          this.props.navigation.replace('LavAzza');
        }
        else{
          alert("Invalid Login... Please Try Again...!");
        }
      }
      else{
        alert("Check Your Wifi COnnection");
      }
      }
};



  render() {
    return (
      <Container>
        <Image source={require('../lavazza_logo.png')} style={{width:'80%', height:'30%', marginLeft:'auto', marginRight:'auto'}} />
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
                  <Item >
                    <Label>User Name</Label>
                    <Input name='userName' onChangeText={async(value)=>{await this.setState({userName:value})}}/>
                  </Item>
                  <Item >
                    <Label>Password</Label>
                    <Input name='password' type='password' secureTextEntry={true} onChangeText={async(value)=>{await this.setState({password:value})}} />
                  </Item>
                  {/* <ListItem>
            <CheckBox checked={false} />
            <Body>
              <Text>Show Password</Text>
            </Body>
          </ListItem> */}
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

      </Container>
    );
  }
}
