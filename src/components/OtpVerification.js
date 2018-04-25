import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import {CustomInput,CSpinner,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CustomStyles from './common/CustomStyles';
import Axios from 'axios';
import Utils from './common/Utils';
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
    }
 
    onVerifyOTP() {
            if (!this.state.phoneNumber || isNaN(this.state.phoneNumber) || this.state.phoneNumber.length !== Config.limiters.otpLength) {       
                Utils.ShowMessage('Enter a 6 digits OTP Number');
        } else {
            if(this.state.phoneNumber.length == Config.limiters.otpLength){
                this.callOtpVerfiyAPI(Config.routes.base + Config.routes.OtpVerfication,this.state.phoneNumber);
                    //Actions.POP();-OtpVerfication
            }else{
                Utils.ShowMessage('Enter a 6 digits OTP Number');
            }
        }
    }

    callOtpVerfiyAPI(Url,otpNumber){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'post',
            url: Url,
            data: {
                contactPhone: this.props.navigation.state.params.mobile,
                otp:otpNumber
            }
        })
            .then((response) => {
                console.log(Url,'<--verify-otp ==>', response.data);
                if (response.data.status) {
                    
                    self.setState({ spinnerBool:false });
                    const { navigation } = this.props;
                    const { state } = navigation;
                    let refreshFunc = state.params.refresh;
                    if (typeof refreshFunc === 'function') {
                        refreshFunc({ refresh: true });
                    }
                    this.props.navigation.goBack();
                    let message ="";
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    Utils.ShowMessage(message);
                } else {
                    console.log('fail in verify-otp ==>', response);
                    self.setState({ spinnerBool:false });
                    let message ="";
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    Utils.ShowMessage(message);
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