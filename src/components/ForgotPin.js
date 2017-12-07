import React, {Component} from 'react';
import {View,Image,Text,CheckBox,TouchableOpacity,ScrollView,Keyboard, Dimensions} from 'react-native';
import {CustomInput,renderIf,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
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


    

     onSignIn() {
        
         if (!this.state.phoneNumber || isNaN(this.state.phoneNumber) || this.state.phoneNumber.length !== Config.limiters.mobileLength) {
            this.setState({message: 'Enter a valid Mobile Number'}, () => {
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);

            });
        } else {
            Axios({
                method: 'post',
                url: Config.routes.base + Config.routes.loginRoute,
                data: {
                    userName: Number(this.state.userName),
                     phone: Number(this.state.phoneNumber),
                    password: this.state.password
                }
            }).then((response) => {
                if (response.data.status) {
                    this.storeNumber(this.state.phoneNumber);
                    
                    Actions.currentorder();
                } else {
                    this.setState({message: response.data.message}, () => {
                        ToastAndroid.show(this.state.message, ToastAndroid.SHORT);
                    });
                }
            }).catch((error) => {
                console.log('login post error--->', error)
            })
        }
    }
   

 render() {
        const {
            viewStyle,
            loginbuttonStyle,
            signInButtonStyle,
            containerStyle,
            sendTextStyle,
            cancelTextStyle,
            inputStyle,
            imageStyle,
            text,
            backgroundImage,
            actionStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;

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
                <View style={viewStyle}>

                    <CustomText style={text}>
                               Forgot Password ?
                            </CustomText>
                 
                    <View style={{flex:1,alignSelf:'stretch',justifyContent:'center'}}>
                         <View style={containerStyle}>
                             <View style={{flexDirection:'column',alignSelf:'stretch',alignItems:'flex-start'}}>
                                <Text style={phonelabelStyle} >
                                    Mobile Number
                                </Text>  
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputTextStyle={inputStyle}
                                    value={this.state.phoneNumber}
                                    onChangeText={(value) => {
                                                    this.setState({phoneNumber: value,phoneNumberlbl:true})
                                                }}
                                />
                            </View>
                            <View style={checkForgotStyle}>
                               
                                     <TouchableOpacity style={actionStyle}  onPress={() => {
                                                                Keyboard.dismiss();
                                                                Actions.pop();
                                                                setTimeout(()=> Actions.refresh(), 500)
                                                            }}>
                                        <CustomText customTextStyle={cancelTextStyle}>
                                            CANCEL
                                        </CustomText>   
                                     </TouchableOpacity> 
                                   
                                    <TouchableOpacity style={actionStyle}>
                                        <CustomText customTextStyle={sendTextStyle}>
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
        justifyContent: 'flex-start',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10,
        
    },
    containerStyle: {
        backgroundColor: '#ffffff',
        marginTop: 60,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft:10,
        paddingRight:10,
        justifyContent: 'space-around',
        alignItems:'flex-start',
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


    forgotTextStyle: {
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
    },
    cancelTextStyle :{
        textAlign: 'right',
        color: '#1e4495',
        padding: 5
    },

    sendTextStyle :{
        textAlign: 'right',
        color: '#e83a13',
        padding: 5
    },


    inputStyle: {
        marginTop:3,
        backgroundColor: 'transparent'
    },
    text: {
        flex:1,
        alignItems:'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    },

    actionStyle:{
        paddingLeft:5,

    },
    checkForgotStyle:{
        alignItems:'stretch',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        alignSelf:'flex-end',
        justifyContent:'space-between'
    },
    checkboxStyle:{
        color: '#3B3B3B',
    }  

};

export default ForgotPin;