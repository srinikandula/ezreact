import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid,
    CheckBox, TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CustomInput, renderIf, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';

export default class AddDriver extends Component {
    state = {
        selectedName: '',
        licenseValidityDate: "",
        trucks:[],
        name: '',
        mobile:'',
        licenseNo:'',
        salaryPM:'',
        selectedTruckId: ''

    };

    componentWillMount() {
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token},
            url: Config.routes.base + Config.routes.trucksList
        })
        .then((response) => {
            if (response.data.status) {
                console.log('driver ==>', response.data);
                this.setState({ trucks: response.data.trucks })
            } else {
                console.log('error in driver ==>', response);
                this.setState({ erpDashBroadData: [], expirydetails: [] });
            }

        }).catch((error) => {
            console.log('error in baskets ==>', error);
        })
    }

    moveInputLabelUp(id, value) {
        if(id===0){
            this.setState({ ['field' + id]: { bottom: 50 }, name: value });            
        }
        if(id===1){
            this.setState({ ['field' + id]: { bottom: 50 }, mobile: value });            
        }
        if(id===2){
            this.setState({ ['field' + id]: { bottom: 50 }, licenseNo: value });            
        }
        if(id===4){
            this.setState({ ['field' + id]: { bottom: 50 }, salaryPM: value });            
        }
        //console.log(this.state.name, this.state.mobile,this.state.licenseNo,this.state.licenseValidityDate, this.state.selectedTruckId,this.state.salaryPM );
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
                    let licenseValidityDate =
                        response.day + "/" + (response.month + 1) + "/" + response.year
                        ;
                    this.setState({
                        licenseValidityDate,

                        ['field' + 3]: { bottom: 50 }, selectedName: licenseValidityDate
                    });

                }
            }).catch((error) => {
                console.log(error);
            });
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }

    }
    onSubmitDriverDetails() {
        if(!this.state.name||!this.state.mobile||!this.state.licenseNo||!this.state.salaryPM){
            ToastAndroid.show('Please provide all details', ToastAndroid.SHORT)
        }else {
            console.log(this.state.name, 
                this.state.mobile, 
                this.state.licenseNo, 
                new Date(this.state.licenseValidityDate),
                this.state.selectedTruckId, 
                this.state.salaryPM
            );
           /*  Axios({
                method: 'post',
                url: Config.routes.base+Config.routes.addDriver,
                headers: {'token': this.props.token},
                data: {

                }
            }) */
        }

    }
    renderTrucksRegNo(){
        return this.state.trucks.map((truckItem, i) =>
        <Picker.Item
            key={i}
            label={truckItem.registrationNo}
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
                        Add Driver
                        </Text>
                </View>
                <View>
                    <ScrollView>
                        <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field0]}>Full Name</CustomText>
                                <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.name}
                                    onChangeText={(name) => this.moveInputLabelUp(0, name)} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field1]}>Contact Number</CustomText>
                                <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.mobile}
                                    onChangeText={(mobile) => this.moveInputLabelUp(1, mobile)} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field2]}>License Number</CustomText>
                                <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.licenseNo}
                                    onChangeText={(licenseNo) => this.moveInputLabelUp(2, licenseNo)} />
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.onPickdate() }}
                            >
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field3]}>License Validity</CustomText>
                                            <CustomEditText editable={false} underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.licenseValidityDate}
                                                onChangeText={(licenseValidityDate) => this.moveInputLabelUp(3, licenseValidityDate)} />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />

                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <Picker
                                    style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.selectedTruckId}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedTruckId: itemValue })}>
                                     <Picker.Item label="Select Truck" value="Select Truck" />
                                    {this.renderTrucksRegNo()}
                                </Picker>
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 10, color: '#525252' }, this.state.field4]}>Salary Per Month</CustomText>
                                <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }} value={this.state.salaryPM}
                                    onChangeText={(salaryPM) => this.moveInputLabelUp(4, salaryPM)} />
                            </View>
                        </View>

                    </ScrollView>

                </View>
                <View style={{ flexDirection: 'row' }}>
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
                        onPress={() => { this.onSubmitDriverDetails() }}>
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