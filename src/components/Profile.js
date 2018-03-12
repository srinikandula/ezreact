import React, {Component} from 'react';
import {View,Image,AsyncStorage,Text,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomButton,CustomText,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import CustomStyles from './common/CustomStyles';
import Axios from 'axios';

class Profile extends Component{
     state = {token:'',userName: ' ',phoneNumber: '',emailId:'', password: '',confpassword:'',
            message: '',userNamelbl:true,
           phoneNumberlbl:false,isFocused: false,passwordlbl:false,cpasswordlbl:false,rememberme:false,
           accountGroupsCount:'',accountTrucksCount:'',oldpassword:'',currentpassword:'',
           authPassword:true,profilePic:'',userImage:'../images/eg_user.png'};

    componentWillMount() {
       this.getCredentailsData();
       BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({token:egObj.token});
                if(egObj.hasOwnProperty('profilePic')){
                    this.setState({token:egObj.token,profilePic:Config.routes.getProfilePic+egObj.profilePic},()=>{console.log(this.state.profilePic,'dinesshhhh')});
                }
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.getProfileDetails
                })
                .then((response) => {
                    if (response.data.status) {
                        console.log('getProfileDetails ==>', response.data);
                        this.setState({accountGroupsCount:''+response.data.result.accountGroupsCount,
                            accountTrucksCount:''+response.data.result.accountTrucksCount,
                            phoneNumber: ''+response.data.result.profile.contactPhone,
                            userName:response.data.result.profile.userName,
                            currentpassword:response.data.result.profile.password})
                    } else {
                        console.log('no  getProfileDetails ==>', response);
                       // this.setState({ trucks: [] });
                    }
                }).catch((error) => {
                    console.log('error in getProfileDetails ==>', error);
                })
                
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

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { display: value === ''? 'none':'flex' }, selectedName: value });
    }


checkPassword(){
    if(this.state.confpassword.length == this.state.password.length){
        if(this.state.confpassword === this.state.password){

            this.setState({authPassword:true});
        }else{
            this.setState({authPassword:false});
        }
    }else{
        this.setState({authPassword:false});
    }
}

getProfileImage(){
    console.log(this.state.profilePic.length,'getProfileImage');
    if(this.state.profilePic.length == 0){
        return(<Image source={require('../images/eg_user.png')} 
                    style= {{height:100,width:110,resizeMode: 'contain'}}/>);
    }else{
        return(<Image source={{uri:this.state.profilePic}} 
            style= {{height:100,width:110,resizeMode: 'contain'}}/>);
    }
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
                  top:  this.state.phoneNumberlbl ? 16 : 0,
                  fontSize:  this.state.phoneNumberlbl ? 14 : 12,
                  color:  this.state.phoneNumberlbl ? '#aaa' : '#000',
                //   fontFamily:'Gotham-Light',
                  padding:3
                }                


                

        return (
            <View style={CustomStyles.profileviewStyle}>
                <View style={CustomStyles.profileheaderStyle}>
                    <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('GroupList',{token:this.state.token,edit:false})}}
                                    >
                        <Image source={require('../images/eg_profile.png')} style= {CustomStyles.profileUserImage}/>
                    </TouchableOpacity>
                </View>            
                
                <ScrollView style={CustomStyles.profileScroll}>
                    <View style={CustomStyles.profileScrollcontainerStyle}>                        
                       <Card styles={{paddingLeft:10}}>

                        <View style={CustomStyles.profileInputBox}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field0]}>
                                UserName</CustomText>
                            <CustomEditText 
                                inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                editable = {false}
                                inputTextStyle={CustomStyles.profileInputStyle }
                                value={this.state.userName}                                    
                                 />
                        </View>
                        <View style={CustomStyles.profileInputBox}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field1]}>
                            Phone Number</CustomText>
                            <CustomEditText 
                                inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                editable = {true}
                                inputTextStyle={CustomStyles.profileInputStyle }
                                value={this.state.phoneNumber}
                                onChangeText={(phoneNumber) => { this.moveInputLabelUp(1, phoneNumber),
                                    this.setState({ phoneNumber: phoneNumber }) }}
                                                                   
                                 />
                        </View>

                        <View style={CustomStyles.profileInputBox}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field2]}>
                                Email</CustomText>
                            <CustomEditText 
                                inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                placeholder={'Enter Email ID'}
                                editable = {true}
                                inputTextStyle={CustomStyles.profileInputStyle }
                                value={this.state.emailId}
                                onChangeText={(emailId) => { this.moveInputLabelUp(2, emailId),
                                    this.setState({ emailId: emailId }) }}
                                                                   
                                 />
                        </View>

                        <View style={CustomStyles.profileInputBox}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field3]}>
                            Total Groups</CustomText>
                            <CustomEditText 
                                inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                placeholder={'0'}
                                editable = {false}
                                inputTextStyle={CustomStyles.profileInputStyle }
                                value={this.state.accountGroupsCount}
                                 />
                        </View>
                        <View style={CustomStyles.profileInputBox}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field4]}>
                            Total Vehicles</CustomText>
                            <CustomEditText 
                                inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                placeholder={'0'}
                                editable = {false}
                                inputTextStyle={CustomStyles.profileInputStyle }
                                value={this.state.accountTrucksCount}
                                 />
                        </View>
                       </Card>

                       <Card styles={{paddingLeft:10}}>
                           <View >
                                <Text style={CustomStyles.profileResettext}>
                                    Reset Password
                                </Text>
                            </View>
                            <View style={CustomStyles.profileInputBox}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field5]}>
                                    Old Password </CustomText>
                                <CustomEditText 
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    placeholder={'Enter Old Password'}
                                    editable = {true}
                                    inputTextStyle={CustomStyles.profileInputStyle }
                                    value={this.state.oldpassword}
                                    onChangeText={(oldpassword) => { this.moveInputLabelUp(5, oldpassword),
                                        this.setState({ oldpassword: ''+oldpassword }) }}
                                                                    
                                    />
                            </View>
                            <View style={CustomStyles.profileInputBox}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field6]}>
                                New Password </CustomText>
                                <CustomEditText 
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    placeholder={'Enter New Password'}
                                    editable = {true}
                                    inputTextStyle={CustomStyles.profileInputStyle }
                                    value={this.state.password}
                                    onChangeText={(password) => { this.moveInputLabelUp(6, password),
                                        this.setState({ password: ''+password }) }}
                                                                    
                                    />
                            </View>
                            <View style={CustomStyles.profileInputBox}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 0, top:2, display:'flex',color: '#525252' }, this.state.field7]}>
                                Retype Password </CustomText>
                                <CustomEditText 
                                    secureTextEntry
                                    inputContainerStyle={CustomStyles.profileInputContainerStyle}
                                    placeholder={'Enter Retype Password'}
                                    editable = {true}
                                    inputTextStyle={CustomStyles.profileInputStyle }
                                    value={this.state.confpassword}
                                    onChangeText={(confpassword) => { this.moveInputLabelUp(7, confpassword),
                                        this.setState({ confpassword: ''+confpassword }),this.checkPassword() }}
                                                                    
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
                {this.getProfileImage()}
                </View>
                <View  style={editProfileImageStyle}>
                    <Image source={require('../images/eg_edit.png')} 
                        style= {{height:20,width:30,resizeMode: 'contain'}}/>
                </View>

                <View style={CustomStyles.profileaAddGroupImageStyle}>
                     <View style={CustomStyles.profileCircle} >
                        <TouchableOpacity
                            onPress={() => {  this.props.navigation.navigate('AddGroup',{token:this.state.token,edit:false})}}
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