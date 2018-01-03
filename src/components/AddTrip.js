import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid,
     TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import { Actions } from 'react-native-router-flux';
import CheckBox from 'react-native-checkbox';

export default class AddTrip extends Component {
    state = {
        date: "",
        passdate:'',
        selectedVehicleId:'',
        selectedDriverId:'',
        selectedPartyId:'',
        Amount:'',
        remark:'',
        trucks:[],
        drivers:[],
        partyList:[{_id:"Select Party", name:"Select Party"}],
        lanesList:[],
        share:true,
        rate:'',
        tonnage:'',
        famount:'',
        spinnerBool: false
    };
    componentWillMount() {
        console.log("payment token",this.props.token);
        this.getDataList('trucks',Config.routes.base + Config.routes.trucksList);
        
    }

    getDataList(calltype,url){
        const types = calltype;
        Axios({
            method: 'get',
            headers: { 'token': this.props.token},
            url: url
        })
        .then((response) => {
            if (response.data.status) {                
                if(types ==='trucks'){
                    console.log('trucksList from add trip ==>', response.data.trucks);
                    this.setState({ trucks: response.data.trucks },()=> {
                     console.log('trucks array is  ', this.state.trucks);
                    });
                    this.getDataList('drivers',Config.routes.base + Config.routes.driverList);
                    return ;
                }else if(types === 'drivers'){
                    console.log('driversListfrom add trip ==>', response.data.drivers);
                    this.setState({ drivers: response.data.drivers },()=> {
                        console.log('drivers array in add trip  ', this.state.drivers);
                       });
                       this.getDataList('Party',Config.routes.base + Config.routes.partyList);   
                       return ;
                }else{
                    var tempPArtList=response.data.parties;
                    tempPArtList.unshift({_id:"Select Party", name:"Select Party"})
                    this.setState({ partyList: tempPArtList },()=> {
                     console.log('party array isfrom add trip ', this.state.partyList);
                    })
                }            
            } else {
                console.log('error in add trip ==>', response);
                this.setState({ partyList: [] });
            }

        }).catch((error) => {
            console.log('error in add partyList ==>', error);
        })
    }
    

    

    
    onBackAndroid() {
     Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }

    onPickdate() {
        try {
            let currDate = new Date();            
            if(this.props.edit){
                currDate = new Date(this.state.date);
            }
            const { action, year, month, day } = DatePickerAndroid.open({
                date: new Date(),
                //minDate: currDate.setDate(currDate.getDate() + 2),
                minDate: currDate,
            }).then((response) => {
                if (response.action === "dateSetAction") {
                    var month = response.month + 1
                    let date =  response.day+"/"+month+"/"+ response.year;
                    this.setState({ date:date,passdate:month+"/"+response.day+"/"+ response.year });
                    this.moveInputLabelUp(0, date)

                }
            }).catch((error) => {
                console.log(error);
            });
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }

    }
    onSubmitPartyDetails() {
        if(this.state.date.includes('/')){
            if(!this.state.selectedPartyId.includes('Select Party')){
                if(this.state.Amount.length > 0 ){
                    if(!this.state.paymentType.includes("paymenttype") ){
                        var date = new Date(this.state.passdate);
                        console.log(date.toISOString());
                        if(this.state.paymentType.includes("cash")){
                            ToastAndroid.show('Validation Done,can call API ', ToastAndroid.SHORT);
                            var postData= {
                                'amount':this.state.Amount,
                                'date':date.toISOString(),
                                'description':this.state.remark,
                                'partyId':this.state.selectedPartyId,
                                'paymentRefNo':this.state.paymentref,
                                'paymentType':this.state.paymentType
                                };
                            this.callAddPaymentAPI(postData);
                        }else{
                            if(this.state.paymentref.length>0){
                                ToastAndroid.show('Validation Done,can call API ', ToastAndroid.SHORT);
                                var postData= {
                                    amount:this.state.Amount,
                                    'date':date.toISOString(),
                                    description:this.state.remark,
                                    partyId:this.state.selectedPartyId,
                                    paymentRefNo:this.state.paymentref,
                                    paymentType:this.state.paymentType
                                    };
                                this.callAddPaymentAPI(postData);
                            }else{
                                ToastAndroid.show('Please Enter Reference Number to '+ this.state.paymentType, ToastAndroid.SHORT);
                            } 
                        }  
                    }else{
                        ToastAndroid.show('Please Select Payment Type ', ToastAndroid.SHORT);
                    }                    
                }else{
                    ToastAndroid.show('Please Enter Amount ', ToastAndroid.SHORT);
                }
            }else{
                ToastAndroid.show('Please Select Party Name', ToastAndroid.SHORT);
            }
        }else{
            ToastAndroid.show('Please  Select Date', ToastAndroid.SHORT);
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }

    renderTrucksList(){
        return this.state.trucks.map((truckItem, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={truckItem.registrationNo}
                                        value={truckItem._id}
                                    />
                                );
    }

    renderDriverList(){
        return this.state.drivers.map((driverItem, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={driverItem.fullName}
                                        value={driverItem._id}
                                    />
                                );
    }

    renderPartyList(){
        return this.state.partyList.map((truckItem, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={truckItem.name}
                                        value={truckItem._id}
                                    />
                                );
    }


    renderLaneList(){
        return this.state.lanesList.map((truckItem, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={truckItem.name}
                                        value={truckItem.name}
                                    />
                                );
    }

    updateLaneList(itemValue){
        console.log('itemValue',itemValue);
       if(itemValue==='Select Party'){
           return;
       }
       else{
        for (let i=0;i< this.state.partyList.length; i++){
            console.log('lanesList',this.state.partyList[i]);
            console.log('lanesList in for',this.state.partyList[i].tripLanes);
            
            if(this.state.partyList[i]._id === itemValue){
                console.log(' in if',this.state.partyList[i].tripLanes);
                
                this.setState({lanesList: this.state.partyList[i].tripLanes},()=> {
                    console.log('lanesList',this.state.lanesList);
                    
                })
                break;
            }
        };
       }

    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <ScrollView>
                    <View style={{ backgroundColor: '#ffffff', margin: 10 ,marginBottom:40}}>
                    {this.spinnerLoad()}
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate() }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}> Trip Date</CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.date} />
                                            
                                    </View>
                                
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}>Vehicle Number*</CustomText>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={this.state.selectedVehicleId}
                                onValueChange={(itemValue, itemIndex) => this.setState({ selectedVehicleId: itemValue })}>
                                <Picker.Item label="Select Vehicle" value="Select Vehicle" />
                                {this.renderTrucksList()}
                                
                            </Picker>
                        </View>

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}>Driver Name*</CustomText>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={this.state.selectedDriverId}
                                onValueChange={(itemValue, itemIndex) => this.setState({ selectedDriverId: itemValue })}>
                                <Picker.Item label="Select Driver" value="Select Driver" />
                                {this.renderDriverList()}
                                
                            </Picker>
                        </View>

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}>Party Name*</CustomText>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={(this.state && this.state.selectedPartyId) || 'Select Party'}
                                onValueChange={(itemValue, itemIndex) => {
                                   this.updateLaneList(itemValue);
                                    this.setState({ selectedPartyId: itemValue })}}>
                                {/* <Picker.Item label="Select Party" value="Select Party" /> */}
                                {this.renderPartyList()}
                            </Picker>
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}> Lane*</CustomText>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={(this.state && this.state.selectedlaneId) || 'Select Lane'}
                                onValueChange={(itemValue, itemIndex) => {this.setState({ selectedlaneId: itemValue })}}>
                                 <Picker.Item label="Select Lane" value="Select lane" /> 
                                {this.renderLaneList()}
                            </Picker>
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>Rate </CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.rate}
                                onChangeText={(rate) => {this.moveInputLabelUp(2, rate), this.setState({rate:rate})}} />
                        </View>

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>Tonnage </CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.tonnage}
                                onChangeText={(tonnage) => {this.moveInputLabelUp(3, tonnage), this.setState({tonnage:tonnage})}} />
                        </View>                        

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field4]}>Frieght Amount </CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.famount}
                                onChangeText={(famount) => {this.moveInputLabelUp(4, famount), this.setState({famount:famount})}} />
                        </View>  

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field5]}>Remark</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.remark}
                                onChangeText={(remark) =>{ this.moveInputLabelUp(5, remark), this.setState({remark:remark})}} />
                        </View>

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                        <View style={{marginLeft: 15}}>
                                     <CheckBox 
                                          label='Share'
                                           color={'#000000'}
                                          checked={this.state.share}
                                            onChange={() => this.setState({ share: !this.state.share })}
                                        />
                                </View>
                            
                        </View>


                        
                    </View>
                    </ScrollView>
                </View>
               
                <View style={{flexDirection: 'row',bottom:0, position:'absolute',zIndex: 1   }}>
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
                        onPress={() => { this.onSubmitPartyDetails() }}>
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