import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid, DatePickerIOS, Platform, NetInfo,
    TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import {
    CustomInput, CPicker, renderIf, CustomEditText,NoInternetModal,
    CustomButton, CustomText, CommonBackground, Confirm
} from './common';
import Config from '../config/Config';
import Utils from '../components/common/Utils';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import CheckBox from 'react-native-checkbox';

export default class AddDriver extends Component {
    state = {
        defaultDate: new Date(),
        showModal: false,
        selectedName: '',
        licenseValidityDate: "",
        trucks: [],
        name: '',
        mobile: '',
        licenseNo: '',
        accountId: '',
        salaryPM: '',
        selectedTruckId: '',
        date: "",
        passdate: '',
        activeMe: false,
        netFlaf: false,
        spinnerBool: false

    };

    componentWillMount() {
        this.connectionInfo();
    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { this.onNetSuccess(); }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) { this.onNetSuccess(); }
                else { return this.setState({ netFlaf: true }); }
            });
        }
    }

    onNetSuccess() {
        this.setState({ netFlaf: false });
        this.fetchTruckList();
    }

    async connectNetInfo(postData) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.callAddDriverAPI(postData);
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.callAddDriverAPI(postData);
                } else {
                    return this.setState({ netFlaf: true });
                }
            });
        }
    }

    fetchTruckList() {
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.trucksList
        })
            .then((response) => {
                if (response.data.status) {
                    console.log('trucks from Add Driver ==>', response.data);
                    var tempTrucksList = response.data.trucks;
                    tempTrucksList.unshift({ _id: "Select Truck", registrationNo: "Select Truck" });
                    this.setState({ trucks: tempTrucksList });
                    if (this.props.navigation.state.params.edit) {
                        this.getDriverDetails(this.props.navigation.state.params.id);
                    }
                } else {
                    console.log('error in Add driver ==>', response);
                    var tempTrucksList = [];
                    tempTrucksList.unshift({ _id: "Select Truck", registrationNo: "Select Truck" });
                    this.setState({ trucks: tempTrucksList });
                    if (this.props.navigation.state.params.edit) {
                        this.getDriverDetails(this.props.navigation.state.params.id);
                    }
                }
            }).catch((error) => {
                console.log('error in baskets ==>', error);
            })
    }
    getDriverDetails(driverID) {
        console.log(driverID, "driverID")
        const self = this;
        self.setState({ spinnerBool: true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.getDriverInfo + driverID,

        })
            .then((response) => {
                console.log(driverID + '<--editDriverAPI ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    this.updateViewdate(response.data.driver);

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
                console.log('error in editdriverAPI ==>', error);
            })
    }

    updateViewdate(driverDetails) {
        //truckDetails.hasOwnProperty('driverId') ? truckDetails.driverId:"" ;//driverId;
        const self = this;
        let trucksList = self.state.trucks;
        let truckID = driverDetails.hasOwnProperty('truckId') ? driverDetails.truckId:'';
        if (truckID === '') {
            truckID = 'Select Truck';
        } else {
            for (let i = 0; i < trucksList.length; i++) {
                if (trucksList[i]._id === truckID) {
                    self.setState({ truckText: Platform.OS === 'ios' ? trucksList[i].registrationNo : trucksList[i]._id + "###" + trucksList[i].registrationNo })
                    break;
                }
            }
        }
        this.setState({
            name: driverDetails.fullName,
            mobile: '' + driverDetails.mobile,
            licenseNo:  driverDetails.hasOwnProperty('licenseNumber') ?  driverDetails.licenseNumber:'',
            date: driverDetails.hasOwnProperty('licenseValidity') ? this.getDateDDMMYY(driverDetails.licenseValidity):'',
            passdate: driverDetails.hasOwnProperty('licenseValidity') ?this.getDateISo(driverDetails.licenseValidity):'',
            selectedTruckId: truckID,
            salaryPM:   driverDetails.hasOwnProperty('salary') ? ""+driverDetails.salary:"",
            activeMe: driverDetails.isActive,
            accountId: driverDetails.accountId
        });
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "55")

        }
    }

    getDateDDMMYY(dateString) {
        var date = new Date(dateString);
        var dateStr = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        console.log('dateStr', dateStr);
        return dateStr;
    }


    getDateISo(dateString) {
        var date = new Date(dateString);
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        console.log('passdateStr', passdateStr);
        var passdate = new Date(passdateStr);
        return passdate;
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { display: value === '' ? 'none' : 'flex' }, selectedName: value });
    }




    onPickdate() {
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal })
        } else {
            try {
                let currDate = new Date();
                if (this.props.navigation.state.params.edit) {
                    currDate = new Date(this.state.date);
                }
                const { action, year, month, day } = DatePickerAndroid.open({
                    date: new Date(),
                    //minDate: currDate.setDate(currDate.getDate() + 2),
                    minDate: currDate,
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        this.setState({ date: date, passdate: month + "/" + response.day + "/" + response.year });
                        this.moveInputLabelUp(3, date)

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
        if (this.state.date === '') {
            alert('Select a date');
        } else {
            this.setState({ showModal: false })
        }
    }

    onDecline() {
        this.setState({ field3: { bottom: 10 }, showModal: false, date: '' });

    }


    onSubmitDriverDetails() {
        if (this.state.name.length >= 0) {
            if (this.state.mobile.length >= 10) {
                if (this.state.licenseNo.length >= 5) {
                    if (this.state.date.includes('/')) {
                        if (this.state.salaryPM.length > 0) {
                            var truckID = this.state.selectedTruckId;
                            if (this.state.selectedTruckId.includes('Select Truck')) {
                                truckID = "";
                            }
                            var date = new Date(this.state.passdate);
                            var postData = {
                                'fullName': this.state.name,
                                'licenseNumber': this.state.licenseNo,
                                'licenseValidity': date.toISOString(),
                                'mobile': Number(this.state.mobile),
                                'truckId': truckID,
                                'salary': Number(this.state.salaryPM),
                                'isActive': this.state.activeMe
                            };

                            this.connectNetInfo(postData);

                        } else {
                            Utils.ShowMessage('Please Enter Salary AMount');
                        }
                    } else {
                        Utils.ShowMessage('Please Enter Date');
                    }
                } else {
                    Utils.ShowMessage('Please Enter license No');
                }
            } else {
                Utils.ShowMessage('Please Enter 10 Digits Mobile N0');
            }
        } else {
            Utils.ShowMessage('Please Enter Name');
        }
    }

    callAddDriverAPI(postdata) {
        const self = this;
        self.setState({ spinnerBool: true });
        var methodType = 'post';
        var url = Config.routes.base + Config.routes.addDriver
        if (this.props.navigation.state.params.edit) {
            methodType = 'put';
            postdata._id = self.props.navigation.state.params.id;
            postdata.accountId = self.state.accountId;
            url = Config.routes.base + Config.routes.addDriver
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.navigation.state.params.token },
            url: url,
            data: postdata
        })
            .then((response) => {
                console.log(url, "URL");
                console.log(postdata, '<--addDriver ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    this.props.navigation.goBack();
                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                    const { navigation } = this.props;
                    const { state } = navigation;
                    let refreshFunc = state.params.refresh;
                    if (typeof refreshFunc === 'function') {
                        refreshFunc({ refresh: true });
                    }
                    this.props.navigation.goBack();
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
                console.log('error in addDriver ==>', error);
            })
    }
    renderTrucksRegNo() {
        return this.state.trucks.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.registrationNo}
                value={truckItem._id + "###" + truckItem.registrationNo}
            />
        );
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 5, backgroundColor: '#1e4495', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Image
                            style={{ width: 20, marginLeft: 20 }}
                            resizeMode='contain'
                            source={require('../images/backButtonIcon.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: '#fff', paddingLeft: 20, fontFamily: 'Gotham-Light' }}>
                        ADD DRIVER
                        </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <ScrollView>
                        <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field0]}>
                                    Full Name</CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    placeholder={'Full Name'}
                                    value={this.state.name}
                                    onChangeText={(name) => { this.moveInputLabelUp(0, name), this.setState({ name: name }) }} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field1]}>
                                    Contact Number</CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    placeholder={'Contact Number'}
                                    value={this.state.mobile}
                                    onChangeText={(mobile) => { this.moveInputLabelUp(1, mobile), this.setState({ mobile: mobile }) }} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field2]}>
                                    License Number</CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    placeholder={'License Number'}
                                    value={this.state.licenseNo}
                                    onChangeText={(licenseNo) => { this.moveInputLabelUp(2, licenseNo), this.setState({ licenseNo: licenseNo }) }} />
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.onPickdate() }}
                            >
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field3]}>
                                                License Validity</CustomText>
                                            <CustomEditText editable={false}
                                                underlineColorAndroid='transparent'
                                                inputTextStyle={{ marginHorizontal: 16 }}
                                                placeholder={'License Validity'}
                                                value={this.state.date} />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />

                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field10]}>
                                    Truck Num</CustomText>
                                <CPicker
                                    placeholder="Select Driver"
                                    cStyle={CustomStyles.cPickerStyle}
                                    selectedValue={this.state.truckText}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ truckText: Platform.OS === 'ios' ? itemValue.split("###")[1] : itemValue, selectedTruckId: itemValue.split("###")[0] })}>
                                    {this.renderTrucksRegNo()}

                                </CPicker>
                                {/*  <CPicker
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.selectedTruckId}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedTruckId: itemValue })}>
                                    {this.renderTrucksRegNo()}
                                </CPicker> */}
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field4]}>
                                    Salary Per Month</CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    placeholder={'Salary Per Month'}
                                    value={this.state.salaryPM}
                                    onChangeText={(salaryPM) => { this.moveInputLabelUp(4, salaryPM), this.setState({ salaryPM: salaryPM }) }} />
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginLeft: 10, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CheckBox
                                    checkboxStyle={{ width: 15, height: 15 }}

                                    label='Active'
                                    color={'#000000'}
                                    checked={this.state.activeMe}
                                    onChange={() => this.setState({ activeMe: !this.state.activeMe })}
                                />
                            </View>

                            <NoInternetModal visible={this.state.netFlaf}
                                onAccept={() => { this.setState({ netFlaf: false }) }} />
                        </View>
                    </ScrollView>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                        onPress={() => { this.onSubmitDriverDetails() }}>
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
                                this.setState({ defaultDate: pickedDate })
                                var month = pickedDate.getMonth() + 1
                                let date = pickedDate.getDate() + "/" + month + "/" + pickedDate.getFullYear();
                                this.setState({ date: date, passdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                this.moveInputLabelUp(3, date)
                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>
            </View>

        );
    }
}