import React, {Component} from 'react';
import {View,Image,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,renderIf,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';

class Login extends Component{
     state = {userName: '',phoneNumber: '', password: '', message: '',userNamelbl:false,
           phoneNumberlbl:false,isFocused: false,passwordlbl:false,rememberme:false};

    constructor(props) {
        super(props);
        this.state = {
            userNamelbl: false,
             phoneNumberlbl:false,
             passwordlbl:false,
        };
    }


    componentWillMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
       SplashScreen.hide();
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
     Actions.pop();
    }

     onSignIn() {
        


        if (!this.state.userName || isNaN(this.state.userName) || this.state.userName.length >= Config.limiters.userNameLength)
         {
            this.setState({message: 'Enter a UserName'}, () => {
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);

            });
        }else if (!this.state.phoneNumber || isNaN(this.state.phoneNumber) || this.state.phoneNumber.length !== Config.limiters.mobileLength) {
            this.setState({message: 'Enter a valid Mobile Number'}, () => {
                ToastAndroid.show(this.state.message, ToastAndroid.SHORT);

            });
        } else if (!this.state.password) {
            this.setState({message: 'Enter valid password'}, () => {
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


        const namelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.userNamelbl ? 18 : 0,
                  fontSize: ! this.state.userNamelbl ? 20 : 14,
                  color: ! this.state.userNamelbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }

        const passwordlabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.passwordlbl ? 18 : 0,
                  fontSize: ! this.state.passwordlbl ? 20 : 14,
                  color: ! this.state.passwordlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }
        
        const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.phoneNumberlbl ? 18 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 20 : 14,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }                


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
                         
                         <View style={{flexDirection:'column',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={namelabelStyle} >
                                        UserName
                                </Text>
                            
                            <CustomEditText
                                maxLength={Config.limiters.mobileLength}
                                keyboardType='default'
                                inputTextStyle={inputStyle}
                                value={this.state.userName}
                                onChangeText={(value) => {
                                                this.setState({userName: value,userNamelbl:true})
                                            }}
                            />
                            </View>
                            <View style={{flexDirection:'column',alignSelf:'stretch',alignItems:'flex-start'}}>
                                <Text style={passwordlabelStyle} >
                                    Password
                                </Text> 
                                <CustomEditText
                                    secureTextEntry
                                    inputTextStyle={inputStyle}
                                    value={this.state.password}
                                    onChangeText={(value) => {
                                        this.setState({password: value}, ()=>{
                                            console.log(value.length);
                                            console.log(value.length);
                                            if(value.lenght != 0 )
                                                { 
                                                    this.setState({passwordlbl:true});
                                                }else{
                                                    this.setState({passwordlbl: false});
                                                }
                                        })

                                    }}
                                />
                            </View>

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
                                <View >
                                    
                                     <CheckBox 
                                          label='remember Me'
                                          checked= {true}
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
        fontFamily:'gothamlight',
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
    },
    inputStyle: {
        fontFamily:'gothamlight',
        marginTop:3,
        backgroundColor: 'transparent'
    },
    imageStyle: {
        width: 25,
        height: 30
    },
    text: {
        flex:1,
        fontFamily:'gothamlight',
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
        color:'#000000'
    }  

};

export default Login;