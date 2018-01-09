import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid,
    CheckBox, TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import { Actions } from 'react-native-router-flux';

export default class AddTruck extends Component {
    //"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
  
    state = {
        selectedName: '',
        truckNumber: '',
        trucktonnage: '',
        truckmodel: '',
        trucktype: '',
        TaxDueDate:'',
        PermitDate:'',
        FitnessDate:'',
        PollutionDate:'',
        InsuranceDate:'',
        taxpassdate:'',
        permitpassdate:'',
        fitnesspassdate:'',
        pollpassdate:'',
        insurpassdate:'',
        selectedDriverId:'',
        Amount:'',
        paymentref:'',
        remark:'',
        drivers:[],
        spinnerBool: false
    };
    componentWillMount() {
        console.log("payment token",this.props.token);
        Axios({
            method: 'get',
            headers: { 'token': this.props.token},
            url: Config.routes.base + Config.routes.driverList
        })
        .then((response) => {
            if (response.data.status) {
                console.log('driversList from add Truck ==>', response.data);
                this.setState({ drivers: response.data.drivers });
                if(this.props.edit){
                    this.getTruckDetails(this.props.id);
                }
            } else {
                console.log('error in DriverList from add Truck ==>', response);
                this.setState({ drivers: [], expirydetails: [] });
            }

        }).catch((error) => {
            console.log('error in add drivers from add Truck ==>', error);
        })
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
                    // Actions.pop();
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
    //  Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }
   
    onPickdate(look) {
        try {              
            let currDate = new Date();
            const { action, year, month, day } = DatePickerAndroid.open({
                date: new Date(),

                //minDate: currDate.setDate(currDate.getDate() + 2),
                minDate: new Date(),
            }).then((response) => {
                if (response.action === "dateSetAction") {
                var month = response.month + 1
                let date =  response.day+"/"+month+"/"+ response.year;
                var pdate = new Date(month+"/"+response.day+"/"+ response.year);
                    if(look==='TaxDue'){
                       
                        this.setState({ TaxDueDate:date,taxpassdate: pdate});
                        this.moveInputLabelUp(4, date)
                         console.log(date);
                         }else if(look==='Permit'){
                            this.setState({ PermitDate:date,permitpassdate:pdate });
                            this.moveInputLabelUp(5, date)
                             console.log(date);
                            }else if(look==='Fitness'){
                                this.setState({ FitnessDate:date,fitnesspassdate:pdate });
                                this.moveInputLabelUp(6, date)
                                 console.log(date);
                                }else if(look==='Pollution'){
                                   this.setState({ PollutionDate:date,pollpassdate:pdate });
                                    this.moveInputLabelUp(7, date)
                                     console.log(date);
                                    }else if(look==='Insurance'){
                                       this.setState({ InsuranceDate:date,insurpassdate:pdate });
                                        this.moveInputLabelUp(8, date)
                                         console.log(date);
                                         }return false;
                }
            }).catch((error) => {
                console.log(error);
            });
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    onSubmitTruckDetails() {
        //if(this.state.date.includes('/')){
        if(this.state.truckNumber.length > 0){
            if(this.state.trucktonnage.length > 0){
                if(this.state.truckmodel.length > 0){
                    if(this.state.trucktype.length > 0){
                        if(this.state.TaxDueDate.includes('/')){
                            if(this.state.PermitDate.includes('/')){
                                if(this.state.FitnessDate.includes('/')){
                                    if(this.state.PollutionDate.includes('/')){
                                        if(this.state.InsuranceDate.includes('/')){
                                            let driverID = this.state.selectedDriverId;
                                            if(this.state.selectedDriverId.includes("Select Driver")){
                                                driverID = "";
                                            }

                                            var postData= {
                                                'registrationNo' :this.state.truckNumber,
                                                'truckType':this.state.trucktype,
                                                'modelAndYear':this.state.truckmodel,
                                                'tonnage':this.state.trucktonnage,
                                                'fitnessExpiry':this.state.fitnesspassdate.toISOString(),
                                                'insuranceExpiry':this.state.insurpassdate.toISOString(),
                                                'permitExpiry':this.state.permitpassdate.toISOString(),
                                                'pollutionExpiry':this.state.pollpassdate.toISOString(),
                                                'taxDueDate':this.state.taxpassdate.toISOString(),
                                                'driverId':driverID,
                                                };

                                            this.callAddPaymentAPI(postData);
                                        }else{
                                            ToastAndroid.show('Please Enter Insurance Date', ToastAndroid.SHORT);
                                        }
                                    }else{
                                        ToastAndroid.show('Please Enter Pollution Date', ToastAndroid.SHORT);
                                    }
                                }else{
                                    ToastAndroid.show('Please Enter Fitness Date', ToastAndroid.SHORT);
                                }
                            }else{
                                ToastAndroid.show('Please Enter Permit Date', ToastAndroid.SHORT);
                            }
                        }else{
                            ToastAndroid.show('Please Enter TaxDue Date', ToastAndroid.SHORT);
                        }
                    }else{
                        ToastAndroid.show('Please Enter Truck Type', ToastAndroid.SHORT);
                    }                      
                }else{
                    ToastAndroid.show('Please Enter Truck model', ToastAndroid.SHORT);
                }                  
            }else{
                ToastAndroid.show('Please Enter Truck Tonnage', ToastAndroid.SHORT);
            }            
        }else{
            ToastAndroid.show('Please Enter Truck Number', ToastAndroid.SHORT);
        }
    }

    
    

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }

    renderPartyList(){
        return this.state.drivers.map((truckItem, i) =>
                                    <Picker.Item
                                        key={i}
                                        label={truckItem.fullName}
                                        value={truckItem._id}
                                    />
                                );
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
                        Add Truck
                        </Text>
                </View>
               <ScrollView >
                <View style={{marginBottom:25,paddingBottom:10}}>
                    
                    <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                        {this.spinnerLoad()}

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}>
                                        Truck Number*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.truckNumber}
                                            onChangeText={(truckNumber) => {this.moveInputLabelUp(0, truckNumber), this.setState({truckNumber:truckNumber})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>
                                        Tonnage*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.trucktonnage}
                                            onChangeText={(trucktonnage) => {this.moveInputLabelUp(1, trucktonnage), this.setState({trucktonnage:trucktonnage})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>
                                        Model*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.truckmodel}
                                            onChangeText={(truckmodel) => {this.moveInputLabelUp(2, truckmodel), this.setState({truckmodel:truckmodel})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>
                                        Truck type*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.trucktype}
                                            onChangeText={(trucktype) => {this.moveInputLabelUp(3, trucktype), this.setState({trucktype:trucktype})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field10]}>Driver Name*</CustomText>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={this.state.selectedDriverId}
                                onValueChange={(itemValue, itemIndex) => this.setState({ selectedDriverId: itemValue })}>
                                 <Picker.Item label="Select Driver" value="Select Driver" />
                                {this.renderPartyList()}
                                
                            </Picker>
                        </View>
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate('TaxDue') }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field4]}>Tax Due Expiry Date* </CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.TaxDueDate} >
                                            {this.state.TaxDueDate}
                                        </CustomEditText>                                            
                                    </View>
                                
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                                                source={require('../images/calanderLogo.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate('Permit') }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field5]}>Permit Expiry Date* </CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.PermitDate} >
                                            {this.state.PermitDate}
                                            </CustomEditText>
                                    </View>
                                
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                                            source={require('../images/calanderLogo.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> 
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate('Fitness') }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field6]}>Fitness Expiry Date* </CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.FitnessDate}
                                             >{this.state.FitnessDate} 
                                        </CustomEditText> 
                                    </View>
                                 
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                                            source={require('../images/calanderLogo.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> 
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate('Pollution') }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field7]}>Pollution Expiry Date* </CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.PollutionDate} >
                                            {this.state.PollutionDate}
                                        </CustomEditText>
                                    </View>
                                
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                                            source={require('../images/calanderLogo.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity> 
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate('Insurance') }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field8]}>Insurance Expiry Date* </CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.InsuranceDate} >
                                            {this.state.InsuranceDate}
                                            </CustomEditText>
                                    </View>
                                
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} 
                                            source={require('../images/calanderLogo.png')} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>                       
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