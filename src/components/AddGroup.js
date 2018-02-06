import React, { Component } from 'react';
import {View, Image, Text, Picker, FlatList,
            TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
        } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { CustomInput, CRadio,CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import Utils from './common/Utils';


import CustomStyles from './common/CustomStyles';
import { Actions } from 'react-native-router-flux';

export default class AddGroup extends Component {  
    state = {
        groupName: '',    
        groupUserName:'',  
        password:'',  
        cpassword:'',  
        numTrucks:'',
        truckArr:[],
        contactName:'',
        groupContact:'',
        location:'',
        isERP:false,
        isGPS : false,
        spinnerBool: false,
    };
    componentWillMount() {
        console.log("AddParty token",this.props);   
        if(this.props.edit){
            this.getGroupDetails(this.props.id);
        }
    }

    getGroupDetails(groupID){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.token },
            url: Config.routes.base + Config.routes.getGroupDetails+groupID,
            
        })
            .then((response) => {
                console.log(groupID+'<--getGroupDetails ==>', response.data);
                if (response.data.status) {    
                   self.setState({spinnerBool:false});
                    this.updateViewdate(response.data.accountGroup);                   
                } else {
                   // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool:false });
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    Utils.ShowMessage(message);
                    

                }
            }).catch((error) => {
                console.log('error in getGroupDetails ==>', error);
            })
    }

    updateViewdate(groupDetails){       
        this.setState({                  
            groupName: groupDetails.groupName,    
            groupUserName:groupDetails.userName,  
            password:groupDetails.password,  
            cpassword:groupDetails.confirmPassword,  
            numTrucks:this.getTruckCount(groupDetails.truckIds || groupDetails.truckId),
            truckArr:groupDetails.truckIds || groupDetails.truckId,
            contactName:groupDetails.contactName,
            groupContact: ''+groupDetails.contactPhone,
            location:groupDetails.location,
            isERP:groupDetails.erpEnabled,
            isGPS : groupDetails.gpsEnabled,
            },()=>{
                
        console.log('groupDetails ID',groupDetails._id);
        });
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "")
            
        }
    }

    getTruckCount(trucks) {
        var arrr = []
        arrr = trucks;
        return "Assgined Trucks  " + arrr.length;
    }
    onBackAndroid() {
     Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }

    callAddGroupAPI(postdata){
        const self = this;
        self.setState({ spinnerBool:true });
        var methodType = 'post';
        var url = Config.routes.base + Config.routes.addGroup
        if(this.props.edit){
            methodType = 'put';
            postdata._id = self.props.id;
            url = Config.routes.base + Config.routes.updateGroupGroup
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.token },
            url: url,
            data: postdata
        })
            .then((response) => {
                console.log(Config.routes.base + Config.routes.addGroup,"URL");
                console.log(postdata,'<--addGroup ==>', response.data);
                if (response.data.status) {                    
                    self.setState({ spinnerBool:false });
                    Actions.pop();
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
                console.log('error in addGroup ==>', error);
            })
    }
   
    //click--
    onSubmitTruckDetails() {
        if(this.state.groupName.trim().length > 0){
            if(this.state.groupUserName.trim().length > 0){
                if(this.state.password.trim().length > 0){
                    if(this.state.cpassword.trim() === this.state.password.trim()){
                        if(this.state.numTrucks.length > 0){
                            if(this.state.contactName.trim().length > 0){
                                if(this.state.groupContact.trim().length > 0){
                                    if(this.state.location.trim().length > 0){
                                        if(this.state.isERP || this.state.isGPS){
                                            var postData = {
                                                "groupName":this.state.groupName,
                                                "userName":this.state.groupUserName,
                                                "password":this.state.password,
                                                "confirmPassword":this.state.cpassword,
                                                "contactName":this.state.contactName,
                                                "contactPhone":Number(this.state.groupContact.trim()),
                                                "location":this.state.location,
                                                "truckIds":this.state.truckArr,
                                                "erpEnabled":this.state.isERP,
                                                "gpsEnabled":this.state.isGPS,                                            
                                                "type" : "group"
                                                };
                                                console.log('postData',postData);
                                                this.callAddGroupAPI(postData);
                                    }else{
                                                            Utils.ShowMessage('Please Select ERP/GPS ');


                                    }
                                    }else{
                                                            Utils.ShowMessage('Please Enter Location Name ');

 
                                    }
                                }else{
                                                        Utils.ShowMessage('Please Enter Contact Number ');


                                }
                            }else{
                                                    Utils.ShowMessage('Please Enter Contact Name ');


                            }
                        }else{
                                                Utils.ShowMessage('Please Select Vehicles ');


                        }
                    }else{
                                            Utils.ShowMessage('Enter Confirm Password does not Match  ');


                    }
                }else{
                                        Utils.ShowMessage('Please Enter Password');


                }
            }else{
                                    Utils.ShowMessage('Please Enter Group User Name');


            }
        }else{
                                Utils.ShowMessage('Please Enter Group Name');


        }
       

        
    }

    
    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.selectedList.length > 0){
            var objArr  = JSON.parse(nextProps.selectedList);
            var temp = ''+objArr.length ;
            this.setState({numTrucks:temp,truckArr:objArr});
            console.log('hurra',nextProps.selectedList);
            this.moveInputLabelUp(4, temp)
        }
    }
   
    
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
               <ScrollView >
                <View style={{marginBottom:50,padding:10}}>
                    
                    <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                        {this.spinnerLoad()}

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}>
                                Account Name*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.groupName}
                                            onChangeText={(groupName) => {this.moveInputLabelUp(0, groupName), this.setState({groupName:groupName})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>
                                Group User Name*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.groupUserName}
                                            onChangeText={(groupUserName) => {this.moveInputLabelUp(1, groupUserName), this.setState({groupUserName:groupUserName})}} />
                        </View>
                        
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>
                                Password*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent'
                                            secureTextEntry 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.password}
                                            onChangeText={(password) => {this.moveInputLabelUp(2, password), this.setState({password:password})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>
                               Confirm Password*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' 
                                            secureTextEntry
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.cpassword}
                                            onChangeText={(cpassword) => {this.moveInputLabelUp(3, cpassword), this.setState({cpassword:cpassword})}} />
                        </View>
                        <TouchableOpacity
                                        onPress={() => {Actions.SelectDriver({token:this.state.token,edit:false}) }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field4]}>
                                         selected Vechile</CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.numTrucks} />
                                            
                                    </View>
                                
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                                            source={require('../images/down_arrow.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field5]}>
                                Contact Person Name*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.contactName}
                                            onChangeText={(contactName) => {this.moveInputLabelUp(5, contactName), this.setState({contactName:contactName})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field6]}>
                                        Contact Number*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                           maxLength={Config.limiters.mobileLength}
                                           keyboardType='numeric'
                                            value={this.state.groupContact}
                                            onChangeText={(groupContact) => {this.moveInputLabelUp(6, groupContact), this.setState({groupContact:groupContact.trim()})}} />
                        </View>

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field7]}>
                                Locaiton</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.location}
                                            onChangeText={(location) => {this.moveInputLabelUp(7, location), this.setState({location:location})}} />
                        </View>
                        
                        <View style={[CustomStyles.loginCheckForgotStyle,{ marginLeft:5,justifyContent: 'space-around'}]}>
                                <View>
                                     <CheckBox 
                                          label='ERP'
                                           color={'#000000'}
                                          checked={this.state.isERP}
                                            onChange={() => this.setState({ isERP: !this.state.isERP })}
                                        />
                                </View>
                                <View >     
                                <CheckBox 
                                          label='GPS'
                                           color={'#000000'}
                                          checked={this.state.isGPS}
                                            onChange={() => this.setState({ isGPS: !this.state.isGPS })}
                                        />
                                </View>     
                        </View>
                        
                        
                                           
                    </View>                    
                </View>                
             </ScrollView>


             <View style={{ flexDirection: 'row',bottom:0, position:'absolute',zIndex: 1  }}>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#dfdfdf", alignSelf: 'stretch' }}
                        onPress={() => { Actions.Drivers() }}
                    >
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={{ padding: 15, alignSelf: 'center' }}>
                                CANCEL
                        </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#1e4495", alignSelf: 'stretch' }}
                        onPress={() => { this.onSubmitTruckDetails() }}>
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={{ color: '#fff', padding: 15, alignSelf: 'center' }}>
                                SUBMIT
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>

        );
    }
}