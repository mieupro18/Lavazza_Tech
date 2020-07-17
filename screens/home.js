import React from 'react';
// import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
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
  Picker
} from 'native-base';

  import AsyncStorage from '@react-native-community/async-storage';

  import WifiExample from './WifiExample';
class HomeScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
        };
      }

      async componentDidMount(){



      }

  render() {
    return (
<Container>
        <Content>
          <Card
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 100,
            }}>
            <CardItem header style={{justifyContent: 'center'}}>
              <Text style={{fontSize: 20}}>Select Company to Connect</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Form style={{width: '100%'}}>
                <Item
                    picker
                    style={{width: '95%', marginLeft: 15, marginTop: 20}}>
                    <Label style={{color: 'blue', fontWeight: 'bold'}}>
                      Select Company
                    </Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}

                placeholder="Select Trip Type"
                      placeholderStyle={{color: '#bfc6ea'}}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.selectedCompany}
                      onValueChange={async value => {
                        await this.setState({selectedCompany: value});
                      }}

              >
                <Picker.Item label="Infosys" value="INFOSYS" />
                      <Picker.Item label="Tcs" value="TCS" />
                      <Picker.Item label="Cts" value="CTS" />
                      <Picker.Item label="mieuPro" value="MIEUPRO" />
                      <Picker.Item label="Google" value="GOOGLE" />
                      <Picker.Item label="Amazon" value="AMAZON" />
                    </Picker>
                  </Item>

                  <Button
                    rounded
                    style={{
                      justifyContent: 'center',
                      marginTop: 40,
                      width: '80%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: 30,

                    }}
                    
                    onPress = {()=>{this.props.navigation.navigate('Configuration')}}
                    
                    >
                    <Text style={{marginLeft: 'auto'}}>Connect</Text>
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


  

export default HomeScreen;
