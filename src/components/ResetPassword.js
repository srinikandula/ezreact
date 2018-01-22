import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler,ToastAndroid} from 'react-native';
import {CustomInput,renderIf,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CustomStyles from './common/CustomStyles';

class ResetPassword extends Component{
     state = {};

    constructor(props) {
        super(props);
        this.state = {
            password: '',cpassword: '', message: '',
            userNamelbl:false,
            cpasswordlbl:false,isFocused: false,
            passwordlbl:false,rememberme:false
        };
    }
 
    componentWillMount() {
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
    //  Actions.pop();`
    }

     onVerifyOTP() {
        
         if (this.state.password.length !== Config.limiters.otpLength) 
         {
            ToastAndroid.show('Enter Password', ToastAndroid.SHORT);

        } else
         {            
            if (this.state.cpassword.length !== Config.limiters.otpLength) 
            {
                    ToastAndroid.show('Enter Confirm Password', ToastAndroid.SHORT);
            }else
            {
                if(this.state.password == this.state.cpassword){
                        this.props.navigation.navigate('tab1')
                }else{
                    ToastAndroid.show(' Password does not match', ToastAndroid.SHORT);
                }
             }   
        }
    }
   

 render() {
         const passwordlabelStyle = {
                  position: 'absolute',
                  left: 0,
                 //  fontFamily:'Gotham-Light',
                  top: ! this.state.passwordlbl ? 18 : 0,
                  fontSize: ! this.state.passwordlbl ? 20 : 14,
                  color: ! this.state.passwordlbl ? '#aaa' : '#000',
                  padding:3
                }  

         const cpasswordlabelStyle = {
                  position: 'absolute',
                  left: 0,
                //   fontFamily:'Gotham-Light',
                  top: ! this.state.cpasswordlbl ? 18 : 0,
                  fontSize: ! this.state.cpasswordlbl ? 20 : 14,
                  color: ! this.state.cpasswordlbl ? '#aaa' : '#000',
                  padding:3
                }       


                 
        return (
            <CommonBackground>
                <View style={CustomStyles.resetPasswordviewStyle}>
                 
                    <View style={CustomStyles.resetPasswordconatiner}>
                        <CustomText style={CustomStyles.resetPasswordLabel}>
                               Reset Password
                            </CustomText>
                         <View style={CustomStyles.resetPasswordSubcontainer}>
                             <View style={CustomStyles.resetPasswordInputBox}>
                                <Text style={passwordlabelStyle} >
                                    Password
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.otpLength}
                                    keyboardType='numeric'
                                    inputTextStyle={CustomStyles.resetPasswordinputStyle}
                                    value={this.state.password}
                                    onChangeText={(value) => {
                                                    this.setState({password: value,passwordlbl:true})
                                                }}
                                />
                            </View>
                            <View style={CustomStyles.resetPasswordInputBox}>
                                <Text style={cpasswordlabelStyle} >
                                    Confirm Password
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.otpLength}
                                    keyboardType='numeric'
                                    inputTextStyle={CustomStyles.resetPasswordinputStyle}
                                    value={this.state.cpassword}
                                    onChangeText={(value) => {
                                                    this.setState({cpassword: value,cpasswordlbl:true})
                                                }}
                                />
                            </View>
                            <View style={CustomStyles.resetPasswordActionView}>                                   
                                     <CustomButton
                                            customButtonStyle={CustomStyles.resetPasswordButtonStyle}
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                this.onVerifyOTP()
                                            }}
                                        >
                                            <CustomText
                                                customTextStyle={CustomStyles.resetPasswordButtonTextStyle}
                                            >
                                                RESET
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

export default ResetPassword;