import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid, DatePickerIOS,
    CheckBox, TouchableOpacity, ScrollView, Keyboard, NetInfo, Dimensions, BackHandler, Platform
} from 'react-native';
import { CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground, Confirm, CPicker } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import Utils from './common/Utils';
import { NoInternetModal } from './common';
export default class AddTruck extends Component {
    //"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"

    state = {
        defaultDate: new Date(),
        look: '',
        showModal: false,
        selectedName: '',
        truckNumber: '',
        trucktonnage: '',
        truckmodel: '',
        trucktype: '',
        TaxDueDate: '',
        PermitDate: '',
        FitnessDate: '',
        PollutionDate: '',
        InsuranceDate: '',
        taxpassdate: '',
        permitpassdate: '',
        fitnesspassdate: '',
        pollpassdate: '',
        insurpassdate: '',
        selectedDriverId: 'Select Driver',
        selectedTruckTypeId:'',
        accountId: '',
        Amount: '',
        paymentref: '',
        remark: '',
        drivers: [],
        truckTypes:[{'_id':'Select Truck Type','title':'Select Truck Type'}],
         netFlaf: false,
        spinnerBool: false
    };
    componentWillMount() {
        // console.log("payment token", this.props.navigation.state.params.token);
        this.connectionInfo();
    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.fetchDriverList();
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.fetchDriverList();
                } else {
                    return this.setState({ netFlaf: true });
                }
            });
        }
    }
    async connectNetInfo(postData) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.callAddPaymentAPI(postData);
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.callAddPaymentAPI(postData);
                } else {
                    return this.setState({ netFlaf: true });
                }
            });
        }
    }

    fetchDriverList() {
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.driverList
        })
            .then((response) => {
                if (response.data.status) {
                    console.log('driversList from add Truck ==>', response.data);
                    this.setState({ drivers: response.data.drivers });
                    if (this.props.navigation.state.params.edit) {
                        this.getTruckDetails(this.props.navigation.state.params.id);
                    }
                } else {
                    console.log('error in DriverList from add Truck ==>', response);
                    this.setState({ drivers: [], expirydetails: [] });
                }

        }).catch((error) => {
            console.log('error in add drivers from add Truck ==>', error);
        });
        this.fetchTruckTypes();
    }


    fetchTruckTypes(){
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.getTruckTypes
        })
        .then((response) => {
            if (response.data.status) {
                console.log('getTruckTypes from add Truck ==>', response.data);
                var temptruckList = response.data.data;
                temptruckList.unshift({ _id: "Select Truck Type", title: "Select Truck Type" });
                this.setState({ truckTypes: temptruckList });
               
            } else {
                console.log('error in getTruckTypes from add Truck ==>', response);
                //this.setState({ truckTypes: [] });
            }

        }).catch((error) => {
            console.log('error in getTruckTypes from add Truck ==>', error);
        })
    }


    getTruckDetails(paymentID) {
        console.log(paymentID, "paymentID")
        const self = this;
        self.setState({ spinnerBool: true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.addtrucksList + paymentID,

        })
            .then((response) => {
                console.log(paymentID + '<--editPaymentAPI ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    this.updateViewdate(response.data.truck);

                } else {
                    // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool: false });
                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                }
            }).catch((error) => {
                console.log('error in editPaymentAPI ==>', error);
            })
    }

    updateViewdate(truckDetails) {
        const self = this;
        let driversList = self.state.drivers;
        let drivrID = truckDetails.hasOwnProperty('driverId') ? truckDetails.driverId:"" ;//driverId;
        let truckTypeId = truckDetails.hasOwnProperty('truckTypeId') ? truckDetails.truckTypeId :"";
        let truckTypesList = this.state.truckTypes;
        if (drivrID === "") {
            drivrID = 'Select Driver';
        } else {
            for (let i = 0; i < driversList.length; i++) {
                if (driversList[i]._id === drivrID) {
                    self.setState({ truckText: Platform.OS === 'ios'?driversList[i].fullName: driversList[i]._id+"###"+driversList[i].fullName })
                    break;
                }
            }
        }
        if (truckTypeId === "") {
            truckTypeId = 'Select Truck Type';
        } else {
            for (let i = 0; i < truckTypesList.length; i++) {
                if (truckTypesList[i]._id === truckTypeId) {
                    self.setState({ truckType: Platform.OS === 'ios' ? truckTypesList[i].title:truckTypesList[i]._id + '###' +truckTypesList[i].title  });
                    break;
                }
            }
        }
        this.setState({
            truckNumber: truckDetails.registrationNo,
            trucktonnage: truckDetails.hasOwnProperty('tonnage') ?truckDetails.tonnage:"",
            truckmodel: truckDetails.hasOwnProperty('modelAndYear') ?truckDetails.modelAndYear :"",
            //truckType: truckDetails.truckType,
            selectedTruckTypeId :truckTypeId,
            TaxDueDate: this.getDateDDMMYY(truckDetails.taxDueDate),
            PermitDate: this.getDateDDMMYY(truckDetails.permitExpiry),
            FitnessDate: this.getDateDDMMYY(truckDetails.fitnessExpiry),
            PollutionDate: this.getDateDDMMYY(truckDetails.pollutionExpiry),
            InsuranceDate: this.getDateDDMMYY(truckDetails.insuranceExpiry),
            taxpassdate: this.getDateISo(truckDetails.taxDueDate),
            permitpassdate: this.getDateISo(truckDetails.permitExpiry),
            fitnesspassdate: this.getDateISo(truckDetails.fitnessExpiry),
            pollpassdate: this.getDateISo(truckDetails.pollutionExpiry),
            insurpassdate: this.getDateISo(truckDetails.insuranceExpiry),
            selectedDriverId: drivrID,
            accountId: truckDetails.accountId
        });
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "55")

        }
    }

    getDateDDMMYY(dateString) {
        var date = new Date(dateString);
        var dateStr = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        return dateStr;
    }


    getDateISo(dateString) {
        var date = new Date(dateString);
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

        var passdate = new Date(passdateStr);
        return passdate;
    }

    callAddPaymentAPI(postdata) {
        const self = this;
        self.setState({ spinnerBool: true });
        var methodType = 'post';
        if (this.props.navigation.state.params.edit) {
            methodType = 'put';
            postdata._id = self.props.navigation.state.params.id;
            postdata.accountId = self.state.accountId;
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.addtrucksList,
            data: postdata
        })
            .then((response) => {
                console.log(Config.routes.base + Config.routes.addtrucksList, "URL");
                console.log(postdata, '<--addtrucksList ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    // Actions.pop();
                    const { navigation } = this.props;
                    const { state } = navigation;
                    let refreshFunc = state.params.refresh;
                    if (typeof refreshFunc === 'function') {
                        refreshFunc({ refresh: true });
                    }
                    this.props.navigation.goBack();

                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                } else {
                    self.setState({ spinnerBool: false });
                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                }
            }).catch((error) => {
                console.log('error in addtrucksList ==>', error);
            })
    }
    onBackAndroid() {
        //  Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { display: value === '' ? 'none' : 'flex' }, selectedName: value });
    }

    onPickdate(look) {
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal, look: look })
        } else {
            try {
                let currDate = new Date();
                const { action, year, month, day } = DatePickerAndroid.open({
                    date: new Date(),

                    //minDate: currDate.setDate(currDate.getDate() + 2),
                    minDate: new Date(),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        var pdate = new Date(month + "/" + response.day + "/" + response.year);
                        if (look === 'TaxDue') {

                            this.setState({ TaxDueDate: date, taxpassdate: pdate });
                            this.moveInputLabelUp(4, date)
                            console.log(date);
                        } else if (look === 'Permit') {
                            this.setState({ PermitDate: date, permitpassdate: pdate });
                            this.moveInputLabelUp(5, date)
                            console.log(date);
                        } else if (look === 'Fitness') {
                            this.setState({ FitnessDate: date, fitnesspassdate: pdate });
                            this.moveInputLabelUp(6, date)
                            console.log(date);
                        } else if (look === 'Pollution') {
                            this.setState({ PollutionDate: date, pollpassdate: pdate });
                            this.moveInputLabelUp(7, date)
                            console.log(date);
                        } else if (look === 'Insurance') {
                            this.setState({ InsuranceDate: date, insurpassdate: pdate });
                            this.moveInputLabelUp(8, date)
                            console.log(date);
                        } return false;
                    }
                }).catch((error) => {
                    console.log(error);
                });
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    onAccept() {
        if (this.state.look === 'TaxDue' && this.state.TaxDueDate === '') {
            alert('Select a date');
        } else if (this.state.look === 'Permit' && this.state.PermitDate === '') {
            alert('Select a date');
        } else if (this.state.look === 'Fitness' && this.state.FitnessDate === '') {
            alert('Select a date');
        } else if (this.state.look === 'Pollution' && this.state.PollutionDate === '') {
            alert('Select a date');
        } else if (this.state.look === 'Insurance' && this.state.InsuranceDate === '') {
            alert('Select a date');
        } else {
            this.setState({ showModal: false })
        }
    }

    onDecline() {
        if (this.state.look === 'TaxDue') {
            this.setState({ field4: { bottom: 10 }, showModal: false, TaxDueDate: '', taxpassdate: '' });
        } else if (this.state.look === 'Permit') {
            this.setState({ field5: { bottom: 10 }, showModal: false, PermitDate: '', permitpassdate: '' });
        } else if (this.state.look === 'Fitness') {
            this.setState({ field6: { bottom: 10 }, showModal: false, FitnessDate: '', fitnesspassdate: '' });
        } else if (this.state.look === 'Pollution') {
            this.setState({ field7: { bottom: 10 }, showModal: false, PollutionDate: '', pollpassdate: '' });
        } else if (this.state.look === 'Insurance') {
            this.setState({ field8: { bottom: 10 }, showModal: false, InsuranceDate: '', insurpassdate: '' });
        }
    }

    onSubmitTruckDetails() {
        //if(this.state.date.includes('/')){
        if (this.state.truckNumber.length > 0) {
            if (this.state.trucktonnage.length > 0) {
                if (this.state.truckmodel.length > 0) {
                    if (!this.state.selectedTruckTypeId.includes('Select Truck Type')) {
                        if (this.state.TaxDueDate.includes('/')) {
                            if (this.state.PermitDate.includes('/')) {
                                if (this.state.FitnessDate.includes('/')) {
                                    if (this.state.PollutionDate.includes('/')) {
                                        if (this.state.InsuranceDate.includes('/')) {
                                            let driverID = this.state.selectedDriverId;
                                            if (this.state.selectedDriverId.includes('Select Driver')) {
                                                driverID = "";
                                            }

                                            var postData = {
                                                'registrationNo': this.state.truckNumber,
                                                'truckType': this.state.truckType.includes('###') ? this.state.truckType.split("###")[1] :this.state.truckType ,
                                                'modelAndYear': this.state.truckmodel,
                                                'tonnage': this.state.trucktonnage,
                                                'fitnessExpiry': this.state.fitnesspassdate.toISOString(),
                                                'insuranceExpiry': this.state.insurpassdate.toISOString(),
                                                'permitExpiry': this.state.permitpassdate.toISOString(),
                                                'pollutionExpiry': this.state.pollpassdate.toISOString(),
                                                'taxDueDate': this.state.taxpassdate.toISOString(),
                                                'driverId': driverID,
                                                'truckTypeId':this.state.selectedTruckTypeId
                                            };

                                            this.connectNetInfo(postData)


                                        } else {
                                            Utils.ShowMessage('Please Enter Insurance Date');
                                        }
                                    } else {
                                        Utils.ShowMessage('Please Enter Pollution Date');
                                    }
                                } else {
                                    Utils.ShowMessage('Please Enter Fitness Date');
                                }
                            } else {
                                Utils.ShowMessage('Please Enter Permit Date');
                            }
                        } else {
                            Utils.ShowMessage('Please Enter TaxDue Date');
                        }
                    } else {
                        Utils.ShowMessage('Please Select Truck Type');
                    }
                } else {
                    Utils.ShowMessage('Please Enter Truck model');
                }
            } else {
                Utils.ShowMessage('Please Enter Truck Tonnage');
            }
        } else {
            Utils.ShowMessage('Please Enter Truck Number');
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    renderTruckTypeList(){
        return this.state.truckTypes.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.title}
                value={truckItem._id + "###" + truckItem.title}
            />
        );
    }

    renderPartyList() {
        return this.state.drivers.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.fullName}
                value={truckItem._id + "###" + truckItem.fullName}
            />
        );
    }
    
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 5, backgroundColor: '#1e4495', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Image
                            style={{ width: 20, marginLeft: 20 }}
                            resizeMode='contain'
                            source={require('../images/backButtonIcon.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: '#fff', paddingLeft: 20, fontFamily: 'Gotham-Light' }}>
                        ADD TRUCK
                        </Text>
                </View>
                <ScrollView >
                    <View style={{ marginBottom: 25, paddingBottom: 10 }}>

                        <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                            {this.spinnerLoad()}

                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field0]}>
                                    Truck Number*</CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    placeholder={'Truck Number*'}
                                    value={this.state.truckNumber}
                                    onChangeText={(truckNumber) => {
                                        this.moveInputLabelUp(0, truckNumber),
                                            this.setState({ truckNumber: truckNumber })
                                    }} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field1]}>
                                    Tonnage*</CustomText>
                                <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }}
                                    value={this.state.trucktonnage}
                                    placeholder={'Tonnage*'}
                                    onChangeText={(trucktonnage) => {
                                        this.moveInputLabelUp(1, trucktonnage),
                                            this.setState({ trucktonnage: trucktonnage })
                                    }} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field2]}>
                                    Model*</CustomText>
                                <CustomEditText underlineColorAndroid='transparent' inputTextStyle={{ marginHorizontal: 16 }}
                                    value={this.state.truckmodel}
                                    placeholder={'Model*'}
                                    onChangeText={(truckmodel) => { this.moveInputLabelUp(2, truckmodel), this.setState({ truckmodel: truckmodel }) }} />
                            </View>
                            
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field10]}>Driver Name*</CustomText>
                                <CPicker
                                    cStyle={CustomStyles.cPickerStyle}
                                    selectedValue={this.state.truckType}
                                    onValueChange={(itemValue, itemIndex) => {this.setState({ truckType: Platform.OS==='ios'?itemValue.split("###")[1]: itemValue, selectedTruckTypeId: itemValue.split("###")[0]})
                                     } }
                                        >
                                    {this.renderTruckTypeList()}
                                </CPicker>
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field10]}>Driver Name*</CustomText>
                                {<CPicker
                                    placeholder="Select  Driver"
                                    cStyle={CustomStyles.cPickerStyle}
                                    selectedValue={this.state.truckText}
                                    onValueChange={(itemValue, itemIndex) => {this.setState({ truckText: Platform.OS==='ios'?itemValue.split("###")[1]:itemValue, selectedDriverId: itemValue.split("###")[0] })}}>
                                    <Picker.Item label="Select Driver" value="Select Driver" />
                                    {this.renderPartyList()}
                                </CPicker>}
                                
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.onPickdate('TaxDue') }}
                            >
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field4]}>
                                                Tax Due Expiry Date* </CustomText>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Tax Due Expiry Date*'}
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
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field5]}>
                                                Permit Expiry Date* </CustomText>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Permit Expiry Date*'}
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
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field6]}>
                                                Fitness Expiry Date* </CustomText>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Fitness Expiry Date*'}
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
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field7]}>
                                                Pollution Expiry Date* </CustomText>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Pollution Expiry Date*'}
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
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field8]}>
                                                Insurance Expiry Date* </CustomText>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Insurance Expiry Date*'}
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
                        <NoInternetModal visible={this.state.netFlaf}
                            onAccept={() => { this.setState({ netFlaf: false }) }} />
                    </View>
                </ScrollView>


                <View style={{ flexDirection: 'row', bottom: 0, position: 'absolute', zIndex: 1 }}>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#dfdfdf", alignSelf: 'stretch' }}
                        onPress={() => { this.props.navigation.goBack() }}
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
                <Confirm visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                    sayNo="CANCEL"
                    sayYes="CONFIRM"
                >
                    <View style={{ flex: 1, padding: 20 }}>
                        <DatePickerIOS
                            date={this.state.defaultDate}
                            onDateChange={(pickedDate) => {
                                this.setState({defaultDate: pickedDate})
                                var month = pickedDate.getMonth() + 1
                                let date = pickedDate.getDate() + "/" + month + "/" + pickedDate.getFullYear();
                                var pdate = new Date(month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear());
                                if (this.state.look === 'TaxDue') {
                                    this.setState({ TaxDueDate: date, taxpassdate: pdate });
                                    this.moveInputLabelUp(4, date)
                                    console.log(date);
                                } else if (this.state.look === 'Permit') {
                                    this.setState({ PermitDate: date, permitpassdate: pdate });
                                    this.moveInputLabelUp(5, date)
                                    console.log(date);
                                } else if (this.state.look === 'Fitness') {
                                    this.setState({ FitnessDate: date, fitnesspassdate: pdate });
                                    this.moveInputLabelUp(6, date)
                                    console.log(date);
                                } else if (this.state.look === 'Pollution') {
                                    this.setState({ PollutionDate: date, pollpassdate: pdate });
                                    this.moveInputLabelUp(7, date)
                                    console.log(date);
                                } else if (this.state.look === 'Insurance') {
                                    this.setState({ InsuranceDate: date, insurpassdate: pdate });
                                    this.moveInputLabelUp(8, date)
                                    console.log(date);
                                } return false;

                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>

            </View>

        );
    }
}