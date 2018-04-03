import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid, DatePickerIOS, Platform,
    TouchableOpacity, ToastAndroid, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import {CPicker, CustomInput, CRadio, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import CheckBox from 'react-native-checkbox';

export default class AddExpense extends Component {
    state = {
        showModal: false,
        date: "",
        passdate: '',
        selectedVehicleId: '',
        selectedExpenseType: '',
        selectedPartyID: '',
        otherExpense: '',
        totalAmount: '',
        paidAmount: '',
        remark: '',
        accountId: '',
        trucks: [],
        expenses: [],
        partyList: [],
        otherExpenseInputViewBool: 'none',
        creditBool: 'none',
        cashBool: 'none',
        spinnerBool: false
    };
    componentWillMount() {
        this.getDataList('trucks', Config.routes.base + Config.routes.trucksList);

    }

    getDataList(calltype, url) {
        const types = calltype;
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token },
            url: url
        })
            .then((response) => {
                if (response.data.status) {
                    if (types === 'trucks') {
                        console.log('trucksList from add Expense ==>', response.data.trucks);
                        var tempTrucksList = response.data.trucks;
                        tempTrucksList.unshift({ _id: "Select Vehicle", registrationNo: "Select Vehicle" });

                        this.setState({ trucks: tempTrucksList }, () => {
                            console.log('trucks array is  ', this.state.trucks);
                        });
                        this.getDataList('expense', Config.routes.base + Config.routes.getExpensesType);
                        return;
                    } else if (types === 'expense') {
                        console.log('expenseListfrom add trip ==>', response.data.expenses);
                        this.setState({ expenses: response.data.expenses }, () => {
                            console.log('expenses array in add trip  ', this.state.expenses);
                        });
                        this.getDataList('suppliers', Config.routes.base + Config.routes.getAllSupplier);
                        return;
                    } else {
                        this.setState({ partyList: response.data.parties }, () => {
                            console.log('party array isfrom add trip ', this.state.partyList);
                        });

                        if (this.props.navigation.state.params.edit) {
                            this.getExpenseDetails(this.props.navigation.state.params.id);
                        }
                    }
                } else {
                    console.log('error in add trip ==>', response);
                    this.setState({ partyList: [] });
                }
            }).catch((error) => {
                console.log('error in add partyList ==>', error);
            })
    }


    getExpenseDetails(paymentID) {
        const self = this;
        self.setState({ spinnerBool: true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.getExpenseDetails + paymentID,

        })
            .then((response) => {
                console.log(paymentID + '<--editExpenseAPI ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    this.updateViewdate(response.data.expense);
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
                console.log('error in editExpenseAPI ==>', error);
            })
    }
    updateViewdate(expenseDetails) {

        const self = this;
        let trucksList = self.state.trucks;
        let expensesList = self.state.expenses;

        for (let i = 0; i < trucksList.length; i++) {
            if (trucksList[i]._id === expenseDetails.vehicleNumber) {
                self.setState({ truckText: trucksList[i].registrationNo })
            }
        }
        for (let i = 0; i < expensesList.length; i++) {
            if (expensesList[i]._id === expenseDetails.expenseType) {
                self.setState({ expenseText: expensesList[i].expenseName })
            }
        }
        var date = new Date(expenseDetails.date);
        var dateStr = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        this.setState({
            date: dateStr,
            passdate: passdateStr,
            selectedVehicleId: expenseDetails.vehicleNumber,
            selectedExpenseType: expenseDetails.expenseType,
            totalAmount: '' + expenseDetails.totalAmount,
            remark: expenseDetails.description,
            accountId: expenseDetails.accountId
        }, () => {

            console.log('party ID', );
        });

        if (expenseDetails.mode === 'Credit') {
            this.setState({ creditBool: 'flex', cashBool: 'none', paymentType: 'Credit', selectedPartyID: expenseDetails.partyId, paidAmount: '' + expenseDetails.paidAmount });
        } else {
            this.setState({ creditBool: 'none', cashBool: 'flex', paymentType: 'Cash', totalAmount: '' + expenseDetails.cost });
        }
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "55")
        }

    }

    callAddExpenseAPI(postdata) {
        const self = this;
        self.setState({ spinnerBool: true });
        var methodType = 'post';
        var url = Config.routes.base + Config.routes.addExpense
        if (this.props.navigation.state.params.edit) {
            methodType = 'put';
            postdata._id = self.props.navigation.state.params.id;
            postdata.accountId = self.state.accountId;
            url = Config.routes.base + Config.routes.updateExpenseDetails
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.navigation.state.params.token },
            url: url,
            data: postdata
        })
            .then((response) => {
                console.log(Config.routes.base + Config.routes.addExpense, "URL");
                console.log(postdata, '<--addExpense ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    // Actions.pop();
                    const {navigation} = this.props;
                    const {state} = navigation;
                    let refreshFunc = state.params.refresh;
                    if(typeof refreshFunc === 'function'){
                        refreshFunc({refresh:true});
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
                console.log('error in addExpense ==>', error);
            })
    }


    onBackAndroid() {
        //Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { display: value === ''? 'none':'flex' }, selectedName: value });
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

    onSubmitExpenseDetails() {
        if (this.state.date.includes('/')) {
            if (!this.state.selectedVehicleId.includes("Select Vehicle")) {
                if (!this.state.selectedExpenseType.includes("Select Expense Type")) {
                    if (this.state.selectedExpenseType.includes("other")) {
                        if (this.state.otherExpense.trim().length == 0) {
                            return
                            Utils.ShowMessage('Please Enter Expense Type');
                        }
                    }

                    if (this.state.paymentType.length > 0) {
                        //--Cash mode                        
                        if (this.state.paymentType === 'Cash') {
                            if (this.state.totalAmount.length > 0) {
                                var date = new Date(this.state.passdate);
                                var postData = {
                                    "date": date.toISOString(),
                                    "description": this.state.remark,
                                    "expenseName": this.state.otherExpense,
                                    "expenseType": this.state.selectedExpenseType,//for other type 
                                    "mode": this.state.paymentType,
                                    "paidAmount": this.state.paidAmount.length > 0 ? Number(this.state.paidAmount) : 0,// if mode is credit is mandatory
                                    //"partyId":this.state.selectedPartyID,
                                    "totalAmount": Number(this.state.totalAmount),
                                    "cost": Number(this.state.totalAmount),
                                    "vehicleNumber": this.state.selectedVehicleId,
                                }
                                console.log('postdata', postData);
                                this.callAddExpenseAPI(postData);
                            } else {
                                Utils.ShowMessage('Please Enter Expense Amount');
                            }

                        } else {
                            //--credit mode
                            if (!this.state.selectedExpenseType.includes("Select Party Name")) {
                                if (this.state.totalAmount.length > 0) {
                                    if (this.state.paidAmount.length > 0) {
                                        var date = new Date(this.state.passdate);
                                        var postData = {
                                            "date": date.toISOString(),
                                            "description": this.state.remark,
                                            "expenseName": this.state.otherExpense,
                                            "expenseType": this.state.selectedExpenseType,//for other type 
                                            "mode": this.state.paymentType,
                                            "paidAmount": Number(this.state.paidAmount),// if mode is credit is mandatory
                                            "partyId": this.state.selectedPartyID,
                                            "totalAmount": Number(this.state.totalAmount),
                                            "vehicleNumber": this.state.selectedVehicleId,
                                        }
                                        console.log('postdata', postData);
                                        this.callAddExpenseAPI(postData);
                                    } else {
                                        Utils.ShowMessage('Please Enter  Paid Amount');


                                    }
                                } else {
                                    Utils.ShowMessage('Please Enter Expense Total Amount');


                                }
                            } else {
                                Utils.ShowMessage('Please Select Party');


                            }
                        }
                    } else {
                        Utils.ShowMessage('Please Select payment Type');


                    }
                } else {
                    Utils.ShowMessage('Please Select Driver');


                }
            } else {
                Utils.ShowMessage('Please Select Vehicle');


            }
        } else {
            Utils.ShowMessage('Please  Select Date');


        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    renderTrucksList() {
        return this.state.trucks.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.registrationNo}
                value={truckItem._id + "###" + truckItem.registrationNo}
            />
        );
    }

    renderExpensesList() {
        return this.state.expenses.map((driverItem, i) =>
            <Picker.Item
                key={i}
                label={driverItem.expenseName}
                value={driverItem._id+ "###" +driverItem.expenseName}
            />
        );
    }

    renderPartyList() {
        return this.state.partyList.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.name}
                value={truckItem._id}
            />
        );
    }


    renderLaneList() {
        return this.state.lanesList.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.name}
                value={truckItem.name}
            />
        );
    }




    getTruckNum(itemValue) {
        if (itemValue === 'Select Vehicle') {
            return '';
        }
        else {
            //console.log(this.state.trucks[index].registrationNo,' <--->registrationNo');
            //this.setState({vehicleNum : this.state.trucks[index].registrationNo})
            for (let i = 0; i < this.state.trucks.length; i++) {
                if (this.state.trucks[i]._id === itemValue) {
                    this.setState({ vehicleNum: this.state.trucks[i].registrationNo }, () => {
                        console.log('vehicleNum', this.state.vehicleNum);
                    })
                    break;
                }
            };
        }
    }

    ShowExpenseView(itemValue) {
        if (itemValue === 'others') {
            this.setState({ otherExpenseInputViewBool: 'flex' });
        } else {
            this.setState({ otherExpenseInputViewBool: 'none' });
        }
    }


    changepaymentType(value) {
        //creditBool:'none',-cashBool:'none',
        if (value === 'credit') {
            this.setState({ creditBool: 'flex', cashBool: 'none', paymentType: 'Credit' });
        } else {
            this.setState({ creditBool: 'none', cashBool: 'flex', paymentType: 'Cash' });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row',paddingTop: 20, paddingBottom:5, backgroundColor: '#1e4495', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Image
                                style={{ width: 20, marginLeft: 20 }}
                                resizeMode='contain'
                                source={require('../images/backButtonIcon.png')}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, color: '#fff', paddingLeft: 20, fontFamily: 'Gotham-Light' }}>
                           ADD EXPENSE
                        </Text>
                    </View>
                    <View>
                        <ScrollView>
                            <View style={{ backgroundColor: '#ffffff', margin: 10, marginBottom: 40 }}>
                                {this.spinnerLoad()}
                                <TouchableOpacity
                                    onPress={() => { this.onPickdate() }}
                                >
                                    <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 5 }}>
                                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top:2, display:'none', color: '#525252' }, this.state.field0]}> 
                                                        Trip Date</CustomText>
                                                <CustomEditText underlineColorAndroid='transparent'
                                                                placeholder={'Trip Date*'}
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
                                <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field2]}>Vehicle Number*</CustomText>
                                    
                                    <CPicker
                                    placeholder="Select  Vehicles"
                                    cStyle={{ marginLeft: 20, marginRight: 20, marginVertical: 7, width: 200, height: 150 }}
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.truckText}
                                    onValueChange={(itemValue, itemIndex) => {this.getTruckNum(itemValue); this.setState({ truckText: itemValue.split("###")[1], selectedTruckId: itemValue.split("###")[0] /* selectedDriverId: itemValue */ })}}>
                                    <Picker.Item label="Select Driver" value="Select Driver" />
                                    {this.renderTrucksList()}

                                </CPicker>
                                   {/*  <Picker
                                        style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                        selectedValue={this.state.selectedVehicleId}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.getTruckNum(itemValue);
                                            this.setState({ selectedVehicleId: itemValue })
                                        }}>
                                        {this.renderTrucksList()}

                                    </Picker> */}
                                </View>

                                <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field3]}>Expense Type*</CustomText>
                                    <CPicker
                                    placeholder="Select Expense Type"
                                    cStyle={{ marginLeft: 20, marginRight: 20, marginVertical: 7, width: 200, height: 150 }}
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.expenseText}
                                    onValueChange={(itemValue, itemIndex) => {this.ShowExpenseView(itemValue); this.setState({ expenseText: itemValue.split("###")[1], selectedExpenseType: itemValue.split("###")[0] /* selectedDriverId: itemValue */ })}}>
                                   <Picker.Item label="Select Expense Type" value="Select Expense Type" />
                                        {this.renderExpensesList()}
                                        <Picker.Item label="others" value="others" />

                                </CPicker>
                                    
                                    {/* <Picker
                                        style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                        selectedValue={this.state.selectedExpenseType}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.ShowExpenseView(itemValue);
                                            this.setState({ selectedExpenseType: itemValue })
                                        }}>
                                        <Picker.Item label="Select Expense Type" value="Select Expense Type" />
                                        {this.renderExpensesList()}
                                        <Picker.Item label="others" value="others" />
                                    </Picker> */}
                                </View>
                                <View style={{ display: this.state.otherExpenseInputViewBool, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, top:2, display:'none', color: '#525252' }, this.state.field4]}>
                                        Other Expense Type </CustomText>
                                    <CustomEditText underlineColorAndroid='transparent'
                                                    placeholder={'Expense Name*'}
                                                    inputTextStyle={{ marginHorizontal: 16 }} 
                                                    value={this.state.otherExpense}
                                                    onChangeText={(otherExpense) => { this.moveInputLabelUp(4, otherExpense); this.setState({ otherExpense: otherExpense }); }} />
                                </View>
                                <View style={[CustomStyles.row, CustomStyles.mTop10, CustomStyles.mBottom10]}>
                                    <CRadio label='Credit' activeStyle={{ display: this.state.creditBool, margin: 10 }}
                                        onPress={() => this.changepaymentType('credit')} />
                                    <CRadio label='Cash' activeStyle={{ display: this.state.cashBool, margin: 10 }}
                                        onPress={() => this.changepaymentType('cash')} />
                                </View>



                                <View style={{ display: this.state.creditBool, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field3]}>Party Name*</CustomText>
                                    <Picker
                                        style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                        selectedValue={this.state.selectedPartyID}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ selectedPartyID: itemValue })
                                        }}>
                                        <Picker.Item label="Select Party Name" value="Select Party Name" />
                                        {this.renderPartyList()}
                                    </Picker>
                                </View>

                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, top:2, display:'none', color: '#525252' }, this.state.field5]}>
                                            Total Amount* </CustomText>
                                    <CustomEditText underlineColorAndroid='transparent'
                                                    placeholder={'Total Amount*'}
                                                    keyboardType='numeric'
                                                    inputTextStyle={{ marginHorizontal: 16 }}
                                                    value={this.state.totalAmount}
                                                    onChangeText={(totalAmount) => { this.moveInputLabelUp(5, totalAmount); this.setState({ totalAmount: totalAmount.trim() }); }} />
                                </View>

                                <View style={{ display: this.state.creditBool, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, top:2, display:'none', color: '#525252' }, this.state.field6]}>
                                        Paid Amount* </CustomText>
                                    <CustomEditText underlineColorAndroid='transparent'
                                                    placeholder={'Paid Amount*'}
                                                    keyboardType='numeric'
                                                    inputTextStyle={{ marginHorizontal: 16 }}
                                                    value={this.state.paidAmount}
                                                    onChangeText={(paidAmount) => { this.moveInputLabelUp(6, paidAmount); this.setState({ paidAmount: paidAmount.trim() }); }} />
                                </View>
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                    <CustomText customTextStyle={[{ position: 'absolute', left: 20, top:2, display:'none', color: '#525252' }, this.state.field7]}>
                                            Remarks </CustomText>
                                    <CustomEditText underlineColorAndroid='transparent'
                                                    placeholder={'Remarks'}
                                                    inputTextStyle={{ marginHorizontal: 16 }}
                                                    value={this.state.remark}
                                                    onChangeText={(remark) => { this.moveInputLabelUp(7, remark); this.setState({ remark: remark }); }} />
                                </View>
                            </View>
                        </ScrollView>
                    </View>

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
                            onPress={() => { this.onSubmitExpenseDetails() }}>
                            <View style={{ alignItems: 'stretch' }}>
                                <Text style={{ color: '#fff', padding: 15, alignSelf: 'center' }}>
                                    SUBMIT
                        </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
                <Confirm visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                    sayNo="CANCEL"
                    sayYes="CONFIRM"
                >
                    <View style={{ flex: 1, padding: 20 }}>
                        <DatePickerIOS
                            date={new Date()}
                            onDateChange={(pickedDate) => {
                                var month = pickedDate.getMonth() + 1
                                let date = pickedDate.getDate() + "/" + month + "/" + pickedDate.getFullYear();
                                this.setState({ date: date, passdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                this.moveInputLabelUp(0, date)
                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>
            </View>

        );
    }
}