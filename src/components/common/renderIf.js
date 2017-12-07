export default function renderIf(condition, content) {
    if (condition) {
        return content;
    } else {
        return null;
    }
}

import React, {Component} from 'react';
import {View,Image,CheckBox,TouchableOpacity,ScrollView, Dimensions} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,FloatingLabelInput,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';

class Login extends Component{
     state = {userName: '',phoneNumber: '', password: '', message: '',userNamelbl:false,
           phoneNumberlbl:false,
           passwordlbl:false,rememberme:false};

    constructor(props) {
        super(props);
        this.state = {
            userNamelbl: false,
            isFocused:false
        };
    }


	componentWillMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
       SplashScreen.hide();
    }

    handleTextChange = (newText) => this.setState({ value: newText });
 render() {
        const {
            viewStyle,
            loginbuttonStyle,
            signInButtonStyle,
            containerStyle,
            signInTextStyle,
            forgotTextStyle,
            rememberTextStyle,
            inputStyle,
            imageStyle,
            text,
            backgroundImage,
            logoStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;
        return (
            <CommonBackground>
                <View style={viewStyle}>

                    <CustomText style={text}>
                               Login
                            </CustomText>
                 <ScrollView >
                    <View style={containerStyle}>
                    
                        <View style={logoStyle}>
                            <Image source={require('../images/logo_icon.png')} style= {backgroundImage}/>
                        </View>
                         
                            
                            <FloatingLabelInput
                                  label="UserName"
                                  value={this.state.UserName}
                                    keyboardType='default'
                                    inputTextStyle={inputStyle}
                                    onChangeText={(value) => {
                                                this.setState({userName: value})
                                            }}
                                />

                                <CustomText customTextStyle={rememberTextStyle} >
                                        UserName
                                </CustomText>
                            
                            <CustomEditText
                                maxLength={Config.limiters.mobileLength}
                                keyboardType='default'
                                placeholder='User Name'
                                inputTextStyle={inputStyle}
                                value={this.state.userName}
                                onChangeText={(value) => {
                                                this.setState({userName: value})
                                            }}
                            />
                            <CustomText customTextStyle={rememberTextStyle}>
                                    Password
                            </CustomText> 
                            <CustomEditText
                                secureTextEntry
                                placeholder='Password'
                                inputTextStyle={inputStyle}
                                value={this.state.password}
                                onChangeText={(value) => {
                                    this.setState({password: value})
                                }}
                            />
                             <CustomText customTextStyle={rememberTextStyle}>
                                    Mobile Number
                            </CustomText>  
                            <CustomEditText
                                maxLength={Config.limiters.mobileLength}
                                keyboardType='numeric'
                                placeholder='Mobile Number'
                                inputTextStyle={inputStyle}
                                value={this.state.phoneNumber}
                                onChangeText={(value) => {
                                                this.setState({phoneNumber: value})
                                            }}
                            />
                            
                            <View style={checkForgotStyle}>
                                <View >
                                    
                                     <CheckBox style={checkboxStyle}
                                          title='remember Me'
                                          checked={this.state.rememberme}
                                            onPress={() => this.setState({ rememberme: !this.state.rememberme })}
                                        />
                                </View>
                                <View >     
                                    <TouchableOpacity >
                                        <CustomText customTextStyle={forgotTextStyle}>
                                            Forgot Password?
                                        </CustomText>   
                                     </TouchableOpacity>
                                </View>     
                        </View>
                         <View style={loginbuttonStyle}>   
                            <CustomButton
                                customButtonStyle={signInButtonStyle}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    this.onSignIn()
                                }}
                            >
                                <CustomText
                                    customTextStyle={signInTextStyle}
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
	backgroundImage: {
         width:winW - 100,
         height:50,
         resizeMode: 'contain'
	},
    viewStyle: {
        flex:1,
        justifyContent: 'space-between',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10
        
    },
    containerStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 60,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'center',
        alignItems:'flex-start',

    },
    loginbuttonStyle:{
        alignSelf:'stretch',
        backgroundColor: '#d9d9d9',
        
    },
    signInButtonStyle: {
        alignSelf:'stretch',
        backgroundColor: '#ffffff',
        marginTop:1
    },
    signInTextStyle: {
         alignSelf:'stretch',
        textAlign: 'center',
         color: '#e83a13',
        fontSize: 14,
        padding: 10,
        backgroundColor:'#ffffff'
    },
    forgotTextStyle: {
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
    },
    inputStyle: {
        backgroundColor: 'transparent'
    },
    imageStyle: {
        width: 25,
        height: 30
    },
    text: {
        flex:1,
        alignItems:'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    },
    rememberTextStyle:{
        textAlign: 'center',
        color: '#3B3B3B',
        paddingTop: 2
    },
    logoStyle:{
        padding:20,
    },
    checkForgotStyle:{
        flex: 1,
        alignSelf:'stretch',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        justifyContent: 'space-between'
    },
    checkboxStyle:{
        color: '#3B3B3B',
    }
    
    

};

export default Login;