import React, { Component } from 'react';
import {View, Image, Text, Picker, FlatList,
            TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
        } from 'react-native';
import CheckBox from 'react-native-checkbox';
import { CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import { Actions } from 'react-native-router-flux';

export default class AddParty extends Component {
    //"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
  
    state = {
        selectedName: '',
        partyName:'',
        partyContact:'',
        PartyMailID:'',
        PartyCity:'',
        tripLanes:[{from:'',to:'',laneName:''}],
        spinnerBool: false,
        showTripForm:false,
        checkTrip:false
    };
    componentWillMount() {
        console.log("AddParty token",this.props.token);        
    }


    getTruckDetails(paymentID){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.token },
            url: Config.routes.base + Config.routes.addtrucksList+paymentID,
            
        })
            .then((response) => {
                console.log(paymentID+'<--editPaymentAPI ==>', response.data);
                if (response.data.status) {    
                   self.setState({spinnerBool:false});
                    this.updateViewdate(response.data.truck);
                   
                } else {
                   // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool:false });
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                }
            }).catch((error) => {
                console.log('error in editPaymentAPI ==>', error);
            })
    }

    updateViewdate(truckDetails){
        
        let drivrID = truckDetails.driverId;
        if(truckDetails.driverId === null){

            drivrID = 'Select Driver';
        }
        this.setState({truckNumber: truckDetails.registrationNo,
                        trucktonnage: truckDetails.tonnage,
                        truckmodel: truckDetails.modelAndYear,
                        trucktype: truckDetails.truckType,
                        TaxDueDate:this.getDateDDMMYY(truckDetails.taxDueDate),
                        PermitDate:this.getDateDDMMYY(truckDetails.permitExpiry),
                        FitnessDate:this.getDateDDMMYY(truckDetails.fitnessExpiry),
                        PollutionDate:this.getDateDDMMYY(truckDetails.pollutionExpiry),
                        InsuranceDate:this.getDateDDMMYY(truckDetails.insuranceExpiry),
                        taxpassdate:this.getDateISo(truckDetails.taxDueDate),
                        permitpassdate:this.getDateISo(truckDetails.permitExpiry),
                        fitnesspassdate:this.getDateISo(truckDetails.fitnessExpiry),
                        pollpassdate:this.getDateISo(truckDetails.pollutionExpiry),
                        insurpassdate:this.getDateISo(truckDetails.insuranceExpiry),
                        selectedDriverId: drivrID
                    });
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

    callAddPaymentAPI(postdata){
        const self = this;
        self.setState({ spinnerBool:true });
        var methodType = 'post';
        if(this.props.edit){
            methodType = 'put';
            postdata._id = self.props.id;
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.token },
            url: Config.routes.base + Config.routes.addtrucksList,
            data: postdata
        })
            .then((response) => {
                console.log(Config.routes.base + Config.routes.addtrucksList,"URL");
                console.log(postdata,'<--addtrucksList ==>', response.data);
                if (response.data.status) {                    
                    self.setState({ spinnerBool:false });
                    Actions.pop();
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                } else {
                    self.setState({ spinnerBool:false });
                    let message ="";
                    if(response.data)
                    response.data.messages.forEach(function(current_value) {
                        message = message+current_value;
                    });
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                }
            }).catch((error) => {
                console.log('error in addtrucksList ==>', error);
            })
    }
    onBackAndroid() {
     Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }
   
    
    onSubmitTruckDetails() {
        if(this.state.PartyMailID.length < 0){
            return   ToastAndroid.show('Please Enter Truck model', ToastAndroid.SHORT);                     
        }

        if(this.state.partyName.length > 0){
            if(this.state.partyContact.length > 0){
                
            }else{
                ToastAndroid.show('Please Enter Party Contact', ToastAndroid.SHORT);
            }            
        }else{
            ToastAndroid.show('Please Enter Party Name', ToastAndroid.SHORT);
        }
    }

    
    

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }

    renderItem(item) {
           
                if(this.state.tripLanes.indexOf(item) == 0){
                    return ( <View style={{flexDirection: 'row', padding: 5}}>
                        <Text style={{ left: 20, bottom: 10, color: '#000000' }}>
                        {'Operation Lane'}</Text>
                    </View>  );
                }else{
                    return (  <View style={{flexDirection: 'row', padding: 5 ,backgroundColor:'#00ff00'}}>
                        <Text style={{ left: 20, bottom: 10, color: '#000000' }}>
                        {item.a}</Text>
                    </View>  );
                }
          
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
                                value={this.state.operationlane}
                                placeholder={'operation lane name'}
                                onChangeText={(operationlane) => {this.setState({operationlane:operationlane})}} />
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
        if((this.state.from.length == 0) && (this.state.to.length == 0) && (this.state.operationlane == 0)){
            this.setState({checkTrip: true});
        }else{
            
            if(this.state.from.length > 0){
                if(this.state.to.length > 0){
                    if(this.state.operationlane.length > 0){
                        var trip = {from:this.state.from,
                                    to:this.state.to,
                                    laneName:this.state.operationlane};
                        this.setState({checkTrip: true,})
                    }else{
                        this.setState({checkTrip: false});
                        ToastAndroid.show('Please Enter operation lane name ', ToastAndroid.SHORT);
                    }
                }else{
                    this.setState({checkTrip: false});
                    ToastAndroid.show('Please Enter Destination location ', ToastAndroid.SHORT);
                }
            }else{
                this.setState({checkTrip: false});
                ToastAndroid.show('Please Enter from location', ToastAndroid.SHORT);
            }   
            
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
                                Party Name*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.partyName}
                                            onChangeText={(partyName) => {this.moveInputLabelUp(0, partyName), this.setState({partyName:partyName})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>
                                        Contact Number*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.partyContact}
                                            onChangeText={(partyContact) => {this.moveInputLabelUp(1, partyContact), this.setState({partyContact:partyContact})}} />
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
                        <View style={[CustomStyles.loginCheckForgotStyle,{justifyContent: 'space-around'}]}>
                                <View>
                                     <CheckBox 
                                          label='Transporter'
                                           color={'#000000'}
                                          checked={this.state.transporter}
                                            onChange={() => this.setState({ rememberme: !this.state.transporter })}
                                        />
                                </View>
                                <View >     
                                <CheckBox 
                                          label='Supplier '
                                           color={'#000000'}
                                          checked={this.state.supplier}
                                            onChange={() => this.setState({ rememberme: !this.state.supplier })}
                                        />
                                </View>     
                        </View>
                        <View style={{ marginTop: 5, marginHorizontal: 5, borderBottomWidth: 0, borderBottomColor: '#ddd' }}>
                                <FlatList
                                    horizontal={false}
                                    data={this.state.tripLanes}
                                    renderItem={({item}) => this.renderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.data}
                                    selected={this.state.categoryBgColor}
                                />
                                <View style={{justifyContent:'flex-end',padding:2}}>     
                                    <TouchableOpacity
                                        style={{ position: 'absolute',right:1,bottom: 0,flex: 1, backgroundColor: "red", 
                                        alignSelf: 'stretch' }}
                                        onPress={() => {
                                            this.setState({ showTripForm: !this.state.showTripForm }, () => {
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
                        <View style={{ marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            {this.showTripLaneForm()}

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