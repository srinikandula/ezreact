import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid, DatePickerIOS, Platform, NetInfo,
    CheckBox, TouchableOpacity, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CPicker, CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import Utils from './common/Utils';
import { NoInternetModal } from './common';
export default class AddReceipts extends Component {
    //"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    state = {
        defaultDate: new Date(),
        showModal: false,
        selectedName: '',
        date: "",
        passdate: '',
        paymentType: "paymenttype",
        selectedPartyId: '',
        Amount: '',
        paymentref: '',
        remark: '',
        partyList: [],
        paymentsDetails: {},
        spinnerBool: false,
        accountId: '',
        netFlaf: false
    };
    componentWillMount() {
        // console.log("payment token",this.props.navigation.state.params.token);
        this.connectionInfo();


    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.fetchPartyList();
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.fetchPartyList();
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

    fetchPartyList() {
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.getpartyTrip
        })
            .then((response) => {
                if (response.data.status) {
                    console.log('partyList ==>', response.data.parties);
                    var tempPArtList = response.data.partyList;
                    tempPArtList.unshift({ _id: "Select Party", name: "Select Party" });
                    this.setState({ partyList: tempPArtList });
                    if (this.props.navigation.state.params.edit) {
                        this.getPaymentDetails(this.props.navigation.state.params.id);
                    }
                } else {
                    console.log('error in partyList ==>', response);
                    var tempPArtList = [];
                    tempPArtList.unshift({ _id: "Select Party", name: "Select Party" });
                    this.setState({ partyList: tempPArtList });
                    if (this.props.navigation.state.params.edit) {
                        this.getPaymentDetails(this.props.navigation.state.params.id);
                    }
                }

            }).catch((error) => {
                console.log('error in add partyList ==>', error);
            })
    }

    getPaymentDetails(paymentID) {
        const self = this;
        self.setState({ spinnerBool: true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.editReceipts + paymentID,

        })
            .then((response) => {
                console.log(paymentID + '<--editPaymentAPI ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    this.updateViewdate(response.data.paymentsDetails);

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

    updateViewdate(paymentDetails) {
        const self = this;
        let partyList = self.state.partyList;

        for (let i = 0; i < partyList.length; i++) {
            if (partyList[i]._id === paymentDetails.partyId) {
                self.setState({ truckText: Platform.OS === 'ios' ? partyList[i].name : partyList[i]._id + "###" + partyList[i].name })
            }
        }

        var date = new Date(paymentDetails.date);
        var dateStr = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        var amt = paymentDetails.amount.toString();
        this.setState({
            Amount: amt, remark: paymentDetails.description,
            date: dateStr,
            selectedPartyId: paymentDetails.partyId,
            passdate: passdateStr,
            paymentType: paymentDetails.paymentType,
            accountId: paymentDetails.accountId,//receiptRefNo
            paymentref: paymentDetails.receiptRefNo
        }, () => {
            console.log(this.state.selectedPartyId);
        });
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "55")

        }
    }

    callAddPaymentAPI(postdata) {
        const self = this;
        self.setState({ spinnerBool: true });
        var methodType = 'post';
        var url = Config.routes.addReceipts;
        if (this.props.navigation.state.params.edit) {
            methodType = 'put';
            url = Config.routes.updateReceipts;
            postdata._id = self.props.navigation.state.params.id;
            postdata.accountId = self.state.accountId;
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + url,
            data: postdata
        })
            .then((response) => {
                console.log(postdata, '<--callAddPaymentAPI ==>', response.data);
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
                console.log('error in callAddPaymentAPI ==>', error);
            })
    }
    onBackAndroid() {
        //  Actions.pop();
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
                        this.moveInputLabelUp(0, date)

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
        this.setState({ field0: { bottom: 10 }, showModal: false, date: '' });

    }

    onSubmitPartyDetails() {
        if (this.state.date.includes('/')) {
            if (!this.state.selectedPartyId.includes('Select Party')) {
                if (this.state.Amount.length > 0) {
                    if (!this.state.paymentType.includes("paymenttype")) {
                        var date = new Date(this.state.passdate);
                        console.log(date.toISOString());
                        if (this.state.paymentType.includes("cash")) {
                            var postData = {
                                'amount': this.state.Amount,
                                'date': date.toISOString(),
                                'description': this.state.remark,
                                'partyId': this.state.selectedPartyId,
                                'receiptRefNo': this.state.paymentref,
                                'paymentType': this.state.paymentType
                            };
                            this.connectNetInfo(postData);

                        } else {
                            if (this.state.paymentref.length > 0) {
                                var postData = {
                                    'amount': this.state.Amount,
                                    'date': date.toISOString(),
                                    'description': this.state.remark,
                                    'partyId': this.state.selectedPartyId,
                                    'receiptRefNo': this.state.paymentref,
                                    'paymentType': this.state.paymentType
                                };

                                this.connectNetInfo(postData);

                            } else {
                                Utils.ShowMessage('Please Enter Reference Number to ' + this.state.paymentType);
                            }
                        }
                    } else {
                        Utils.ShowMessage('Please Select Payment Type ');
                    }
                } else {
                    Utils.ShowMessage('Please Enter Amount ');
                }
            } else {
                Utils.ShowMessage('Please Select Party Name');
            }
        } else {
            Utils.ShowMessage('Please  Select Date');
        }
    }

    getPaymentreferenceView() {
        let placeholderstr = 'References no  ' + this.state.paymentType;
        if (this.state.paymentType.includes('cash')) {
            return;
        } else if (!this.state.paymentType.includes('paymenttype')) {
            return <View style={{
                backgroundColor: '#ffffff', margin: 10, marginHorizontal: 5, borderWidth: 1,
                borderColor: '#000'
            }}>
                <CustomEditText underlineColorAndroid='transparent'
                    inputTextStyle={{ marginHorizontal: 16 }}
                    placeholder={placeholderstr}
                    value={this.state.paymentref}
                    onChangeText={(paymentref) => { this.moveInputLabelUp(10, paymentref), this.setState({ paymentref: paymentref }) }} />
            </View>
        } else {
            return;
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    renderPartyList() {
        return this.state.partyList.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.name}
                value={truckItem._id + "###" + truckItem.name}
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
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
                            ADD PAYMENT
                        </Text>
                    </View>
                    <View>
                        <ScrollView>
                            <View style={{ backgroundColor: '#ffffff', margin: 5 }}>
                                {this.spinnerLoad()}
                                <TouchableOpacity
                                    onPress={() => { this.onPickdate() }}
                                >
                                    <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 5 }}>
                                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field0]}> Date</CustomText>
                                                <CustomEditText underlineColorAndroid='transparent'
                                                    editable={false}
                                                    placeholder={'Date*'}
                                                    inputTextStyle={{ marginHorizontal: 16 }}
                                                    value={this.state.date} />

                                            </View>

                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field9]}>Party Name</CustomText>

                                    <CPicker
                                        placeholder="Select  Party"
                                        cStyle={CustomStyles.cPickerStyle}
                                        selectedValue={this.state.truckText}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ truckText: Platform.OS === 'ios' ? itemValue.split("###")[1] : itemValue, selectedPartyId: itemValue.split("###")[0] })}>
                                        {/* <Picker.Item label="Select Driver" value="Select Driver" /> */}
                                        {this.renderPartyList()}

                                    </CPicker>
                                    {/*  <Picker
                            style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                            selectedValue={this.state.selectedPartyId}
                            onValueChange={(itemValue, itemIndex) => {this.setState({ selectedPartyId: itemValue })}}>
                            {this.renderPartyList()}
                        </Picker> */}
                                </View>
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field2]}>Amount</CustomText>
                                    <CustomEditText underlineColorAndroid='transparent'
                                        inputTextStyle={{ marginHorizontal: 16 }}
                                        keyboardType='numeric'
                                        placeholder={'Amount*'}
                                        value={this.state.Amount}
                                        onChangeText={(Amount) => { this.moveInputLabelUp(2, Amount), this.setState({ Amount: Amount }) }} />
                                </View>
                                <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field10]}>Payment mode</CustomText>
                                    <CPicker
                                        placeholder="Payment Type"
                                        cStyle={CustomStyles.cPickerStyle}
                                        selectedValue={this.state.paymentType}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ paymentType: itemValue })}>
                                        <Picker.Item label="Payment Type" value="paymenttype" />
                                        <Picker.Item label="NEFT" value="neft" />
                                        <Picker.Item label="CHECK" value="check" />
                                        <Picker.Item label="CASH" value="cash" />
                                    </CPicker>
                                </View>
                                {this.getPaymentreferenceView()}
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field3]}>Description</CustomText>
                                    <CustomEditText underlineColorAndroid='transparent'
                                        inputTextStyle={{ marginHorizontal: 16 }}
                                        placeholder={'Description'}
                                        value={this.state.remark}
                                        onChangeText={(remark) => { this.moveInputLabelUp(3, remark), this.setState({ remark: remark }) }} />
                                </View>

                            </View>
                        </ScrollView>
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
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
                        onPress={() => { this.onSubmitPartyDetails() }}>
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
                                this.moveInputLabelUp(0, date)
                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>

                <NoInternetModal visible={this.state.netFlaf}
                    onAccept={() => { this.setState({ netFlaf: false }) }} />
            </View>

        );
    }
}