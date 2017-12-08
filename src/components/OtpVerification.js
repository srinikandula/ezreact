import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler,ToastAndroid} from 'react-native';
import {CustomInput,renderIf,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import {Actions} from 'react-native-router-flux';

class OtpVerification extends Component{
     state = {userName: '',phoneNumber: '', password: '', message: '',userNamelbl:false,
           phoneNumberlbl:false,isFocused: false,
           passwordlbl:false,rememberme:false};

    constructor(props) {
        super(props);
        this.state = {
            userNamelbl: false,
             phoneNumberlbl:false,
             passwordlbl:false,
        };
    }
 
    componentWillMount() {
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
     Actions.pop();
    }

     onVerifyOTP() {
        
         if (!this.state.phoneNumber || isNaN(this.state.phoneNumber) || this.state.phoneNumber.length !== Config.limiters.otpLength) {
            this.setState({message: 'Enter a 6 digits OTP Number'}, () => {
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);

            });
        } else {
            if(this.state.phoneNumber == 123456){
                this.setState({message: 'OTP verification done'});
                    ToastAndroid.show(this.state.message, ToastAndroid.SHORT);
                   
                    Actions.tab1();
            }else{
                this.setState({message: ' OTP does not match'});
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);
            }
        }
    }
   

 render() {
        const {
            viewStyle,
            loginbuttonStyle,
            signInButtonStyle,
            containerStyle,
            sendTextStyle,
            inputStyle,
            imageStyle,
            massagetext,
            backgroundImage,
            actionStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;

         const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                   fontFamily:'gothamlight',
                  top: ! this.state.phoneNumberlbl ? 18 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 20 : 14,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                  padding:3
                }   
        return (
            <CommonBackground>
                <View style={viewStyle}>
                 
                    <View style={{flex:1,alignSelf:'stretch',alignItems:'center',justifyContent:'center'}}>
                    <CustomText style={massagetext}>
                               OTP sent to your mobile number
                            </CustomText>
                         <View style={containerStyle}>
                             <View style={{flexDirection:'column',alignSelf:'stretch',alignItems:'center',justifyContent:'center'}}>
                                <Text style={phonelabelStyle} >
                                    Enter Code
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.otpLength}
                                    keyboardType='numeric'
                                    inputTextStyle={inputStyle}
                                    value={this.state.phoneNumber}
                                    onChangeText={(value) => {
                                                    this.setState({phoneNumber: value,phoneNumberlbl:true})
                                                }}
                                />
                            </View>
                            <View style={checkForgotStyle}>                                   
                                   
                                     <CustomButton
                                            customButtonStyle={signInButtonStyle}
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                this.onVerifyOTP()
                                            }}
                                        >
                                            <CustomText
                                                customTextStyle={sendTextStyle}
                                            >
                                                VERIFY
                                            </CustomText>
                                        </CustomButton>
                                   
                            </View>
                        </View>
                    </View>
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
        alignItems:'stretch',
        justifyContent: 'center',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10
        
    },
    containerStyle: {
        backgroundColor: '#ffffff',
        marginTop:5,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'center',
        alignItems:'center',
        alignSelf:'stretch'

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

    sendTextStyle :{
         fontFamily:'gothamlight',
        textAlign: 'center',
        color: '#e83a13',
        padding: 5
    },


    inputStyle: {
         fontFamily:'gothamlight',
        justifyContent:'center',
        marginTop:3,
        backgroundColor: 'transparent'
    },
    massagetext: {
        flex:1,
        alignItems:'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
         fontFamily:'gothamlight',
        fontSize: 32,
        margin:10
    },

    actionStyle:{
        alignSelf:'stretch',
        alignItems:'center',
        paddingLeft:5,

    },
    checkForgotStyle:{
        alignItems:'center',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        alignSelf:'stretch',
        justifyContent:'center'
    },
    checkboxStyle:{
        color: '#3B3B3B',
    }  

};

export default OtpVerification;