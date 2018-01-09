import React, {Component} from 'react';
import {View,Image,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import {Actions,Reducer} from 'react-native-router-flux';
import CustomStyles from './common/CustomStyles';

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
    //  Actions.pop();
    }

        

 render() {
        const {
            editProfileImageStyle
        } = styles;


        const namelabelStyle = {
                  position: 'absolute',
                  left: 0,
                  //fontFamily:'Gotham-Light',
                  top: ! this.state.userNamelbl ? 6 : 0,
                  fontSize: ! this.state.userNamelbl ? 14 : 10,
                  color: ! this.state.userNamelbl ? '#aaa' : '#000',
                  //fontFamily:'Gotham-Light',
                  padding:1,
                  height:30,
                }

        const passwordlabelStyle = {
                  position: 'absolute',
                  left: 0,
                //   fontFamily:'Gotham-Light',
                  top: ! this.state.passwordlbl ? 16 : 0,
                  fontSize: ! this.state.passwordlbl ? 18 : 14,
                  color: ! this.state.passwordlbl ? '#aaa' : '#000',
                //   fontFamily:'Gotham-Light',
                  padding:3
                }


        const confirmpasswordlbl= {
                  position: 'absolute',
                  left: 0,
                //   fontFamily:'Gotham-Light',
                  top: ! this.state.cpasswordlbl ? 16 : 0,
                  fontSize: ! this.state.cpasswordlbl ? 18 : 14,
                  color: ! this.state.cpasswordlbl ? '#aaa' : '#000',
                //   fontFamily:'Gotham-Light',
                  padding:3
                }
        
        const phonelabelStyle = {
                  position: 'absolute',
                  left: 0,
                //   fontFamily:'Gotham-Light',
                  top: ! this.state.phoneNumberlbl ? 16 : 0,
                  fontSize: ! this.state.phoneNumberlbl ? 14 : 12,
                  color: ! this.state.phoneNumberlbl ? '#aaa' : '#000',
                //   fontFamily:'Gotham-Light',
                  padding:3
                }                


        return (
            <View style={CustomStyles.profileviewStyle}>
                <View style={CustomStyles.profileheaderStyle}>
                    <Image source={require('../images/eg_profile.png')} style= {CustomStyles.profileUserImage}/>
                </View>            
                
                <ScrollView style={CustomStyles.profileScroll}>
                    <View style={CustomStyles.profileScrollcontainerStyle}>                        
                       <Card styles={{paddingLeft:10}}>
                            <View style={CustomStyles.profileInputBox}>
                                <Text style={namelabelStyle} >
                                        UserName
                                </Text>
                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='default'                                    
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    inputTextStyle={CustomStyles.profileInputStyle}
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
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    inputTextStyle={CustomStyles.profileInputStyle}
                                    value={this.state.phoneNumber}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={namelabelStyle} >
                                        Email
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='email-address'
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    inputTextStyle={CustomStyles.profileInputStyle}
                                    value={this.state.emailId}
                                />
                            </View>

                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                               <Text style={namelabelStyle} >
                                Number OF members
                                </Text>                     
                                <CustomEditText
                                    keyboardType='default'
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    editable = {false}
                                    inputTextStyle={CustomStyles.profileInputStyle}
                                    value={this.state.grups}
                                />
                            </View>
                       </Card>

                       <Card styles={{paddingLeft:10}}>
                           <View >
                                <Text style={CustomStyles.profileResettext}>
                                    Reset Password
                                </Text>
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={passwordlabelStyle} >
                                       New Password
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    inputTextStyle={CustomStyles.profileInputStyle}
                                    value={this.state.password}
                                />
                            </View>
                            <View style={{justifyContent:'flex-start',alignSelf:'stretch',alignItems:'flex-start', padding:3}}>
                                <Text style={confirmpasswordlbl} >
                                        Retype Password
                                </Text>
                            
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    inputTextStyle={CustomStyles.profileInputStyle}
                                    value={this.state.confpassword}
                                />
                            </View>

                            <View style={CustomStyles.profileViewActionStyle}>
                                    <TouchableOpacity style={CustomStyles.profileactionStyle} >
                                        <CustomText customTextStyle={CustomStyles.profileButtonTextStyle}>
                                            RESET
                                        </CustomText>   
                                     </TouchableOpacity>
                                   
                            </View>
                       </Card>


                    </View>
               </ScrollView>
                <View  style={CustomStyles.profileImageStyle}>
                    <Image source={require('../images/eg_user.png')} 
                        style= {{height:100,width:110,resizeMode: 'contain'}}/>
                </View>
                <View  style={editProfileImageStyle}>
                    <Image source={require('../images/eg_edit.png')} 
                        style= {{height:20,width:30,resizeMode: 'contain'}}/>
                </View>

                <View style={CustomStyles.profileaAddGroupImageStyle}>
                     <View style={CustomStyles.profileCircle} >
                        <Image source={require('../images/eg_addgroup.png')} 
                            style= {{height:30,width:30,resizeMode: 'contain'}}/>
                     </View>
                </View>
                    
             </View>   
        );
    }
}
const winW = Dimensions.get('window').width;
const winH = Dimensions.get('window').width;
const styles = {
    //important as calculation width
    editProfileImageStyle:{
        padding:5,
        borderRadius: 5,
        backgroundColor: '#a7a4a4',
        position:'absolute',
        top:30,
        right:winW/2 -65
    },
   

};

export default Profile;