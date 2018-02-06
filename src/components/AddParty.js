import React, { Component } from 'react';
import {View, Image, Text, Picker, FlatList,
            TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
        } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { CustomInput, CRadio,CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';

export default class AddParty extends Component {
    //"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
  
    state = {
        selectedName: '',
        partyName:'',
        partyContact:'',
        PartyMailID:'',
        PartyCity:'',
        from:'A',
        to:'B',
        name:'A-B',
        operationlane:'',
        tripLanes:[],
        spinnerBool: false,
        showTripForm:false,
        checkTrip:false,
        role:'',
        transporterBool:'none',
        suppliereBool:'none',
        isMail:false,
        isSms : false,
        accountId:''
    };
    componentWillMount() {
        // console.log("AddParty token",this.propsnavigation.state.params.);   
        if(this.props.navigation.state.params.edit){
            this.getPartyDetails(this.props.navigation.state.params.id);
        }     
    }


    getPartyDetails(partyID){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.getPartyDetails+partyID,
            
        })
            .then((response) => {
                console.log(partyID+'<--editpartyIDAPI ==>', response.data);
                if (response.data.status) {    
                   self.setState({spinnerBool:false});
                    this.updateViewdate(response.data.party);
                   
                } else {
                   // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool:false });
                    let message ="";
                    if(response.data)
                    response.data.message.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    Utils.ShowMessage(message);

                }
            }).catch((error) => {
                console.log('error in editpartyIDAPI ==>', error);
            })
    }

    updateViewdate(partyDetails){        
        console.log('partyDetails',partyDetails);
        this.setState({partyName:partyDetails.name,
                        partyContact:''+partyDetails.contact,
                        PartyMailID:partyDetails.email,
                        PartyCity:partyDetails.city,
                        tripLanes:partyDetails.tripLanes,
                        role:partyDetails.partyType,
                        isMail:partyDetails.isEmail,
                        isSms : partyDetails.isSms,
                        accountId:partyDetails.accountId
                    });
        if(partyDetails.partyType.includes('Transporter')){
            this.setState({
                transporterBool:'flex',suppliereBool:'none', role:'Transporter'        
            });
        }else{
            this.setState({
                transporterBool:'none', suppliereBool:'flex', role:'Supplier'
            });
        }
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "")
            
        }
    }

    getDateDDMMYY(dateString){
        var date = new Date(dateString);
        var dateStr =  date.getDate()+"/"+ (date.getMonth() +1)+"/" + date.getFullYear();
        console.log('dateStr',dateStr);
        return dateStr;
    }


    getDateISo(dateString){
        var date = new Date(dateString);
        var passdateStr =  (date.getMonth() +1)+"/"+date.getDate() +"/" + date.getFullYear();
        console.log('passdateStr',passdateStr);
        var passdate = new Date(passdateStr);
        return  passdate;
    }

    callAddPartytAPI(postdata){
        const self = this;
        self.setState({ spinnerBool:true });
        var methodType = 'post';
        var url = Config.routes.base + Config.routes.addParty
        if(this.props.navigation.state.params.edit){
            methodType = 'put';
            postdata._id = self.props.navigation.state.params.id;
            postdata.accountId = self.state.accountId;
            url = Config.routes.base + Config.routes.updatePartyDetails
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.navigation.state.params.token },
            url: url,
            data: postdata
        })
            .then((response) => {
                console.log(postdata,'<--addParty ==>', response.data);
                if (response.data.status) {                    
                    self.setState({ spinnerBool:false });
                    // Actions.pop();
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                        if(current_value.includes('Unauthorized access'))
                        this.props.navigation.navigate('login');
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
                console.log('error in addParty ==>', error);
            })
    }
    onBackAndroid() {
    //  Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }
   
    //click--
    onSubmitTruckDetails() {
        if(this.state.PartyMailID.length > 0){
            if(/^\S+@\S+\.\S+/.test(this.state.PartyMailID)){
                console.log("lll");
            }else{
                Utils.ShowMessage('Please Enter Valid Mail ID');
                
 
            }           
        }

        if(this.state.partyName.length > 0){
            if(this.state.partyContact.length >= 10){
                if(this.state.role.length > 0){
                    if(this.state.isMail || this.state.isSms){
                        if(this.state.role.includes('Supplier')){                           
                            var postData= {
                                'city':this.state.PartyCity,
                                'contact':this.state.partyContact,
                                'email':this.state.PartyMailID,
                                'isEmail':this.state.isMail,
                                'isSms':this.state.isSms,
                                'name':this.state.partyName,
                                'partyType':this.state.role,
                                'tripLanes':""
                                };
                            this.callAddPartytAPI(postData);
                        }else{
                            
                            if(this.state.tripLanes.length > 0){
                                var tlanes = this.state.tripLanes;
                                
                                var myJSON =  JSON.stringify(tlanes);
                                console.log('myJSON',myJSON.toString());
                                var postData= {
                                    'city':this.state.PartyCity,
                                    'contact':this.state.partyContact,
                                    'email':this.state.PartyMailID,
                                    'isEmail':this.state.isMail,
                                    'isSms':this.state.isSms,
                                    'name':this.state.partyName,
                                    'partyType':this.state.role,
                                    'tripLanes':tlanes
                                    };
                                    this.callAddPartytAPI(postData);
                            }else{
                                Utils.ShowMessage('Please Add Trip Lanes ');
                                

                            }
                        }
                        
                    }else{                                Utils.ShowMessage('Please Select Notification Type ');

             
                    }
                }else{                                Utils.ShowMessage('Please Select Role');


                }
            }else{                                Utils.ShowMessage('Please Enter Party Contact');


            }            
        }else{                                Utils.ShowMessage('Please Enter Party Name');


        }
    }

    
    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }

    renderItem(item) {
            return (  <View style={{flexDirection: 'row', padding: 5 ,backgroundColor:'#00ff00'}}>
                <Text style={{ left: 20, bottom: 10, color: '#000000' }}>
                {item.name}</Text>
            </View>  );
               
          
    }

    showTripLaneForm(){
        if(!this.state.showTripForm){
            return;
        }else{
            return (
                    <View>
                    <View style={[CustomStyles.loginCheckForgotStyle,{justifyContent: 'space-around'}]}>
                        <View style={{ flex: 1}}>
                            <CustomEditText underlineColorAndroid='transparent' 
                                    inputTextStyle={{ marginHorizontal: 16 }} 
                                    value={this.state.from}
                                    placeholder={'From'}
                                    onChangeText={(from) => {this.setState({from:from})}} />
                        </View>
                        <View style={{ flex: 1}}>             
                            <CustomEditText underlineColorAndroid='transparent' 
                                    inputTextStyle={{ marginHorizontal: 16 }} 
                                    value={this.state.to}
                                    placeholder={'To'}
                                    onChangeText={(to) => {this.setState({to:to})}} />
                        </View>            
                    </View>
                    <CustomEditText underlineColorAndroid='transparent' 
                                inputTextStyle={{ marginHorizontal: 16 }} 
                                value={this.state.name}
                                placeholder={'operation lane name'}
                                onChangeText={(name) => {this.setState({name:name})}} />
                    <View style={{alignItems:'flex-end',flex:1,alignSelf:'stretch'}}>     
                        <TouchableOpacity style={{ justifyContent:'flex-end',flex: 1,borderRadius: 10, 
                        backgroundColor: "red"}}
                            onPress={() => {this.onSubmitTripForm()}}>
                            <View >
                                <Text style={{ color: '#fff', marginLeft:5,padding: 15, alignSelf: 'center' }}>
                                    Add 
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View> 
                    </View>        
            );
        }
    }

    onSubmitTripForm(){
        //checkTrip
        if((this.state.from.length == 0) && (this.state.to.length == 0) && (this.state.name == 0)){
            this.setState({checkTrip: true});
        }else{
            
            if(this.state.from.length > 0){
                if(this.state.to.length > 0){
                    if(this.state.name.length > 0){
                        var trip = {from:this.state.from,to:this.state.to,name:this.state.name};
                        this.setState({checkTrip: true,});
                         this.state.tripLanes.push(trip);   
                         this.setState({tripLanes:this.state.tripLanes,showTripForm:true,
                                        from:'',
                                        to:'',
                                        name:''}); 
                                        console.log('this.state.tripLanes',this.state.tripLanes);
                      
                    }else{
                        this.setState({checkTrip: false});
                                                               Utils.ShowMessage('Please Enter operation lane name ');


                    }
                }else{
                    this.setState({checkTrip: false});
                                                          Utils.ShowMessage('Please Enter Destination location ');


                }
            }else{
                this.setState({checkTrip: false});
                                                    Utils.ShowMessage('Please Enter from location');


            }   
            
        }
    }
    renderLanesList(){
        if(this.state.role.includes('Supplier') || this.state.role.length == 0){
            return;
        }else{
            return this.state.tripLanes.map((lane, i)=>
                <View key={i} style={{flexDirection: 'row', padding: 5}}>
                    <CustomText customTextStyle={{ color: '#000000' }}>
                                        {lane.name}</CustomText>
                </View> 
            )
        }
    }

    changeRoleStatus(value){
        if(value === 'T'){
            this.setState({ transporterBool:'flex', suppliereBool:'none', role:'Transporter'});
        } else {
            this.setState({ transporterBool:'none', suppliereBool:'flex', role:'Supplier'});
        }
    }
    
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{flexDirection: 'row',height: 50, backgroundColor: '#1e4495',alignItems: 'center'}}>
                <TouchableOpacity onPress={()=> {this.props.navigation.goBack()}}>
                    <Image
                    style={{width: 20,marginLeft: 20}}
                    resizeMode='contain'
                    source={require('../images/backButtonIcon.png')}
                    />
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, color: '#fff', paddingLeft: 20, fontFamily: 'Gotham-Light'}}>
                        Add Party
                        </Text>
                </View>
               <ScrollView >
                <View style={{marginBottom:50,padding:10}}>
                    
                    <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                        {this.spinnerLoad()}

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}>
                                Party Name*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.partyName}
                                            onChangeText={(partyName) => {this.moveInputLabelUp(0, partyName), this.setState({partyName:partyName})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>
                                        Contact Number*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                           maxLength={Config.limiters.mobileLength}
                                           keyboardType='numeric'
                                            value={this.state.partyContact}
                                            onChangeText={(partyContact) => {this.moveInputLabelUp(1, partyContact), this.setState({partyContact:partyContact.trim()})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>
                                        Email Address</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.PartyMailID}
                                            onChangeText={(PartyMailID) => {this.moveInputLabelUp(2, PartyMailID), this.setState({PartyMailID:PartyMailID})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>
                                        City</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.PartyCity}
                                            onChangeText={(PartyCity) => {this.moveInputLabelUp(3, PartyCity), this.setState({PartyCity:PartyCity})}} />
                        </View>
                        <View style={[CustomStyles.row, CustomStyles.mTop10,CustomStyles.mBottom10]}>
                            <CRadio label='Transporter' activeStyle={{display:this.state.transporterBool,margin:10}} 
                                                    onPress={() => this.changeRoleStatus('T')} />
                            <CRadio label='Supplier' activeStyle={{display:this.state.suppliereBool,margin:10}} 
                                                        onPress={() => this.changeRoleStatus('S')} />
                        </View>
                        <View style={[CustomStyles.loginCheckForgotStyle,{ marginLeft:5,justifyContent: 'space-around'}]}>
                                <View>
                                     <CheckBox 
                                          label='SMS Notifiaction'
                                           color={'#000000'}
                                          checked={this.state.isSms}
                                            onChange={() => this.setState({ isSms: !this.state.isSms })}
                                        />
                                </View>
                                <View >     
                                <CheckBox 
                                          label='Email Notification'
                                           color={'#000000'}
                                          checked={this.state.isMail}
                                            onChange={() => this.setState({ isMail: !this.state.isMail })}
                                        />
                                </View>     
                        </View>
                        <View style={{display:this.state.transporterBool, marginTop: 5, marginHorizontal: 5, borderBottomWidth: 0, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={{ marginTop:15, left: 20, color: '#525252' }}>
                                        Operation Lane</CustomText>
                               {/* <View>
                                <FlatList 
                                        horizontal={false}
                                        data={this.state.tripLanes}
                                        renderItem={({item}) => this.renderItem(item)}
                                        keyExtractor={(item, index) => index}
                                        extraData={this.state.tripLanes}
                                    /> 
                               </View>  */}
                                {this.renderLanesList()} 
                                <View style={{justifyContent:'flex-end',padding:2}}>     
                                    <TouchableOpacity
                                        style={{ position: 'absolute',right:1,bottom: 0,flex: 1, backgroundColor: "red", 
                                        alignSelf: 'stretch' }}
                                        onPress={() => {
                                            this.setState({ showTripForm: true }, () => {
                                                console.log(this.state.showTripForm,"this.state.showTripForm");
                                            })
                                        }}>
                                        <View style={{ alignItems: 'stretch' }}>
                                            <Text style={{ color: '#fff', padding: 15, alignSelf: 'center' }}>
                                                Add more
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>     
                        </View>
                        <View style={{display:this.state.transporterBool, marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            {this.showTripLaneForm()}

                        </View>
                                           
                    </View>                    
                </View>                
             </ScrollView>


             <View style={{ flexDirection: 'row',bottom:0, position:'absolute',zIndex: 1  }}>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#dfdfdf", alignSelf: 'stretch' }}
                        onPress={() => { this.props.navigation.goBack()}}
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