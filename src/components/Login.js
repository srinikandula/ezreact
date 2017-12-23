import React, { Component } from 'react';
import {
    View, Image, AsyncStorage, Text, ToastAndroid, TouchableOpacity,
    ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
    CustomInput,
    renderIf,
    CustomEditText,
    CustomButton,
    CustomText,
    CommonBackground
} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '', phoneNumber: '', password: '', message: '', userNamelbl: false,
            phoneNumberlbl: false, isFocused: false, passwordlbl: false, rememberme: false
        };
    }

    componentWillMount() {
        SplashScreen.hide();
    }

    onSignIn() {
        const self = this;
        if (this.state.userName.length < Config.limiters.userNameLength) {
            return ToastAndroid.show('Enter a UserName', ToastAndroid.SHORT);
        }
        if (this.state.phoneNumber.length < Config.limiters.mobileLength) {

            return ToastAndroid.show('Enter a valid Mobile Number', ToastAndroid.SHORT);
        }
        if (this.state.password.length < 4) {
            return ToastAndroid.show('Enter valid password', ToastAndroid.SHORT);
        }
        Axios({
            method: 'post',
            url: Config.routes.base + Config.routes.loginRoute,
            data: {
                userName: this.state.userName,
                password: this.state.password,
                contactPhone: this.state.phoneNumber
            }
        }).then((response) => {
            if (response.data.status) {
                this.storeData(response.data, (callback) => {
                    Actions.ErpHome();
                });
            } else {
                let message = '';
                if (response.data)
                    response.data.messages.forEach(function (current_value) {
                        message = message + current_value;
                    });
                ToastAndroid.show(message, ToastAndroid.SHORT);
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    async storeData(data, callback) {
        var easyGaadi = {
            token: data.token,
            userName: data.userName,
            gpsEnabled: data.gpsEnabled,
            erpEnabled: data.erpEnabled,
            loadEnabled: data.loadEnabled,
            editAccounts: data.editAccounts
        }
        try {
            await AsyncStorage.setItem('credientails', JSON.stringify(easyGaadi));
            callback(easyGaadi);
        } catch (error) {
            console.error(error);
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
            inputStyle,
            text,
            backgroundImage,
            logoStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;

        const namelabelStyle = {
            position: 'absolute',
            left: 0,
            fontFamily: 'gothamlight',
            top: !this.state.userNamelbl ? 18 : 0,
            fontSize: !this.state.userNamelbl ? 16 : 14,
            color: !this.state.userNamelbl ? '#aaa' : '#000',
            fontFamily: 'gothamlight',
            paddingLeft: 10,
            padding: 3
        }

        const passwordlabelStyle = {
            position: 'absolute',
            left: 0,
            fontFamily: 'gothamlight',
            top: !this.state.passwordlbl ? 18 : 0,
            fontSize: !this.state.passwordlbl ? 16 : 14,
            color: !this.state.passwordlbl ? '#aaa' : '#000',
            fontFamily: 'gothamlight',
            paddingLeft: 10,
            
            padding: 3
        }

        const phonelabelStyle = {
            position: 'absolute',
            left: 0,
            fontFamily: 'gothamlight',
            top: !this.state.phoneNumberlbl ? 18 : 0,
            fontSize: !this.state.phoneNumberlbl ? 16 : 14,
            color: !this.state.phoneNumberlbl ? '#aaa' : '#000',
            fontFamily: 'gothamlight',
            paddingLeft: 10,
            
            padding: 3
        }

        return (
            <CommonBackground>
                <View style={viewStyle}>
                    <CustomText style={text}>Login</CustomText>
                    <ScrollView >
                        <View style={containerStyle}>
                            <View style={logoStyle}>
                                <Image source={require('../images/logo_icon.png')} style={backgroundImage} />
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'stretch', alignItems: 'flex-start', padding: 3 }}>
                                <Text style={namelabelStyle} >User Name</Text>
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='default'
                                    inputTextStyle={inputStyle}
                                    value={this.state.userName}
                                    onChangeText={(value) => {
                                        this.setState({ userName: value, userNamelbl: true })
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'stretch', alignItems: 'flex-start' }}>
                                <Text style={passwordlabelStyle} >Password</Text>
                                <CustomEditText
                                    secureTextEntry
                                    inputTextStyle={inputStyle}
                                    value={this.state.password}
                                    onChangeText={(value) => {
                                        this.setState({ password: value, passwordlbl: true })
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', alignSelf: 'stretch', alignItems: 'flex-start' }}>
                                <Text style={phonelabelStyle} >Mobile Number</Text>
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputTextStyle={inputStyle}
                                    value={this.state.phoneNumber}
                                    onChangeText={(value) => {
                                        this.setState({ phoneNumber: value, phoneNumberlbl: true })
                                    }}
                                />
                            </View>
                            <View style={checkForgotStyle}>
                                <View style={{paddingLeft: 5}}>
                                    <CheckBox
                                        checkboxStyle={{width:20, height: 20, resizeMode: 'contain'}}
                                        label='Remember me'
                                        checked={true}
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
                                        <CustomText customTextStyle={forgotTextStyle}>Forgot Password</CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={loginbuttonStyle}>
                                <TouchableOpacity
                                    style={signInButtonStyle}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        this.onSignIn()
                                    }}
                                >
                                    <CustomText customTextStyle={signInTextStyle}>LOGIN</CustomText>
                                </TouchableOpacity>
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
        width: winW - 100,
        height: 50,
        resizeMode: 'contain'
    },
    viewStyle: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10

    },
    containerStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 60,
        marginBottom: 50,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',

    },
    loginbuttonStyle: {
        alignSelf: 'stretch',
        backgroundColor: '#d9d9d9',

    },
    signInButtonStyle: {
        alignSelf: 'stretch',
        backgroundColor: '#ffffff',
        marginTop: 1,
        paddingVertical: 10
    },
    signInTextStyle: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: '#e83a13',
        fontFamily: 'gothamlight',
        fontSize: 16,
        padding: 10,
        backgroundColor: '#ffffff'
    },
    forgotTextStyle: {
        fontFamily: 'gothamlight',
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2,
        paddingRight: 5
    },
    inputStyle: {
        fontFamily: 'gothamlight',
        fontSize: 16,
        marginTop: 3,
        backgroundColor: 'transparent'
    },
    text: {
        flex: 1,
        fontFamily: 'gothamlight',
        alignItems: 'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    },
    logoStyle: {
        padding: 20,
    },
    checkForgotStyle: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-between'
    }
};

export default Login;