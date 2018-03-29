import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import {CustomInput,CSpinner,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CustomStyles from './common/CustomStyles';
import Axios from 'axios';
import Utils from './common/Utils';
class ForgotPin extends Component{
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

    callForgotPasswordAPI(Url,mobile){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'post',
            url: Url,
            data: {
                contactPhone: this.state.phoneNumber
            }
        })
            .then((response) => {
                console.log(Url,'<--forgotPassword ==>', response.data);
                if (response.data.status) {
                    
                    self.setState({ spinnerBool:false });
                    this.props.navigation.navigate('Otpverification',{mobile:this.state.phoneNumber});
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    Utils.ShowMessage(message);
                } else {
                   // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool:false });
                    Utils.ShowMessage(response.data.messages);
                }
            }).catch((error) => {
                console.log('error in forgotPassword ==>', error);
                if (error.response.status === 504 ) {
                   this.setState({ spinnerBool: false });
                   alert("Something went Wrong.Please try after some time");
                 }
            })
    }
   
    getOtpNUmber() {
         if (!this.state.phoneNumber || isNaN(this.state.phoneNumber) || this.state.phoneNumber.length !== Config.limiters.mobileLength) {
                Utils.ShowMessage('Please Enter  Mobile Number');
        } else {
             if(this.state.phoneNumber.length == 10){
                    Utils.ShowMessage(this.state.phoneNumber);
                    this.callForgotPasswordAPI(Config.routes.base + Config.routes.forgotPassword,this.state.phoneNumber);
            }else{
                this.setState({message: ' Please Enter 10 digits Mobile nmuber'});
                Utils.ShowMessage(this.state.message);
            }
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }

    /* componentWillReceiveProps(nextProps){
        if(nextProps.close){
            //Actions.pop();
        }
    } */
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
                            {this.spinnerLoad()}
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
                                                                //Actions.pop();
                                                            }}>
                                        <CustomText customTextStyle={CustomStyles.forgotcancelTextStyle}>
                                            CANCEL
                                        </CustomText>   
                                     </TouchableOpacity> 
                                   
                                    <TouchableOpacity style={CustomStyles.forgotActionpadding} onPress={() => {
                                                                Keyboard.dismiss();
                                                                this.getOtpNUmber();
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