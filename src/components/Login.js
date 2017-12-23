import React, {Component} from 'react';
import {View,Image,AsyncStorage,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import CustomStyles from './common/CustomStyles';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,
    renderIf,
    CustomEditText,
    CustomButton,
    CustomText,
    CommonBackground } from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';
import Axios from 'axios';

class Login extends Component{
     state = {};
    
    constructor(props) {
        super(props);
        this.state = {
            userName: '',phoneNumber: '', password: '', message: '',userNamelbl:false,
            phoneNumberlbl:false,isFocused: false,passwordlbl:false,rememberme:false
        };
    }

 
    componentWillMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
       SplashScreen.hide();   
       this.checkOutForRememberme();
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
       
    }
    componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
     Actions.pop();
     //var value = await this.getCache('credientails');
    }

    async checkOutForRememberme(){
       await this.getCache('credientails');
    }


    async getCache(key){
        try{
            console.log('login-riyaz',key);
            var value = await AsyncStorage.getItem('credientails');
            console.log('credientails',key);
            if (value !== null){
                var egObj = {};
                egObj = JSON.parse(value);
               this.setState({userName:egObj.userName,userNamelbl:true,rememberme:true});
              } else {
                console.log('value',value)
              }

            return value.json();
        }
        catch(e){
            console.log('riyaz');
            console.log('caught error', e);
            // Handle exceptions
        }
    
    }

    
     onSignIn() {
        const self = this;
        if (this.state.userName.length < Config.limiters.userNameLength)
         {
               return ToastAndroid.show('Enter a UserName', ToastAndroid.SHORT);
        }
         if (this.state.phoneNumber.length < Config.limiters.mobileLength) {
            
            return ToastAndroid.show('Enter a valid Mobile Number', ToastAndroid.SHORT);
        }  
        if (this.state.password.length < 4) {
              return  ToastAndroid.show('Enter valid password', ToastAndroid.SHORT);
        } 
            Axios({
                method: 'post',
                url: Config.routes.base + Config.routes.loginRoute,
                data: {
                    userName: this.state.userName,
                    password: this.state.password,
                    contactPhone: this.state.phoneNumber
                }
            }).then((response) => {
                console.log("messages",response.data.messages);
                console.log("response",response.data);
                if (response.data.status) {
                    //console.log("response.data",response.data);
                    this.storeData(response.data);
                    Actions.root();
                } else {
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                  
                }
            }).catch((error) => {
                console.log('login post error--->', error)
            })
        
    }

    getUserToken() {
        ToastAndroid.show('wrong', ToastAndroid.SHORT);
        
        AsyncStorage.getItem('advaitha:usertoken', (err, token) => {
            console.log('asdfasdfasdfgad',err,token);
            if (err) {
                ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Some', ToastAndroid.SHORT);
                
                callback(token);
            }
        });
    }


    async  storeData(data){
        console.log('in store data',data);
        var easyGaadi = {
            token:data.token,
        userName : data.userName,
        gpsEnabled:data.gpsEnabled,
        erpEnabled : data.erpEnabled,
        loadEnabled : data.loadEnabled,
        editAccounts :data.editAccounts
        }
        try {
            await AsyncStorage.setItem('credientails',JSON.stringify(easyGaadi));
            console.log('easyGaadi',);
        } catch (error) {
            console.log('something went wrong');
        }
    }

    
   

 render() {
        const {
            signInTextStyle,
            loginlogoImage,
        } = styles;


        const namelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.userNamelbl ? 18 : 0,
                  fontSize: ! this.state.userNamelbl ? 16 : 14,
                  color: ! this.state.userNamelbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }

        const passwordlabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.passwordlbl ? 18 : 0,
                  fontSize: ! this.state.passwordlbl ? 16 : 14,
                  color: ! this.state.passwordlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }
        
        const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.phoneNumberlbl ? 18 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 16 : 14,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }                


        return (
            <CommonBackground>
                <View style={CustomStyles.loginViewStyle}>

                    <CustomText style={CustomStyles.logintext}>
                               Login
                            </CustomText>
                 <ScrollView >
                    <View style={CustomStyles.loginContainerStyle}>
                    
                        <View style={CustomStyles.loginlogoStyle}>
                            <Image source={require('../images/logo_icon.png')} style= {loginlogoImage}/>
                        </View>
                         
                         <View style={CustomStyles.loginInputbox}>
                                <Text style={namelabelStyle} >
                                        UserName
                                </Text>
                            
                            <CustomEditText
                                maxLength={Config.limiters.mobileLength}
                                keyboardType='default'
                                inputTextStyle={CustomStyles.loginInputStyle}
                                value={this.state.userName}
                                onChangeText={(value) => {
                                                this.setState({userName: value,userNamelbl:true})
                                            }}
                            />
                            </View>
                            <View style={CustomStyles.loginInputbox}>
                                <Text style={phonelabelStyle} >
                                    Mobile Number
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputTextStyle={CustomStyles.loginInputStyle}
                                    value={this.state.phoneNumber}
                                    onChangeText={(value) => {
                                                    this.setState({phoneNumber: value,phoneNumberlbl:true})
                                                }}
                                />
                            </View>
                            <View style={CustomStyles.loginInputbox}>
                                <Text style={passwordlabelStyle} >
                                    Password
                                </Text> 
                                <CustomEditText
                                    secureTextEntry
                                    inputTextStyle={CustomStyles.loginInputStyle}
                                    value={this.state.password}
                                    onChangeText={(value) => {
                                        this.setState({password: value,passwordlbl:true})
                                    }}
                                />
                            </View>

                             
                            <View style={CustomStyles.loginCheckForgotStyle}>
                                <View>
                                     <CheckBox 
                                          label='Remember Me'
                                           color={'#000000'}
                                          checked={this.state.rememberme}
                                            onChange={() => this.setState({ rememberme: !this.state.rememberme })}
                                        />
                                </View>
                                <View >     
                                    <TouchableOpacity onPress={() => {
                                                                Keyboard.dismiss();
                                                                Actions.ForgotPin();
                                                            }}>
                                        <CustomText customTextStyle={CustomStyles.loginForgotTextStyle}>
                                            Forgot Password?
                                        </CustomText>   
                                     </TouchableOpacity>
                                </View>     
                        </View>
                         <View style={CustomStyles.loginbuttonStyle}>   
                            <CustomButton
                                customButtonStyle={CustomStyles.loginInbutton}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    this.onSignIn()
                                }}
                            >
                                <CustomText
                                    customTextStyle={CustomStyles.loginInbuttonText}
                                >
                                    LOGIN
                                </CustomText>
                            </CustomButton>
                        </View>   
                    </View>
                </ScrollView>
                 </View>   
             </CommonBackground>   
        );
    }
}
const winW = Dimensions.get('window').width;
const winH = Dimensions.get('window').width;
const styles = {
    loginlogoImage: {
        width:winW - 100,
        height:50,
        resizeMode: 'contain'
   }
};

export default Login;