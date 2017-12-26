import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid,
    CheckBox, TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CustomInput, renderIf, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import { Actions } from 'react-native-router-flux';

export default class AddParty extends Component {
    state = {
        selectedName: '',
        date: "",
        paymentType:"paymenttype",
        name:'',
        Amount:'',
        paymentref:'',
        remark:''
    };
    componentWillMount() {

    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { bottom: 50 }, selectedName: value });
    }

    onPickdate() {
        try {
            let currDate = new Date();
            const { action, year, month, day } = DatePickerAndroid.open({
                date: new Date(),
                //minDate: currDate.setDate(currDate.getDate() + 2),
                minDate: new Date(),
            }).then((response) => {
                if (response.action === "dateSetAction") {
                    let date =  response.day+"/"+response.month + 1+"/"+ response.year;
                    this.setState({ date });
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
            if(this.state.name.length > 0){
                if(this.state.Amount.length > 0 ){
                    if(!this.state.paymentType.includes("paymenttype") ){
                        if(this.state.paymentType.includes("cash")){
                            ToastAndroid.show('Validation Done,can call API ', ToastAndroid.SHORT);
                        }else{
                            if(this.state.paymentref.length>0){
                                ToastAndroid.show('Validation Done,can call API ', ToastAndroid.SHORT);
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
                                        onChangeText={(paymentref) => this.moveInputLabelUp(10, paymentref)} />
                                    </View>
        }else{
            return ;
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <ScrollView>
                    <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                
                        <TouchableOpacity
                                        onPress={() => { this.onPickdate() }}
                                    >
                            <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 5 }}>                                
                                        <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}> Date</CustomText>
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

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>Party Name</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.name}
                                onChangeText={(name) => this.moveInputLabelUp(1, name)} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>Amount</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.salaryPM}
                                onChangeText={(Amount) => this.moveInputLabelUp(2, Amount)} />
                        </View>
                        <View style={{ backgroundColor: '#ffffff',marginTop: 5,  marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                            <Picker
                                mode={'dropdown'}
                                style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                selectedValue={this.state.paymentType}
                                onValueChange={(itemValue, itemIndex) => this.setState({ paymentType: itemValue })}>
                                <Picker.Item label="Payment Type" value="paymenttype" />
                                <Picker.Item label="NEFT" value="neft" />
                                <Picker.Item label="CHECK" value="check" />
                                <Picker.Item label="CASH" value="cash" />
                            </Picker>
                        </View>
                            {this.getPaymentreferenceView()}
                        <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>Remark</CustomText>
                            <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.remark}
                                onChangeText={(remark) => this.moveInputLabelUp(3, remark)} />
                        </View>
                        
                    </View>
                    </ScrollView>
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

            </View>

        );
    }
}