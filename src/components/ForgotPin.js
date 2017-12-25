import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ToastAndroid,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import {CustomInput,renderIf,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CustomStyles from './common/CustomStyles';
import {Actions} from 'react-native-router-flux';

class ForgotPin extends Component{
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
        Actions.pop();
    }

    onBackAndroid() {
     Actions.pop();
    }

    

     onSignIn() {
        
         if (!this.state.phoneNumber || isNaN(this.state.phoneNumber) || this.state.phoneNumber.length !== Config.limiters.mobileLength) {
            this.setState({message: 'Enter a valid Mobile Number'}, () => {
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);

            });
        } else {
             if(this.state.phoneNumber.length == 10){
                this.setState({message: 'Message has been sent to mobile number'});
                    ToastAndroid.show(this.state.message, ToastAndroid.SHORT);
                    Actions.pop();
            }else{
                this.setState({message: ' Please enter Mobile nmuber'});
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);
            }
        }
    }

    

 render() {
        
         const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  top: ! this.state.phoneNumberlbl ? 18 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 20 : 14,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                  padding:3
                }   
        return (
            <CommonBackground>
                <View style={CustomStyles.forgotviewStyle}>

                    <CustomText style={CustomStyles.forgottext}>
                               Forgot Password ?
                            </CustomText>
                 
                    <View style={CustomStyles.forgotMainContainer}>
                         <View style={CustomStyles.forgotcontainerStyle}>
                             <View style={CustomStyles.forgotInputBox}>
                                <Text style={phonelabelStyle} >
                                    Mobile Number
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputTextStyle={CustomStyles.forgotInputStyle}
                                    value={this.state.phoneNumber}
                                    onChangeText={(value) => {
                                                    this.setState({phoneNumber: value,phoneNumberlbl:true})
                                                }}
                                />
                            </View>
                            <View style={CustomStyles.forgotActionView}>
                               
                                     <TouchableOpacity style={CustomStyles.forgotActionpadding}  onPress={() => {
                                                                Keyboard.dismiss();
                                                                Actions.pop();
                                                            }}>
                                        <CustomText customTextStyle={CustomStyles.forgotcancelTextStyle}>
                                            CANCEL
                                        </CustomText>   
                                     </TouchableOpacity> 
                                   
                                    <TouchableOpacity style={CustomStyles.forgotActionpadding} onPress={() => {
                                                                Keyboard.dismiss();
                                                                Actions.OtpVerification();
                                                            }}>
                                        <CustomText customTextStyle={CustomStyles.forgotsendTextStyle}>
                                            SEND
                                        </CustomText>   
                                     </TouchableOpacity>
                                   
                            </View>
                        </View>
                    </View>
                 </View>   
             </CommonBackground>   
        );
    }
}



export default ForgotPin;