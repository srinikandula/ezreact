import React, {Component} from 'react';
import {View,Image,AsyncStorage,Text,ToastAndroid,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import CustomStyles from './common/CustomStyles';

class Profile extends Component{
     state = {token:'',userName: ' ',phoneNumber: '',emailId:'.com',grups:'', password: '',confpassword:'', message: '',userNamelbl:true,
           phoneNumberlbl:false,isFocused: false,passwordlbl:false,cpasswordlbl:false,rememberme:false};

    


    componentWillMount() {
        this.setState({
            userNamelbl: true,
             phoneNumberlbl:true,
             passwordlbl:false,
             cpasswordlbl:false,
             userName: 'Riyazuddin ',phoneNumber: '8801715086',emailId:'Riyaz@Mtwlabs.com',grups:'My Groups -60'
        });
       this.getCredentailsData();
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({token:egObj.token});
                
            } else {
                this.setState({ loading: false })
            }
        }
        );
    }
    async getCache(callback) {
        try {
            var value = await AsyncStorage.getItem('credientails');
            console.log('credientails=profile', value);
            if (value !== null) {
                console.log('riyaz=profile', value);
            } else {
                console.log('value=profile', value);
            }
            callback(value);
        }
        catch (e) {
            console.log('caught error=profile', e);
            // Handle exceptions
        }
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
                    <TouchableOpacity
                            onPress={() => { Actions.GroupList({token:this.state.token,edit:false})}}
                                    >
                        <Image source={require('../images/eg_profile.png')} style= {CustomStyles.profileUserImage}/>
                    </TouchableOpacity>
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
                        <TouchableOpacity
                            onPress={() => { Actions.AddGroup({token:this.state.token,edit:false})}}
                                    >
                            <Image source={require('../images/eg_addgroup.png')} 
                                style= {{height:30,width:30,resizeMode: 'contain'}}/>
                        </TouchableOpacity>
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