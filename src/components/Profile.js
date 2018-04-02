import React, {Component} from 'react';
import {View,Image,AsyncStorage,Text,TouchableOpacity,ScrollView,Keyboard, Dimensions,BackHandler,NativeModules,Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {CustomInput,Card,CustomEditText,CustomButton,CustomText,CSpinner,CommonBackground} from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import CustomStyles from './common/CustomStyles';
import Axios from 'axios';
import Utils from './common/Utils';
import ImagePicker  from 'react-native-image-picker';
//import fileType from 'react-native-file-type'

const imgPickerOptions = {
    title: 'Select image',
    storageOptions: {
      skipBackup: true,
      path: 'images'
    },
    maxWidth: 1024,  
    maxHeight: 512,
    // maxWidth: 200,
    // maxHeight: 220,
    quality: 1,
    noData: false
  };

class Profile extends Component{
     state = {token:'',userName: ' ',phoneNumber: '',emailId:'', password: '',confpassword:'',
            message: '',userNamelbl:true,
           phoneNumberlbl:false,isFocused: false,passwordlbl:false,cpasswordlbl:false,rememberme:false,
           accountGroupsCount:'',accountTrucksCount:'',oldpassword:'',currentpassword:'',
           authPassword:true,profilePic:'',userImage:'../images/eg_user.png',accountId:'',
           spinnerBool: false,addPostImgUrl:''
          };

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
                this.setState({ spinnerBool:true });
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.getProfileDetails
                })
                .then((response) => {
                    if (response.data.status) {
                        console.log('getProfileDetails ==>', response.data);
                        this.setState({
                            accountGroupsCount:''+response.data.result.accountGroupsCount,
                            accountTrucksCount:''+response.data.result.accountTrucksCount,
                            phoneNumber: ''+response.data.result.profile.contactPhone,
                            userName:response.data.result.profile.userName,
                            currentpassword:response.data.result.profile.password,
                            accountId:response.data.result.profile._id,
                            emailId:response.data.result.profile.email});
                    } else {
                        console.log('no  getProfileDetails ==>', response);
                       // this.setState({ trucks: [] });
                    }
                    this.setState({ spinnerBool:false });
                }).catch((error) => {
                    console.log('error in getProfileDetails ==>', error);
                    this.setState({ spinnerBool:false });
                })
                
            } else {
                this.setState({ spinnerBool: false })
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



    


getProfileImage(){
    console.log(this.state.profilePic+"<-->"+this.state.profilePic.length,'getProfileImage');
    if(this.state.profilePic.length == 0){
        return(<Image source={require('../images/eg_user.png')} 
                    style= {{height:100,width:110,resizeMode: 'contain'}}/>);
    }else{
        console.log(this.state.profilePic+"<-url->"+this.state.profilePic.length,'getProfileImage');
        return(<Image source={{uri:this.state.profilePic}} 
            style= {{height:100,width:100, borderRadius:50,resizeMode: 'contain'}}/>);
    }
}
 isValidEmail(email) {
    return email && /^\S+@\S+\.\S+/.test(email);
 };

onSubmitProfileDetails() {

    if(this.state.userName.trim().length == 0){
        return  Utils.ShowMessage('Please Enter  User Name');
    }

    if(this.state.phoneNumber.trim().length != 10){
        return  Utils.ShowMessage('Please Enter 10 digits Mobile Number');
    }

    if(!this.isValidEmail(this.state.emailId.trim())){
        return   Utils.ShowMessage('Please Enter Email ID');
    }


    if(this.state.oldpassword.trim().length == 0 ){

        if(this.state.password.trim().length > 0 ){
            return   Utils.ShowMessage('Please Enter Old password');
        }

        if(this.state.confpassword.trim().length > 0 ){
            return   Utils.ShowMessage('Please Enter Old password');
        }
        
        var postData = {profile:{
            'userName': this.state.userName,
            'contactPhone': Number(this.state.phoneNumber),
            'email': this.state.emailId,
            'oldPassword':'',
            'confirmPassword': '',
            'newPassword': '',
            'accountGroupsCount': Number(this.state.accountGroupsCount),
            'accountTrucksCount':Number(this.state.accountTrucksCount),
            '_id':this.state.accountId
        }};

        console.log(postData,'update paaword without password');
        this.callupdateProfileAPI(postData);
    }else{

        if(this.state.currentpassword.trim() === this.state.oldpassword.trim() ){
            if(this.state.password.trim().length > 0 ){
                if(this.state.confpassword.trim().length > 0 ){
                    if(this.state.confpassword === this.state.password){
                        Utils.ShowMessage('Under Progress...');
                        var postData = {profile:{
                            'userName': this.state.userName,
                            'contactPhone':Number(this.state.phoneNumber),
                            'email': this.state.emailId,
                            'oldPassword': this.state.currentpassword,
                            'confirmPassword': this.state.confirmPassword,
                            'newPassword': this.state.password,
                            'accountGroupsCount': Number(this.state.accountGroupsCount),
                            'accountTrucksCount':Number(this.state.accountTrucksCount),
                            '_id':this.state.accountId
                        }};
                        this.callupdateProfileAPI(postData);
                        console.log(postData,'update paaword with password');
                    }else{
                        Utils.ShowMessage('Confirm Password does not match');
                    }
                }else{
                    Utils.ShowMessage('Please Enter Retype Password ');
                }
            }else{
                Utils.ShowMessage('Please Enter New Password ');
            }
        }else{
            Utils.ShowMessage('Password does not matach with Current Password ');
        }

    }


}

callupdateProfileAPI(postdata){
    const self = this;
    self.setState({ spinnerBool:true });
    var methodType = 'put';
    var url = Config.routes.base + Config.routes.updateProfile
    Axios({
        method: methodType,
        headers: { 'token': self.state.token },
        url: url,
        data: postdata
    })
        .then((response) => {
            console.log(Config.routes.base + Config.routes.updateProfile,"URL");
            console.log(postdata,'<--update Profile ==>', response.data);
            if (response.data.status) {                    
                self.setState({ spinnerBool:false });
                
                if(this.state.oldpassword.length>0){
                    self.setState({currentpassword:self.state.confpassword,oldpassword:'',password:'',confpassword:''});
                }

                let message ="";
                if(response.data)
                response.data.messages.forEach(function(current_value) {
                    message = message+current_value;
                });
                Utils.ShowMessage(message);
                
            } else {
                self.setState({ spinnerBool:false });
                let message ="";
                if(response.data)
                response.data.messages.forEach(function(current_value) {
                    message = message+current_value;
                });
                Utils.ShowMessage(message);                    
            }
        }).catch((error) => {
            console.log('error in update Profile ==>', error);
            self.setState({ spinnerBool:false });
            Utils.ShowMessage("Something went wrong.Please try after sometime");
        })
}

spinnerLoad() {
    if (this.state.spinnerBool)
        return <CSpinner/>;
    return false;
}

onPickImage() {
    const self=this;
    ImagePicker.showImagePicker(imgPickerOptions, response => {
      console.log(response)
      if (!response.didCancel && !response.error) {
        console.log('response.uri',response.uri, ':::::response',response);
        console.log('response.data',response.data,response.type);
       if(Platform.OS === 'android'){
        NativeModules.FetchData.GetImg(response.uri, (resp) => {
            self.setState({ addPostImgUrl: '' + resp, profilePic:  response.uri }, () => {
              console.log(self.state.addPostImgUrl);
              var postdata = {"image":"data:"+response.type+";base64,"+resp};
              console.log('postdata',postdata);
              self.sendPicToServer(postdata)
            });
          });
       }else{
        
        self.setState({ addPostImgUrl: '' + response.data, profilePic:  response.uri }, () => {
            console.log(self.state.addPostImgUrl);
            fileType(response.uri).then((type) => {
                var postdata = {"image":"data:"+type.mime+";base64,"+response.data};
                console.log('postdata',postdata);
                self.sendPicToServer(postdata)
            })
           
          });
       }
        
      } else if (response.didCancel) {
        self.setState({ addPostImgUrl: '', addPostImage: '', imageUploadBool: false });
      } else {
        alert('Could not select image');
      }
    })
  } 


  sendPicToServer(postData){
    const self = this;
    console.log('sendPicToServer(',postData);
    self.setState({ spinnerBool:true });
    var methodType = 'post';
    var url = Config.routes.base + Config.routes.uploadProfilePic
    Axios({
        method: methodType,
        headers: { 'token': self.state.token },
        url: url,
        data: postData
    })
        .then((response) => {
           // console.log(Config.routes.base + Config.routes.uploadProfilePic,"URL");
            //console.log(postData,'<--update Profile pic ==>', response.data);
            if (response.data.status) {                    
                self.setState({ spinnerBool:false });

                let message ="";
                if(response.data)
                //response.data.messages.forEach(function(current_value) {
                //    message = message+current_value;
                //});
                Utils.ShowMessage(response.data.message);
                
            } else {
                self.setState({ spinnerBool:false });
                let message ="";
                if(response.data)
                response.data.messages.forEach(function(current_value) {
                    message = message+current_value;
                });
                Utils.ShowMessage(message);                    
            }
        }).catch((error) => {
            console.log('error in update Profile pic==>', error);
            self.setState({ spinnerBool:false });
            Utils.ShowMessage("Something went wrong.Please try after sometime");
        })
  }
onLogout(){
    AsyncStorage.clear();
    this.props.navigation.navigate('login');
}

 render() {
        const {
            editProfileImageStyle
        } = styles;

        
 
        return (
            <View style={CustomStyles.profileviewStyle}>
                <View style={CustomStyles.profileheaderStyle}>
                    
                    <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('GroupList',{token:this.state.token,edit:false})}}
                                    >
                        <Image source={require('../images/eg_profile.png')} style= {CustomStyles.profileUserImage}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                            onPress={() => { this.onLogout()}}
                                    >
                        <CustomText customTextStyle={{marginLeft:10,fontSize: 14}}>Logout</CustomText>
                    </TouchableOpacity>
                    </View>
                </View>            
                {this.spinnerLoad()}
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
                                keyboardType='numeric'
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
                                        this.setState({ confpassword: ''+confpassword })}}
                                                                    
                                    />
                            </View>
                            <View style={CustomStyles.profileViewActionStyle}>
                                    <TouchableOpacity style={CustomStyles.profileactionStyle} onPress={() => {this.onSubmitProfileDetails()}}>
                                        <CustomText customTextStyle={CustomStyles.profileButtonTextStyle}>
                                            RESET
                                        </CustomText>   
                                     </TouchableOpacity>
                                   
                            </View>
                       </Card>


                    </View>
               </ScrollView>
                <View  style={CustomStyles.profileImageStyle}>
                {console.log("-->"+this.state.profilePic+"\n "+"this.state.profilePic")}
                { 
                    this.state.profilePic.trim().length > 0 ?
                        <Image source={{uri:this.state.profilePic.trim()}} 
                        style= {{height:100,width:110,resizeMode: 'contain'}}/>
                         :
                         <Image source={ require('../images/eg_user.png')} 
                            style= {{height:100,width:110,resizeMode: 'contain'}}/>
                        }
                    
                </View>
                <View  style={editProfileImageStyle}>
                    <TouchableOpacity onPress={() => {  this.onPickImage()}}>
                        <Image source={require('../images/eg_edit.png')}  style= {{height:20,width:30,resizeMode: 'contain'}}/>
                    </TouchableOpacity>
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