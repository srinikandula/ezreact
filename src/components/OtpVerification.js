import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler,ToastAndroid} from 'react-native';
import {CustomInput,renderIf,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import {Actions} from 'react-native-router-flux';
import CustomStyles from './common/CustomStyles';

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
                    Actions.ResetPassword();
            }else{
                this.setState({message: ' OTP does not match'});
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);
            }
        }
    }
   
 render() {

         const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.phoneNumberlbl ? 18 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 20 : 14,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                  padding:3,
                  alignSelf:'stretch'
                }   
        return (
            <CommonBackground>
                <View style={CustomStyles.otpViewStyle}>
                    <View style={CustomStyles.otpMainContainer}>
                        <CustomText style={CustomStyles.otpMessagetext}>
                            OTP sent to your mobile number
                        </CustomText>
                         <View style={CustomStyles.otpContainerStyle}>
                             <View style={CustomStyles.otpInputBox}>
                                <Text style={phonelabelStyle} >
                                    Enter Code
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.otpLength}
                                    keyboardType='numeric'
                                    inputTextStyle={CustomStyles.otpInputStyle}
                                    value={this.state.phoneNumber}
                                    onChangeText={(value) => {
                                                    this.setState({phoneNumber: value,phoneNumberlbl:true})
                                                }}
                                />
                            </View>
                            <View style={[CustomStyles.forgotActionView,{ alignSelf:'center'}]}>
                                     <CustomButton
                                            customButtonStyle={CustomStyles.otpButtonStyle}
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                this.onVerifyOTP()
                                            }}
                                        >
                                            <CustomText
                                                customTextStyle={CustomStyles.otpVerifyTextStyle}
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


export default OtpVerification;