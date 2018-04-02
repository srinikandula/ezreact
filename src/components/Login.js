import React, { Component } from 'react';
import { View, Image, AsyncStorage, Text, TouchableOpacity, ScrollView, Keyboard, Dimensions, BackHandler, NativeModules } from 'react-native';
import CustomStyles from './common/CustomStyles';
import SplashScreen from 'react-native-splash-screen';
import Utils from './common/Utils';
import {
    CustomInput,
    renderIf,
    CustomEditText,
    CustomButton,
    CustomText, CSpinner,
    CommonBackground
} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import Axios from 'axios';
import { NoInternetModal } from './common';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

class Login extends Component {
    state = {};

    constructor(props) {
        super(props);
        this.state = {
            // userName: 'easydemo', phoneNumber: '8712828528', password: '123456', message: '', userNamelbl: false,
            // userName: '', phoneNumber: '', password: '', message: '', userNamelbl: false,
            //  userName: 'naresh2', phoneNumber: '8919658182', password: '12345', message: '', userNamelbl: false,
             userName: 's.rlogistics@yahoo.com', phoneNumber: '9346137100', password: '9346137100', message: '', userNamelbl: false,
            phoneNumberlbl: false, isFocused: false, passwordlbl: false, rememberme: false, showMail: false,
            spinnerBool: false
        };

    }


    componentWillMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
        this.checkOutForRememberme();

    }

    checkOutForRememberme() {
        this.getCache('credientails');
    }


    getCache(key) {
        try {
            //console.log('login-riyaz',key);
            var value = AsyncStorage.getItem('fcmStorage');
            //console.log('credientails',key);
            if (value !== null) {
                 //this.runFCMService();

            } else {
                console.log('value', value.json())
            }

            return value.json();
        }
        catch (e) {
            console.log('riyaz');
            console.log('caught error', e);
            // Handle exceptions
        }

    }


    onSignIn() {
        const self = this;
        if (this.state.userName.length < Config.limiters.userNameLength) {
            return Utils.ShowMessage('Enter a UserName');
        }
        if (this.state.phoneNumber.length < Config.limiters.mobileLength) {

            return Utils.ShowMessage('Enter a valid Mobile Number');
        }
        if (this.state.password.length < 4) {
            return Utils.ShowMessage('Enter valid password');
        }

        self.setState({ spinnerBool: true });
        Axios({
            method: 'post',
            url: Config.routes.base + Config.routes.loginRoute,
            data: {
                userName: this.state.userName,
                password: this.state.password,
                contactPhone: this.state.phoneNumber
            }
        }).then((response) => {
            console.log("messages", response.data.messages);
            console.log("response", response.data);
            if (response.data.status) {
                //console.log("response.data",response.data);
                this.storeData(response.data);
                this.runFCMService(response.data.token);
                //this.props.navigation.navigate('homepage');
            } else {
                let message = "";
                if (response.data)
                    response.data.messages.forEach(function (current_value) {
                        message = message + current_value;
                    });
                Utils.ShowMessage(message);
                self.setState({ spinnerBool: false });
            }
           
        }).catch((error) => {
            self.setState({ spinnerBool: false });
            console.log('login post error--->', error)
            Utils.ShowMessage("Something went wrong.Please try after sometime");
        })

    }


    storeData(data) {
        console.log('in store data', data);
        var easyGaadi = {
            token: data.token,
            userName: data.userName,
            gpsEnabled: data.gpsEnabled,
            erpEnabled: data.erpEnabled,
            loadEnabled: data.loadEnabled,
            editAccounts: data.editAccounts,
            profilePic: data.profilePic
        }
        try {
            AsyncStorage.setItem('credientails', JSON.stringify(easyGaadi));
            console.log('easyGaadi', );
        } catch (error) {
            console.log('something went wrong');
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }


    runFCMService(jwttoken) {
        FCM.requestPermissions().then(() => console.log('granted')).catch(() => console.log('notification permission rejected'));
        
        FCM.getFCMToken().then(token => {
            // store fcm token in your server
            // setFcmToken(token);
            // this.setState({ fcmToken: token });
            console.log('refreshedToken', token);
            NativeModules.FetchData.GetDeviceId((imeiResp) => {
                // alert(JSON.stringify(imeiResp));
                console.log(imeiResp, 'imeiResp');
                console.log('test-url', Config.routes.base + Config.routes.registerToServer);
                Axios({
                    method: 'post',
                    headers: { 'token': jwttoken },
                    url: Config.routes.base + Config.routes.registerToServer,
                    data: {
                        fcmDeviceId: token,
                        imei: imeiResp,
                    }
                }).then((response) => {
                    console.log("registerToServer-response", response.data);
                    if (response.data.status) {
                        console.log("response.data", response.data);
                        this.props.navigation.navigate('homepage');
                    } else {
                        let message = "";

                    }
                    this.setState({ spinnerBool: false });
                }).catch((error) => {
                    this.setState({ spinnerBool: false });
                    console.log('registerToServer post error--->', error)
                    Utils.ShowMessage("Something went wrong.Please try after sometime");
                })


            }); // Native modules end
        });


        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            // optional, do some component related stuff
            console.log("notify", notif);
            this.sendRemote(notif);
        });

        FCM.getInitialNotification().then(notif => {
            console.log(notif)
        });
    }

    sendRemote(notif) {
        console.log('send');
        FCM.presentLocalNotification({
            title: notif.title,
            body: notif.body,
            priority: "high",
            click_action: notif.click_action,
            show_in_foreground: true,
            local: true
        });
    }

    render() {
        const {
            signInTextStyle,
            loginlogoImage,
        } = styles;


        const namelabelStyle = {
            position: 'absolute',
            left: 5,
            //   fontFamily:'Gotham-Light',
            top: 0,
            display: !this.state.userNamelbl ? 'none' : 'flex',
            fontSize: !this.state.userNamelbl ? 16 : 14,
            color: !this.state.userNamelbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 3
        }

        const passwordlabelStyle = {
            position: 'absolute',
            left: 5,
            display: !this.state.passwordlbl ? 'none' : 'flex',
            top: 0,
            fontSize: !this.state.passwordlbl ? 16 : 14,
            color: !this.state.passwordlbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 3
        }

        const phonelabelStyle = {
            position: 'absolute',
            left: 5,
            display: !this.state.phoneNumberlbl ? 'none' : 'flex',
            //   fontFamily:'Gotham-Light',
            top: 0,
            fontSize: !this.state.phoneNumberlbl ? 16 : 14,
            color: !this.state.phoneNumberlbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 3
        }


        return (
            <CommonBackground>
                <View style={CustomStyles.loginViewStyle}>

                    <CustomText customTextStyle={[CustomStyles.logintext]}>
                        Login
                    </CustomText>
                  
                    <ScrollView >
                        <View style={CustomStyles.loginContainerStyle}>

                            <View style={CustomStyles.loginlogoStyle}>
                                <Image source={require('../images/logo_icon.png')} style={loginlogoImage} />
                            </View>

                            <View style={CustomStyles.loginInputbox}>

                            </View>
                            <View style={CustomStyles.loginInputbox}>
                                <Text style={namelabelStyle} >
                                    UserName
                                </Text>

                                <CustomEditText
                                    //maxLength={Config.limiters.mobileLength}
                                    keyboardType='default'
                                    placeholder={'UserName'}
                                    inputTextStyle={CustomStyles.loginInputStyle}
                                    value={this.state.userName}
                                    underlineColorAndroid={'#e1e1e1'}
                                    onFocus={() => {
                                        this.setState({ userNamelbl: this.state.userName === '' ? false : true })
                                    }}
                                    onBlur={() => {
                                        this.setState({ userNamelbl: this.state.userName === '' ? false : true })
                                    }}
                                    onChangeText={(value) => {
                                        this.setState({ userName: value, userNamelbl: value === '' ? false : true })
                                    }}

                                />
                            </View>
                            <View style={CustomStyles.loginInputbox}>
                                <Text style={phonelabelStyle} >
                                    Mobile Number
                                </Text>
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    placeholder={'Mobile Number'}
                                    keyboardType='numeric'
                                    inputTextStyle={CustomStyles.loginInputStyle}
                                    value={this.state.phoneNumber}
                                    underlineColorAndroid={'#e1e1e1'}
                                    onFocus={() => {
                                        this.setState({ phoneNumberlbl: this.state.phoneNumber === '' ? false : true })
                                    }}
                                    onBlur={() => {
                                        this.setState({ phoneNumberlbl: this.state.phoneNumber === '' ? false : true })
                                    }}
                                    onChangeText={(value) => {
                                        this.setState({ phoneNumber: value, phoneNumberlbl: value === '' ? false : true })
                                    }}
                                />
                            </View>
                            <View style={CustomStyles.loginInputbox}>
                                <Text style={passwordlabelStyle} >
                                    Password
                                </Text>
                                <CustomEditText
                                    secureTextEntry
                                    inputTextStyle={CustomStyles.loginInputStyle}
                                    value={this.state.password}
                                    placeholder={'Password'}
                                    underlineColorAndroid={'#e1e1e1'}
                                    onFocus={() => {
                                        this.setState({ passwordlbl: this.state.password === '' ? false : true })
                                    }}
                                    onBlur={() => {
                                        this.setState({ passwordlbl: this.state.password === '' ? false : true })
                                    }}
                                    onChangeText={(value) => {
                                        this.setState({ password: value, passwordlbl: value === '' ? false : true })
                                    }}
                                />
                            </View>


                            <View style={CustomStyles.loginCheckForgotStyle}>
                                <View>
                                    <CheckBox
                                    checkboxStyle={{width:15, height:15}}
                                        label='Remember Me'
                                        color={'#000000'}
                                        checked={this.state.rememberme}
                                        onChange={() => this.setState({ rememberme: !this.state.rememberme })}
                                    />
                                </View>
                                <View >
                                    <TouchableOpacity onPress={() => {
                                        Keyboard.dismiss();
                                        this.props.navigation.navigate('forgotpin');
                                    }}>
                                        <CustomText customTextStyle={CustomStyles.loginForgotTextStyle}>
                                            Forgot Password?
                                        </CustomText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={CustomStyles.loginbuttonStyle}>
                                <CustomButton
                                    customButtonStyle={CustomStyles.loginInbutton}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        this.onSignIn()
                                    }}
                                >
                                    <CustomText
                                        customTextStyle={CustomStyles.loginInbuttonText}
                                    >
                                        LOGIN
                                </CustomText>
                                </CustomButton>
                            </View>
                            {this.spinnerLoad()}
                            <NoInternetModal visible={this.state.showMail} />
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
    loginlogoImage: {
        width: winW - 100,
        height: 50,
        resizeMode: 'contain'
    }
};

export default Login;