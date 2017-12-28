import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid,
    CheckBox, TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
//import { Actions } from 'react-native-router-flux';

export default class AddTruck extends Component {
    //"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
  
    state = {
        selectedName: '',
        date: "",
        passdate:'',
        paymentType:"paymenttype",
        selectedPartyId:'',
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
                console.log('driversList ==>', response.data);
                this.setState({ drivers: response.data.drivers })
            } else {
                console.log('error in drivers ==>', response);
                this.setState({ drivers: [], expirydetails: [] });
            }

        }).catch((error) => {
            console.log('error in add drivers ==>', error);
        })
    }

    callAddPaymentAPI(postdata){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'post',
            headers: { 'token': self.props.token },
            url: Config.routes.base + Config.routes.addPayment,
            data: postdata
        })
            .then((response) => {
                console.log(postdata,'<--callAddPaymentAPI ==>', response.data);
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
                console.log('error in callAddPaymentAPI ==>', error);
            })
    }
    onBackAndroid() {
     Actions.pop();
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
                    if(look==='TaxDue'){
                        this.setState({ TaxDueDate:date,passdate:month+"/"+response.day+"/"+ response.year });
                        this.moveInputLabelUp(4, date)
                         console.log(date);
                         }else if(look==='Permit'){
                            this.setState({ PermitDate:date,passdate:month+"/"+response.day+"/"+ response.year });
                            this.moveInputLabelUp(5, date)
                             console.log(date);
                            }else if(look==='Fitness'){
                                this.setState({ FitnessDate:date,passdate:month+"/"+response.day+"/"+ response.year });
                                this.moveInputLabelUp(6, date)
                                 console.log(date);
                                }else if(look==='Pollution'){
                                   this.setState({ PollutionDate:date,passdate:month+"/"+response.day+"/"+ response.year });
                                    this.moveInputLabelUp(7, date)
                                     console.log(date);
                                    }else if(look==='Insurance'){
                                       this.setState({ InsuranceDate:date,passdate:month+"/"+response.day+"/"+ response.year });
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
                ToastAndroid.show('Please Enter Party Name', ToastAndroid.SHORT);
            }
        }else{
            ToastAndroid.show('Please  Select Date', ToastAndroid.SHORT);
        }
    }

    getPaymentreferenceView(){
        let placeholderstr='References no  ' +this.state.paymentType;
        if(this.state.paymentType.includes('cash')){
            return ;
        }else if(!this.state.paymentType.includes('paymenttype') ){
            return   <View style={{ backgroundColor: '#ffffff', margin: 10, marginHorizontal: 5, borderWidth: 1, 
                            borderColor: '#000' }}>
                                        <CustomEditText underlineColorAndroid='transparent' 
                                        inputTextStyle={{ marginHorizontal: 16 }} 
                                        placeholder ={placeholderstr}
                                        value={this.state.paymentref}
                                        onChangeText={(paymentref) => {this.moveInputLabelUp(10, paymentref), this.setState({paymentref:paymentref})}} />
                                    </View>
        }else{
            return ;
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
               <ScrollView>
                <View>
                    
                    <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                    {this.spinnerLoad()}

                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}>Truck Number*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.Number}
                                onChangeText={(Number) => {this.moveInputLabelUp(0, Number), this.setState({Number:Number})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>Tonnage*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.Tonnage}
                                onChangeText={(Tonnage) => {this.moveInputLabelUp(1, Tonnage), this.setState({Tonnage:Tonnage})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>Model*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.Model}
                                onChangeText={(Model) => {this.moveInputLabelUp(2, Model), this.setState({Model:Model})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>Truck type*</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.salaryPM}
                                onChangeText={(Type) => {this.moveInputLabelUp(3, Type), this.setState({Type:Type})}} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field10]}>Driver Name*</CustomText>
                            <Picker
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={this.state.selectedPartyId}
                                onValueChange={(itemValue, itemIndex) => this.setState({ selectedPartyId: itemValue })}>
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
                                        onPress={() => { this.onPickdate('/index.htm/index.htm') }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field6]}>Fitness Expiry Date* </CustomText>
                                        <CustomEditText underlineColorAndroid='transparent'
                                            editable={false} 
                                            inputTextStyle={{ marginHorizontal: 16 }} 
                                            value={this.state.FitnessDate}
                                             >{this.state.FitnessDate} </CustomEditText>
                                            
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
               
                <View style={{ flexDirection: 'row' }}>
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
             </ScrollView>
            </View>

        );
    }
}