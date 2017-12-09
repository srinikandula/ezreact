import React, {Component} from 'react';
import {View,Image,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';

class Profile extends Component{
     state = {userName: ' ',phoneNumber: '',emailId:'.com',grups:'', password: '',confpassword:'', message: '',userNamelbl:true,
           phoneNumberlbl:false,isFocused: false,passwordlbl:false,cpasswordlbl:false,rememberme:false};

    constructor(props) {
        super(props);
        this.state = {
            userNamelbl: true,
             phoneNumberlbl:true,
             passwordlbl:false,
             cpasswordlbl:false,
             userName: 'Riyazuddin ',phoneNumber: '8801715086',emailId:'Riyaz@Mtwlabs.com',grups:'My Groups -60'
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

        

 render() {
        const {
            viewStyle,
            loginbuttonStyle,
            containerStyle,
            profileImageStyle,
            editProfileImageStyle,
            actionStyle,
            addGroupImageStyle,
            sendTextStyle,
            forgotTextStyle,
            rememberTextStyle,
            inputStyle,
            imageStyle,
            inputContainerStyle,
            text,
            backgroundImage,
            headerStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;


        const namelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.userNamelbl ? 6 : 0,
                  fontSize: ! this.state.userNamelbl ? 14 : 10,
                  color: ! this.state.userNamelbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:1,
                  height:30,
                }

        const passwordlabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.passwordlbl ? 16 : 0,
                  fontSize: ! this.state.passwordlbl ? 18 : 14,
                  color: ! this.state.passwordlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }


        const confirmpasswordlbl= {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.cpasswordlbl ? 16 : 0,
                  fontSize: ! this.state.cpasswordlbl ? 18 : 14,
                  color: ! this.state.cpasswordlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }
        
        const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  fontFamily:'gothamlight',
                  top: ! this.state.phoneNumberlbl ? 16 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 14 : 12,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                  fontFamily:'gothamlight',
                  padding:3
                }                


        return (
            <View style={viewStyle}>
                <View style={headerStyle}>
                    <Image source={require('../images/eg_profile.png')} style= {backgroundImage}/>
                </View>            
                
                    <ScrollView style={{alignSelf:'stretch',flex:1,marginBottom:10}}>
                    <View style={containerStyle}>                        
                       <Card>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', paddingTop:3}}>
                                <Text style={namelabelStyle} >
                                        UserName
                                </Text>
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='default'                                    
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.userName}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={namelabelStyle} >
                                        Phone Number
                                </Text>
                            
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.phoneNumber}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={namelabelStyle} >
                                        Email
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='email-address'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.emailId}
                                />
                            </View>

                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                               <Text style={namelabelStyle} >
                                Number OF members
                                </Text>                     
                                <CustomEditText
                                    keyboardType='default'
                                    inputContainerStyle={inputContainerStyle}
                                    editable = {false}
                                    inputTextStyle={inputStyle}
                                    value={this.state.grups}
                                />
                            </View>
                       </Card>

                       <Card>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={namelabelStyle} >
                                        password
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.password}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={namelabelStyle} >
                                        confirm password
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.confpassword}
                                />
                            </View>

                            <View style={checkForgotStyle}>
                                    <TouchableOpacity style={actionStyle} >
                                        <CustomText customTextStyle={sendTextStyle}>
                                            RESET
                                        </CustomText>   
                                     </TouchableOpacity>
                                   
                            </View>
                       </Card>


                    </View>
               </ScrollView>
                <View  style={profileImageStyle}>
                    <Image source={require('../images/eg_user.png')} style= {{height:100,width:110,resizeMode: 'contain'}}/>
                </View>
                <View  style={editProfileImageStyle}>
                    <Image source={require('../images/eg_edit.png')} style= {{height:20,width:30,resizeMode: 'contain'}}/>
                </View>

                <View style={addGroupImageStyle}>
                     <View style={styles.circle} >
                        <Image source={require('../images/eg_addgroup.png')} style= {{height:30,width:30,resizeMode: 'contain'}}/>
                     </View>

                </View>
                    
             </View>   
        );
    }
}
const winW = Dimensions.get('window').width;
const winH = Dimensions.get('window').width;
const styles = {
    circle: {
        width: 60,
        height: 60,
        borderRadius: 100/2,
        backgroundColor:'#e22b0b',
        paddingLeft:15,
        justifyContent:'center',
    },
    backgroundImage: {
         width:20,
         height:30,
         resizeMode: 'contain'
    },
    viewStyle: {
        flex:1,
        justifyContent: 'flex-start',
        flexDirection:'column',
        alignItems:'center',
        paddingBottom:10
        
    },
    containerStyle: {
        flex: 1,
        alignSelf:'stretch',
        backgroundColor: '#ffffff',
        alignItems:'flex-start',
        marginTop:40,
        marginRight:10,
        marginLeft:10

    },
    profileImageStyle:{
        position:'absolute',
        top:20
    },
    editProfileImageStyle:{
        padding:5,
        backgroundColor: '#a7a4a4',
        position:'absolute',
        top:40,
        right:winW-250
    },
    addGroupImageStyle:{
        padding:5,
        backgroundColor: 'transparent',
        position:'absolute',
        bottom:50,
        right:20,
        zIndex: 1 
    },
    inputContainerStyle:{
        margiTop:10,
        marginBottom:0
    },
    inputStyle: {
        fontFamily:'gothamlight',
        fontSize: 14,
        marginTop:6,
        backgroundColor: 'transparent',
        height:35
    },
    sendTextStyle :{
        fontFamily:'gothamlight',
        textAlign: 'right',
        color: '#ffffff',
        padding: 5
    },
    signInButtonStyle: {
        alignSelf:'stretch',
        backgroundColor: '#ffffff',
        marginTop:1
    },
    actionStyle:{
        paddingLeft:5,
         backgroundColor:'#1e4495'
    },
    forgotTextStyle: {
        fontFamily:'gothamlight',
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
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
    headerStyle:{
        alignSelf:'stretch',
        alignItems:'flex-end',
        height:60,
        paddingTop:5,
        paddingRight:10,
        backgroundColor:'#1e4495',
        position:'relative'
    },
    checkForgotStyle:{
        flex: 1,
        alignSelf:'stretch',
        flexDirection: 'row',
        marginTop:10,
        marginBottom:20,
        justifyContent: 'flex-end',
       
    },
    checkboxStyle:{
        color:'#000000'
    }  

};

export default Profile;