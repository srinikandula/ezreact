import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler,ToastAndroid} from 'react-native';
import {CustomInput,CSpinner,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import {Actions} from 'react-native-router-flux';
import CustomStyles from './common/CustomStyles';
import Axios from 'axios';

class OtpVerification extends Component{
     state = {userName: '',phoneNumber: '', password: '', message: '',userNamelbl:false,
           phoneNumberlbl:false,isFocused: false,
           passwordlbl:false,rememberme:false,
           spinnerBool: false};

    constructor(props) {
        super(props);
        this.state = {
            userNamelbl: false,
             phoneNumberlbl:false,
             passwordlbl:false,
             spinnerBool: false
        };
        console.log(this.props,'props');
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
                ToastAndroid.show('Enter a 6 digits OTP Number', ToastAndroid.SHORT);
        } else {
            if(this.state.phoneNumber.length == Config.limiters.otpLength){
                this.callOtpVerfiyAPI(Config.routes.base + Config.routes.OtpVerfication,this.state.phoneNumber);
                    //Actions.POP();-OtpVerfication
            }else{
                ToastAndroid.show('Enter a 6 digits OTP Number', ToastAndroid.SHORT);
            }
        }
    }

    callOtpVerfiyAPI(Url,otpNumber){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'post',
            url: 'http://192.168.1.41:3100/v1/group/verify-otp',//Url,
            data: {
                contactPhone: this.props.mobile,
                otp:otpNumber
            }
        })
            .then((response) => {
                console.log(Url,'<--verify-otp ==>', response.data);
                if (response.data.status) {
                    
                    self.setState({ spinnerBool:false });
                    Actions.pop({ refresh: { close: true }})
                    let message ="";
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                } else {
                    console.log('fail in verify-otp ==>', response);
                    self.setState({ spinnerBool:false });
                    let message ="";
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                }
            }).catch((error) => {
                console.log('error in verify-otp ==>', error);
            })
    }
    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }    
   
 render() {

         const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                //   fontFamily:'Gotham-Light',
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
                    {this.spinnerLoad()}
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