//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import {
    View, ScrollView, DatePickerAndroid, DatePickerIOS, Platform, NetInfo,
    Picker, BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity
} from 'react-native';
import CustomStyles from './common/CustomStyles';
import Utils from './common/Utils';
import { LoadingSpinner, ExpiryDateItems, Card, MailBox, CustomEditText, CPicker, Ctoggle, CustomText, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import { NoInternetModal } from './common';


export default class ERPCategory extends Component {

    state = {
        defaultDate: new Date(),
        loadSpinner: false,
        showModal: false,
        categoryBgColor: false,
        recordsList: [],
        expenses: [],
        paymentsParties: [],
        totalExpenses: {
            totalDieselExpense: 0,
            totaltollExpense: 0,
            totalmExpense: 0,
            totalmisc: 0
        },
        grossAmounts: {
            grossFreight: 0,
            grossExpenses: 0,
            grossRevenue: 0
        },
        paymentsGrossAmounts: {
            grossFreight: 0,
            grossExpenses: 0,
            grossDue: 0
        },
        payableGrossAmounts: {
            totalAmount: 0,
            paidAmount: 0,
            payableAmount: 0
        },
        erpSettings: [],
        rMaxDate: '', rMaxPassdate: '', rMinDate: '', rMinPassdate: '',
        expMaxDate: '', expMaxPassdate: '', expMinDate: '', expMinPassdate: '',
        pMaxDate: '', pMaxPassdate: '', pMinDate: '', pMinPassdate: '',
        recMaxDate: '', recMaxPassdate: '', recMinDate: '', recMinPassdate: '',
        selectedTruckId: '',
        trucks: [],
        partyList: [],
        dechileID: '',
        showMail: false,
        mail: '',
        payablesBool: '#1e4495',
        receiveablesBool: '#ffffff',
        netFlaf: false
    };

    componentWillMount() {
        this.connectionInfo();

        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.getReportsData();
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.getReportsData();
                } else {
                    return this.setState({ netFlaf: true });
                }
            });
        }
    }

    getReportsData() {
        const self = this;
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: self.props.navigation.state.params.Url
        })
            .then((response) => {
                // console.log('ERP CAtegory ==>', response.data);
                if (response.data.status) {
                    if (self.props.navigation.state.params.mode == 'Expense') {
                        self.setState({ expenses: response.data.expenses, totalExpenses: response.data.totalExpenses });
                        if (response.data.expenses.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                        this.callDependenciesList(Config.routes.base + Config.routes.trucksList);
                    } else if (self.props.navigation.state.params.mode == 'Revenue') {
                        self.setState({ recordsList: response.data.revenue, grossAmounts: response.data.grossAmounts });
                        if (response.data.revenue.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                        this.callDependenciesList(Config.routes.base + Config.routes.trucksList);
                    } else if (self.props.navigation.state.params.mode == 'Payments') {
                        self.setState({ paymentsParties: response.data.paybleAmounts, payableGrossAmounts: response.data.gross });
                        if (response.data.paybleAmounts.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                        this.callDependenciesList(Config.routes.base + Config.routes.partyList);
                    } else if (self.props.navigation.state.params.mode == 'Receivables') {
                        self.setState({ paymentsParties: response.data.parties, paymentsGrossAmounts: response.data.grossAmounts });
                        if (response.data.parties.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                        this.callDependenciesList(Config.routes.base + Config.routes.partyList);
                    }
                } else {
                    console.log(self.props.navigation.state.params.mode, 'error  ==>', response);
                }

            }).catch((error) => {
                console.log('error in ERP Category ==>', error);
            })
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
    }


    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        State = {
            categoryBgColor: false,
            grossAmounts: {
                grossFreight: 0,
                grossExpenses: 0,
                grossRevenue: 0
            },
            totalExpenses: {
                totalDieselExpense: 0,
                totaltollExpense: 0,
                totalmExpense: 0,
                totalmisc: 0
            },
            paymentsGrossAmounts: {
                grossFreight: 0,
                grossExpenses: 0,
                grossDue: 0
            },
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        };
    }

    renderLoadingSpinner() {
        if (this.state.loadSpinner)
            return <LoadingSpinner />;
        return false;
    }

    callDependenciesList(url) {
        const self = this;
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: url
        })
            .then((response) => {
                if (response.data.status) {
                    //console.log('ERp--trucks ==>', response.data);
                    if (self.props.navigation.state.params.mode == 'Payments' || self.props.navigation.state.params.mode == 'Receivables') {
                        this.setState({ partyList: response.data.parties });
                    } else {

                        this.setState({ trucks: response.data.trucks });
                    }
                } else {
                    console.log('error in ERp trucks ==>', response);
                }

            }).catch((error) => {
                console.log('error in ERp trucks ==>', error);
            })
    }

    getExpiryDateView() {
        return this.state.expirydetails.map((expirydetail, i) => {
            return <ExpiryDateItems key={i} style={{ flex: 1 }} count={expirydetail.count} label={expirydetail.label} />

        });
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

    renderPartyList() {
        return this.state.partyList.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.name}
                value={truckItem._id + "###" + truckItem.name}
            />
        );
    }

    callSubCategoryScreen(truckNum, truckAmount, truckID) {
        this.connectNetInfo(truckNum, truckAmount, truckID);
    }

    async connectNetInfo(truckNum, truckAmount, truckID) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { this.onNetSuccess(truckNum, truckAmount, truckID); }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) { this.onNetSuccess(truckNum, truckAmount, truckID); }
                else { return this.setState({ netFlaf: true }); }
            });
        }
    }

    onNetSuccess(truckNum, truckAmount, truckID) {
        this.setState({ netFlaf: false });
        const self = this;
        console.log(self.props.navigation.state.params.token);
        switch (self.props.navigation.state.params.mode) {
            case "Revenue":
                this.props.navigation.navigate('Erpsubcategory', {
                    token: self.props.navigation.state.params.token,
                    Url: Config.routes.base + Config.routes.detailsRevenueFromVechicle + truckID,
                    label: 'Total Revenue From ' + truckNum + ":  " + truckAmount,
                    mode: self.props.navigation.state.params.mode
                });

                break;
            case "Expense":
                console.log("Expense", 'data', );
                this.props.navigation.navigate('Erpsubcategory', {
                    token: self.props.navigation.state.params.token,
                    Url: Config.routes.base + Config.routes.detailsExpensesForAllVehicles + truckID,
                    label: 'Total Expense From ' + truckNum + "  " + truckAmount,
                    mode: self.props.navigation.state.params.mode
                });
                break;
            case "Payments":
                console.log("Payments", "data");
                this.props.navigation.navigate('Erpsubcategory', {
                    token: self.props.navigation.state.params.token,
                    Url: Config.routes.base + Config.routes.totalPayablesPaymentByParty + truckID,
                    label: 'Total Payments Receivablea From ' + "\n" + truckNum + "  " + truckAmount,
                    mode: self.props.navigation.state.params.mode
                });
                break;
            case "Receivables":
                this.props.navigation.navigate('Erpsubcategory', {
                    token: self.props.navigation.state.params.token,
                    Url: Config.routes.base + Config.routes.totalPaymentByParty + truckID,
                    label: 'Total Payments Receivablea From ' + "\n" + truckNum + "  " + truckAmount,
                    mode: self.props.navigation.state.params.mode
                });
                break;
            default:
                text = "I have never heard of that fruit...";
        }
    }


    gettruckName(item) {
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            data = item.attrs.truckName;
        } else {
            data = '-';
        }
        return data;
    }

    changeRoleStatus(value) {
        const self = this;
        if (value === 'P') {
            self.props.navigation.state.params.mode = 'Payments';
            this.setState({ payablesBool: '#1e4495', receiveablesBool: '#ffffff', role: 'Transporter' });
            this.setState({ paymentsParties: [] });
            this.paymentRoleData('Payments', Config.routes.base + Config.routes.totalPayeblesPayment);
        } else {
            self.props.navigation.state.params.mode = 'Receivables';
            this.setState({ payablesBool: '#ffffff', receiveablesBool: '#1e4495', role: 'Supplier' });
            this.setState({ paymentsParties: [] });
            this.paymentRoleData('Receivables', Config.routes.base + Config.routes.totalPaymentFromParty);
        }
    }

    paymentRoleData(str, url) {
        this.connectNetInfoTwo(str, url);
    }

    async connectNetInfoTwo(str, url) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { this.onNetSuccessTwo(str, url); }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) { this.onNetSuccessTwo(str, url); }
                else { return this.setState({ netFlaf: true }); }
            });
        }
    }

    onNetSuccessTwo(str, url){
        this.setState({ netFlaf: false });
        const self = this;
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: url
        })
            .then((response) => {
                //console.log(self.props.navigation.state.params.mode,'ERP CAtegory ==>', response.data);
                if (response.data.status) {
                    if (str == 'Payments') {
                        self.setState({ paymentsParties: response.data.paybleAmounts, payableGrossAmounts: response.data.gross });
                        if (response.data.paybleAmounts.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                        Actions.refresh({
                            token: self.props.navigation.state.params.token,
                            Url: Config.routes.base + Config.routes.totalPayeblesPayment,
                            //Url: Config.routes.base + Config.routes.totalPayeblesPayment,
                            mode: 'Payments',
                            label: 'Total Payments Details'
                        });
                        this.callDependenciesList(Config.routes.base + Config.routes.partyList);
                    } else {
                        self.setState({ paymentsParties: response.data.parties, paymentsGrossAmounts: response.data.grossAmounts });
                        if (response.data.parties.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                        Actions.refresh({
                            token: self.props.navigation.state.params.token,
                            //Url: Config.routes.base + Config.routes.totalPaymentFromParty,
                            Url: Config.routes.base + Config.routes.totalPaymentFromParty,
                            mode: 'Receivables',
                            label: 'Total Payments Details'
                        });
                        this.callDependenciesList(Config.routes.base + Config.routes.partyList);
                    }
                } else {
                    console.log(self.props.navigation.state.params.mode, 'error  ==>', response);
                }

            }).catch((error) => {
                console.log('error in ERP Category ==>', error);
            });
    }

    onPickdate(str, category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal, str: str, category: category })
        } else {
            try {
                const { action, year, month, day } = DatePickerAndroid.open({

                    //minDate: str == 'min'? new Date() :new Date('1-1-2007'),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;

                        switch (category) {
                            case "revenue":
                                if (str === 'max') {
                                    this.setState({ rMaxDate: date, rMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ rMinDate: date, rMinPassdate: month + "/" + response.day + "/" + response.year });
                                }
                                return;
                                break;
                            case "expense":
                                if (str === 'max') {
                                    this.setState({ expMaxDate: date, expMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ expMinDate: date, expMinPassdate: month + "/" + response.day + "/" + response.year });
                                }
                                return;
                                break;
                            case "payment":
                                if (str === 'max') {
                                    this.setState({ pMaxDate: date, pMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ pMinDate: date, pMinPassdate: month + "/" + response.day + "/" + response.year });
                                }
                                return;
                            case "receivables":
                                if (str === 'max') {
                                    this.setState({ recMaxDate: date, recMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ recMinDate: date, recMinPassdate: month + "/" + response.day + "/" + response.year });
                                }
                                return;
                                break;
                        }
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

        switch (this.state.category) {
            case "revenue":
                if (this.state.str === 'max' && this.state.rMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.rMinDate === '') {
                    alert('Select a date');
                } else {
                    this.setState({ showModal: false })
                }
                return;
                break;
            case "expense":
                if (this.state.str === 'max' && this.state.expMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.expMinDate === '') {
                    alert('Select a date');
                } else {
                    this.setState({ showModal: false })
                }
                return;
                break;
            case "payment":
                if (this.state.str === 'max' && this.state.pMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.pMinDate === '') {
                    alert('Select a date');
                } else {
                    this.setState({ showModal: false })
                }
                return;
            case "receivables":
                if (this.state.str === 'max' && this.state.recMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.recMinDate === '') {
                    alert('Select a date');
                } else {
                    this.setState({ showModal: false })
                }
                return;
                break;
        }
    }

    onDecline() {
        switch (this.state.category) {
            case "revenue":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, rMaxDate: '', rMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, rMinDate: '', rMinPassdate: '' });
                }
                return;
                break;
            case "expense":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, expMaxDate: '', expMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, expMinDate: '', expMinPassdate: '' });
                }
                return;
                break;
            case "payment":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, pMaxDate: '', pMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, pMinDate: '', pMinPassdate: '' });
                }
                return;
            case "receivables":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, recMaxDate: '', recMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, recMinDate: '', recMinPassdate: '' });
                }
                return;
                break;
        }
    }

    iosDateModal() {
        return <Confirm visible={this.state.showModal}
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
                        switch (this.state.category) {
                            case "revenue":
                                if (this.state.str === 'max') {
                                    this.setState({ rMaxDate: date, rMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ rMinDate: date, rMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                return;
                                break;
                            case "expense":
                                if (this.state.str === 'max') {
                                    this.setState({ expMaxDate: date, expMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ expMinDate: date, expMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                return;
                                break;
                            case "payment":
                                if (this.state.str === 'max') {
                                    this.setState({ pMaxDate: date, pMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ pMinDate: date, pMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                return;
                            case "receivables":
                                if (this.state.str === 'max') {
                                    this.setState({ recMaxDate: date, recMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ recMinDate: date, recMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                return;
                                break;
                        }

                    }}
                    mode="date"
                />
            </View>
        </Confirm>
    }



    sendSettingData(category) {
        switch (category) {
            case "revenue":
                if (this.state.selectedTruckId.includes('Select  Vehicles') && this.state.rMinPassdate === '' && this.state.rMaxPassdate === '') {
                    Utils.ShowMessage("Please Select Dates or Vechicle");

                } else {

                    if (this.state.selectedTruckId.includes('Select  Vehicles')) {
                        this.setState({ selectedTruckId: '' });
                    }
                    var sort = { "createdAt": -1 };
                    if (this.state.rMaxDate.includes('/') && this.state.rMinDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.rMinPassdate), new Date(this.state.rMaxPassdate)) > 0) {

                            this.state.erpSettings.revenue = "fromDate=" + this.getISODate(this.state.rMinPassdate) + "&page=&regNumber=" + this.state.selectedTruckId +
                                "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + this.getISODate(this.state.rMaxPassdate);
                            this.searchReportsData(Config.routes.base + Config.routes.filterTotalRevenueByVechicle + this.state.erpSettings.revenue);
                        } else {
                            Utils.ShowMessage("Invalid Date Selection");
                        }
                    } else {
                        this.state.erpSettings.revenue = "fromDate=&page=&regNumber=" + this.state.selectedTruckId +
                            "&size=&sort=" + JSON.stringify(sort) + "&toDate=";
                        this.searchReportsData(Config.routes.base + Config.routes.filterTotalRevenueByVechicle + this.state.erpSettings.revenue);
                    }
                }

                return;
                break;
            case "expense":
                if (this.state.selectedTruckId.includes('Select  Vehicles') && this.state.rMinPassdate === '' && this.state.rMaxPassdate === '') {
                    Utils.ShowMessage("Please Select Dates or Vechicle");




                } else {
                    if (this.state.selectedTruckId.includes('Select  Vehicles')) {
                        this.setState({ selectedTruckId: '' });
                    }
                    var sort = { "createdAt": -1 };
                    if (this.state.expMaxDate.includes('/') && this.state.expMinDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.expMinPassdate), new Date(this.state.expMaxPassdate)) > 0) {

                            this.state.erpSettings.revenue = "fromDate=" + this.getISODate(this.state.expMinPassdate) + "&page=&regNumber=" + this.state.selectedTruckId +
                                "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + this.getISODate(this.state.expMaxPassdate);
                            this.searchReportsData(Config.routes.base + Config.routes.filterTotalExpensesForAllVehicles + this.state.erpSettings.revenue);
                        } else {
                            Utils.ShowMessage("Invalid Date Selection");



                        }
                    } else {
                        this.state.erpSettings.revenue = "fromDate=&page=&regNumber=" + this.state.selectedTruckId +
                            "&size=&sort=" + JSON.stringify(sort) + "&toDate=";
                        this.searchReportsData(Config.routes.base + Config.routes.filterTotalExpensesForAllVehicles + this.state.erpSettings.revenue);
                    }
                }
                return;
                break;
            case "payment":
                if (this.state.selectedTruckId.includes('Select Parties') && this.state.pMinPassdate === '' && this.state.pMaxPassdate === '') {
                    Utils.ShowMessage("Please Select Dates or Vechicle");

                } else {
                    var partyID = '';
                    if (this.state.selectedTruckId.includes('Select Parties')) {
                        partyID = '';
                    } else {
                        partyID = this.state.selectedTruckId;
                    }
                    var sort = { "createdAt": -1 };
                    if (this.state.pMaxDate.includes('/') && this.state.pMinDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.pMinPassdate), new Date(this.state.pMaxPassdate)) > 0) {

                            this.state.erpSettings.revenue = "fromDate=" + this.getISODate(this.state.pMinPassdate) + "&page=&partyId=" + partyID +
                                "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + this.getISODate(this.state.pMaxPassdate);
                            this.searchReportsData(Config.routes.base + Config.routes.filterTotalPayeblesPayment + this.state.erpSettings.revenue);


                        } else {
                            Utils.ShowMessage("Invalid Date Selection");



                        }
                    } else {
                        this.state.erpSettings.revenue = "fromDate=&page=&regNumber=" + this.state.selectedTruckId +
                            "&size=&sort=" + JSON.stringify(sort) + "&toDate=";
                        this.searchReportsData(Config.routes.base + Config.routes.filterTotalPayeblesPayment + this.state.erpSettings.revenue);
                    }
                }
                return;
                break;
            case "receivables":
                if (this.state.selectedTruckId.includes('Select Parties') && this.state.recMinPassdate === '' && this.state.recMaxPassdate === '') {
                    Utils.ShowMessage("Please Select Dates or Vechicle");




                } else {
                    var partyID = '';
                    if (this.state.selectedTruckId.includes('Select Parties')) {
                        partyID = '';
                    } else {
                        partyID = this.state.selectedTruckId;
                    }
                    var sort = { "createdAt": -1 };
                    if (this.state.recMaxDate.includes('/') && this.state.recMinDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.recMinPassdate), new Date(this.state.recMaxPassdate)) > 0) {

                            this.state.erpSettings.revenue = "fromDate=" + this.getISODate(this.state.recMinPassdate) + "&page=&partyId=" + partyID +
                                "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + this.getISODate(this.state.recMaxPassdate);
                            this.searchReportsData(Config.routes.base + Config.routes.filterTotalPaymentFromParty + this.state.erpSettings.revenue);


                        } else {
                            Utils.ShowMessage("Invalid Date Selection");



                        }
                    } else {
                        this.state.erpSettings.revenue = "fromDate=&page=&regNumber=" + this.state.selectedTruckId +
                            "&size=&sort=" + JSON.stringify(sort) + "&toDate=";
                        this.searchReportsData(Config.routes.base + Config.routes.filterTotalPaymentFromParty + this.state.erpSettings.revenue);
                    }
                }
                return;
                break;
        }
    }

    getDaysfunction(date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var today = new Date();
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    getParsedDate(item) {
        var formattedDate = new Date(item);
        return formattedDate.getDate().toString() + "/" + (formattedDate.getMonth() + 1) + "/" + formattedDate.getFullYear().toString();
    }

    getISODate(item) {
        if (item == '')
            return '';
        var formattedDate = new Date(item);
        return formattedDate.toISOString();
    }

    searchReportsData(url) {
        this.connectNetInfoThree(url);
    }

    async connectNetInfoThree(url) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { this.onNetSuccessThree(url); }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) { this.onNetSuccessThree(url); }
                else { return this.setState({ netFlaf: true }); }
            });
        }
    }

    onNetSuccessThree(url){
        this.setState({ netFlaf: false });
        const self = this;
        this.setState({ spinnerBool: true });
        console.log('posting data', url);
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: url
        })
            .then((response) => {
                if (response.data.status) {
                    this.setState({ spinnerBool: false });
                    if (self.props.navigation.state.params.mode == 'Expense') {
                        this.setState({ expenses: response.data.expenses, totalExpenses: response.data.totalExpenses });
                        if (response.data.expenses.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                    } else if (self.props.navigation.state.params.mode == 'Revenue') {
                        this.setState({ recordsList: response.data.revenue, grossAmounts: response.data.grossAmounts });
                        if (response.data.revenue.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                    } else if (self.props.navigation.state.params.mode == 'Receivables') {
                        this.setState({ paymentsParties: response.data.parties, paymentsGrossAmounts: response.data.grossAmounts });
                        if (response.data.parties.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                    } else {
                        this.setState({ paymentsParties: response.data.paybleAmounts, payableGrossAmounts: response.data.gross });
                        if (response.data.paybleAmounts.length == 0) {
                            Utils.ShowMessage('No Records Found');
                        }
                    }

                } else {
                    //console.log('reponse in update erpSettingData ==>', response);
                    this.setState({ spinnerBool: false });
                    let message = "";
                    response.data.messages.forEach(function (current_value) {
                        message = message + current_value;
                    });
                    Utils.ShowMessage(message);
                }
            }).catch((error) => {
                console.log('error in erpSettingData ==>', error);
                this.setState({ spinnerBool: false });
                Utils.ShowMessage("Something went Wrong,Please Try again ");
            })
    }

    getParty(item) {
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            data = item.attrs.partyName;
        } else {
            data = '-';
        }
        return data;
    }

    getPayablePartyName(item) {
        var data = '-';
        if (item.hasOwnProperty("_id")) {
            data = item["_id"].name;
        } else {
            data = '-';
        }
        return data;
    }
    getPayablePartyID(item) {
        var data = '-';
        if (item.hasOwnProperty("_id")) {
            data = item["_id"]._id;
        } else {
            data = '-';
        }
        return data;
    }

    ShowModalFunction(visible) {
        this.setState({ showMail: visible });
    }



    sendMail(mode, look) {

        const self = this;
        switch (mode) {
            case "Revenue":


                if (this.state.selectedTruckId.includes('Select  Vehicles')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (look === 'download') {
                    var tempURL = "&fromDate=" + rMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + rMaxPassdate;
                    return this.downLoadData(Config.routes.base + Config.routes.downloadRevenue + tempURL);
                    break;
                }

                if (this.state.mail.trim().length == 0) {
                    Utils.ShowMessage("Please Enter Email");



                }
                var rMinPassdate = ''
                if (this.state.rMinPassdate.length > 1) {
                    rMinPassdate = this.getISODate(this.state.rMinPassdate)
                }

                var rMaxPassdate = ''
                if (this.state.rMaxPassdate.length > 1) {
                    rMaxPassdate = this.getISODate(this.state.rMaxPassdate)
                }


                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };

                    var tempURL = "email=" + this.state.mail + "&fromDate=" + rMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + rMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.revenueMail + tempURL);

                } else {
                    return
                    Utils.ShowMessage('Pleaseytu Enter Valid Mail ID');


                }
                return;
                break;
            case "Expense":
                if (this.state.selectedTruckId.includes('Select  Vehicles')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (this.state.mail.trim().length == 0) {
                    Utils.ShowMessage("Please Enter Email");



                }
                var expMinPassdate = ''
                if (this.state.expMinPassdate.length > 1) {
                    expMinPassdate = this.getISODate(this.state.expMinPassdate)
                }

                var expMaxPassdate = ''
                if (this.state.expMaxPassdate.length > 1) {
                    expMaxPassdate = this.getISODate(this.state.expMaxPassdate)
                }

                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };
                    var tempURL = "email=" + this.state.mail + "&fromDate=" + expMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + expMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.expenseMail + tempURL);
                } else {
                    return
                    Utils.ShowMessage('Please Enter Valid Mail ID');


                }
                return;
                break;
            case "Payments":
                if (this.state.selectedTruckId.includes('Select  Parties')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (this.state.mail.trim().length == 0) {
                    return
                    Utils.ShowMessage("Please Enter Email");


                }
                var pMinPassdate = ''
                if (this.state.pMinPassdate.length > 1) {
                    pMinPassdate = this.getISODate(this.state.pMinPassdate)
                }

                var pMaxPassdate = ''
                if (this.state.pMaxPassdate.length > 1) {
                    pMaxPassdate = this.getISODate(this.state.pMaxPassdate)
                }

                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };
                    var tempURL = "email=" + this.state.mail + "&fromDate=" + pMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + pMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.paymentsMail + tempURL);
                } else {
                    return
                    Utils.ShowMessage('Please Enter Valid Mail ID');


                }
                return;
                break;
            case "Receivables":
                if (this.state.selectedTruckId.includes('Select  Parties')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (this.state.mail.trim().length == 0) {
                    return
                    Utils.ShowMessage("Please Enter Email");


                }
                var recMinPassdate = ''
                if (this.state.recMinPassdate.length > 1) {
                    recMinPassdate = this.getISODate(this.state.recMinPassdate)
                }

                var recMaxPassdate = ''
                if (this.state.recMaxPassdate.length > 1) {
                    recMaxPassdate = this.getISODate(this.state.recMaxPassdate)
                }

                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };
                    var tempURL = "email=" + this.state.mail + "&fromDate=" + recMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + recMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.receivablesMail + tempURL);
                } else {
                    return
                    Utils.ShowMessage('Please Enter Valid Mail ID');


                }


                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };

                    var tempURL = "email=" + this.state.mail + "&fromDate=" + rMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + rMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.revenueMail + tempURL);

                } else {
                    return Utils.ShowMessage('Pleaseytu Enter Valid Mail ID');
                }
                return;
                break;
            case "Expense":
                if (this.state.selectedTruckId.includes('Select  Vehicles')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (this.state.mail.trim().length == 0) {
                    return Utils.ShowMessage("Please Enter Email");
                }
                var expMinPassdate = ''
                if (this.state.expMinPassdate.length > 1) {
                    expMinPassdate = this.getISODate(this.state.expMinPassdate)
                }

                var expMaxPassdate = ''
                if (this.state.expMaxPassdate.length > 1) {
                    expMaxPassdate = this.getISODate(this.state.expMaxPassdate)
                }

                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };
                    var tempURL = "email=" + this.state.mail + "&fromDate=" + expMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + expMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.expenseMail + tempURL);
                } else {
                    return Utils.ShowMessage('Please Enter Valid Mail ID');
                }
                return;
                break;
            case "Payments":
                if (this.state.selectedTruckId.includes('Select  Parties')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (this.state.mail.trim().length == 0) {
                    return Utils.ShowMessage("Please Enter Email");
                }
                var pMinPassdate = ''
                if (this.state.pMinPassdate.length > 1) {
                    pMinPassdate = this.getISODate(this.state.pMinPassdate)
                }

                var pMaxPassdate = ''
                if (this.state.pMaxPassdate.length > 1) {
                    pMaxPassdate = this.getISODate(this.state.pMaxPassdate)
                }

                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };
                    var tempURL = "email=" + this.state.mail + "&fromDate=" + pMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + pMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.paymentsMail + tempURL);
                } else {
                    return Utils.ShowMessage('Please Enter Valid Mail ID');
                }
                return;
                break;
            case "Receivables":
                if (this.state.selectedTruckId.includes('Select  Parties')) {
                    this.setState({ selectedTruckId: '' });
                }

                if (this.state.mail.trim().length == 0) {
                    return Utils.ShowMessage("Please Enter Email");
                }
                var recMinPassdate = ''
                if (this.state.recMinPassdate.length > 1) {
                    recMinPassdate = this.getISODate(this.state.recMinPassdate)
                }

                var recMaxPassdate = ''
                if (this.state.recMaxPassdate.length > 1) {
                    recMaxPassdate = this.getISODate(this.state.recMaxPassdate)
                }

                if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
                    var sort = { "createdAt": -1 };
                    var tempURL = "email=" + this.state.mail + "&fromDate=" + recMinPassdate + "&page=&regNumber=" + this.state.selectedTruckId +
                        "&size=&sort=" + JSON.stringify(sort) + "&toDate=" + recMaxPassdate;
                    this.sendReportsData(Config.routes.base + Config.routes.receivablesMail + tempURL);
                } else {
                    return Utils.ShowMessage('Please Enter Valid Mail ID');
                }
                return;
                break;

            default:
                break;
        }
    }

    sendReportsData(url) {
        this.connectNetInfoFour(url);
    }

    async connectNetInfoFour(url) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { this.onNetSuccessFour(url); }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) { this.onNetSuccessFour(url); }
                else { return this.setState({ netFlaf: true }); }
            });
        }
    }

    onNetSuccessFour(url){
        this.setState({ netFlaf: false });
        const self = this;
        this.setState({ spinnerBool: true });
        console.log('posting data', url);
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: url
        })
            .then((response) => {
                console.log('posting data', response);
                if (response.data.status) {
                    this.setState({ spinnerBool: false });
                    let message = "";
                    response.data.messages.forEach(function (current_value) {
                        message = message + current_value;
                    });
                    Utils.ShowMessage(message);



                    this.ShowModalFunction(!this.state.showMail);
                } else {
                    //console.log('reponse in update erpSettingData ==>', response);
                    this.setState({ spinnerBool: false });
                    let message = "";
                    response.data.messages.forEach(function (current_value) {
                        message = message + current_value;
                    });
                    Utils.ShowMessage(message);
                }
            }).catch((error) => {
                console.log('error in erpSettingData ==>', error);
                this.setState({ spinnerBool: false });
                Utils.ShowMessage("Something went Wrong,Please Try again ");
            })
    }

    downLoadData(url) {
        const self = this;
        const android = RNFetchBlob.android;
        var currdate = new Date();
        RNFetchBlob.config({
            path: '/data/user/0/com.easygaadi/files/' + self.props.navigation.state.params.mode + currdate.getDay() + 'easyGaadi.xlsx',
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache: true,
        })
            .fetch('GET', url, {
                headers: "{ token:" + self.props.navigation.state.params.token + " }"
            })
            .then((res) => {
                // the temp file path
                console.log('The file saved to ', res.path())

                RNCOpenDoc.open(res.path());

            })
            .catch((errorMessage, statusCode) => {
                console.log(errorMessage, statusCode);
            })
    }


    render() {
        const self = this;

        switch (self.props.navigation.state.params.mode) {
            case "Revenue":
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <View style={{ alignSelf: 'stretch', flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'revenue') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black',
                                                borderColor: '#000', justifyContent: 'flex-end'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.rMinDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('max', 'revenue') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>

                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.rMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.ShowModalFunction(!this.state.showMail) }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_mail.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendMail('Revenue', 'download') }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_download.png')} />
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{
                                        width: 200, height: 45, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#000'
                                    }}>
                                        <CPicker
                                            placeholder="Select  Vehicles"
                                            cStyle={CustomStyles.cPickerStyle}
                                            selectedValue={this.state.truckText}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ truckText: Platform.OS==='ios'?itemValue.split("###")[1]:itemValue, selectedTruckId: itemValue.split("###")[0] })}>
                                            <Picker.Item label="Select Vehicles" value="Select  Vehicles" />
                                            {this.renderTrucksRegNo()}
                                        </CPicker>
                                    </View>
                                    <View style={{ marginTop: 5, marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('revenue') }}>{/* //RR */}
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 45, backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    Go
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            <Text style={[CustomStyles.headText, { marginTop: 5 }]}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>V.No</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Freight</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Expense</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Revenue</Text>
                                </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.recordsList}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                            });
                                            this.callSubCategoryScreen(this.gettruckName(item), item.totalRevenue, item.registrationNo)
                                        }}
                                    >

                                        <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={[CustomStyles.erpText, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>{this.gettruckName(item)}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalFreight}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalExpense}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalRevenue}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.registrationNo} />
                            <View style={CustomStyles.erpCategoryFooterItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>Total</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.grossFreight}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.grossExpenses}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.grossAmounts.grossRevenue}</Text>
                                </View>
                            </View>

                        </View>
                        <MailBox visible={this.state.showMail} Submit={'Submit'} cancel={'cancel'}
                            onAccept={() => { this.sendMail('Revenue') }}
                            onDecline={() => { this.ShowModalFunction(!this.state.showMail) }}
                            onchange={(mail) => { this.setState({ mail: mail }) }} />
                        {this.iosDateModal()}
                        <NoInternetModal visible={this.state.netFlaf}
                            onAccept={() => { this.setState({ netFlaf: false }) }} />
                    </View>
                );

                break;
            case "Expense":
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <View style={{ alignSelf: 'stretch', flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'expense') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black',
                                                borderColor: '#000', justifyContent: 'flex-end'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.expMinDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('max', 'expense') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>

                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.expMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.ShowModalFunction(!this.state.showMail) }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_mail.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendMail('Expense', 'download') }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_download.png')} />
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{
                                        width: 200, height: 45, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#000'
                                    }}>
                                        <CPicker
                                            placeholder="Select  Vehicles"
                                            cStyle={CustomStyles.cPickerStyle}
                                            selectedValue={this.state.truckText}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ truckText: Platform.OS==='ios'? itemValue.split("###")[1]:itemValue, selectedTruckId: itemValue.split("###")[0]})}>
                                            <Picker.Item label="Select Vehicles" value="Select  Vehicles" />
                                            {this.renderTrucksRegNo()}
                                        </CPicker>
                                        {/* <CPicker
                                            style={{width: 200, height: 45}}
                                            selectedValue={this.state.selectedTruckId}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedTruckId: itemValue })}>
                                            <Picker.Item label="Select Vehicles" value="Select  Vehicles" />
                                            {this.renderTrucksRegNo()}
                                        </CPicker> */}
                                    </View>
                                    <View style={{ marginTop: 5, marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('expense') }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 45, backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    GO
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                            <Text style={[CustomStyles.headText, { marginTop: 5 }]}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>V.No</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Diesel</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Toll</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Maint..</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>miscel..</Text>
                                </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.expenses}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                            });
                                            this.callSubCategoryScreen(item.regNumber, '', item.id)
                                        }}
                                    >

                                        <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={[CustomStyles.erpText, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>{item.regNumber}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.exps[0].dieselExpense}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.exps[0].tollExpense}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.exps[0].mExpense}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.exps[0].misc}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.id} />
                            <View style={CustomStyles.erpCategoryFooterItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>Total</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totalDieselExpense}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totaltollExpense}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totalmExpense}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.totalExpenses.totalmisc}</Text>
                                </View>
                            </View>
                        </View>
                        <MailBox visible={this.state.showMail} Submit={'Submit'} cancel={'cancel'}
                            onAccept={() => { this.sendMail('Expense') }}
                            onDecline={() => { this.ShowModalFunction(!this.state.showMail) }}
                            onchange={(mail) => { this.setState({ mail: mail }) }} />
                        {this.iosDateModal()}
                        <NoInternetModal visible={this.state.netFlaf}
                            onAccept={() => { this.setState({ netFlaf: false }) }} />
                    </View>
                );
                break;
            case "Payments":
                return (
                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <View style={[CustomStyles.row]}>
                                <Ctoggle label='Payables' activeStyle={{ backgroundColor: this.state.payablesBool }}
                                    labelStyle={{ color: 'white' }}
                                    onPress={() => this.changeRoleStatus('P')}
                                />
                                <Ctoggle label='Receivables' activeStyle={{ backgroundColor: this.state.receiveablesBool }}
                                    labelStyle={{ color: 'black' }}
                                    onPress={() => this.changeRoleStatus('R')}
                                />
                            </View>
                            <View style={{ alignSelf: 'stretch', flexDirection: 'column', flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'payment') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black',
                                                borderColor: '#000', justifyContent: 'flex-end'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>

                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                            inputTextStyle={{ fontSize: 14, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.pMinDate} />

                                                    </View>

                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('max', 'payment') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                            inputTextStyle={{ fontSize: 14, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.pMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => { this.ShowModalFunction(!this.state.showMail) }}>
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_mail.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendMail('Payments', 'download') }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_download.png')} />
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                                <View style={{ flex: 1, height: 100, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{
                                        width: 200, height: 45, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#000'
                                    }}>
                                        <CPicker
                                            placeholder="Select Parties"
                                            cStyle={CustomStyles.cPickerStyle}
                                            selectedValue={this.state.truckText}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ truckText: Platform.OS==='ios'? itemValue.split("###")[1]:itemValue, selectedTruckId: itemValue.split("###")[0] })}>
                                            <Picker.Item label="Select Parties" value="Select Parties" />
                                            {this.renderPartyList()}
                                        </CPicker>
                                        {/* <Picker
                                            style={{ width: 200, height: 45 }}
                                            selectedValue={this.state.selectedTruckId}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedTruckId: itemValue })}>
                                            <Picker.Item label="Select Parties" value="Select Parties" />
                                            {this.renderPartyList()}
                                        </Picker> */}
                                    </View>
                                    <View style={{ marginTop: 5, marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('payment') }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 45, backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    GO
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <Text style={[CustomStyles.headText, { marginTop: 5 }]}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Party</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Total Amount </Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Paid</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Payable</Text>
                                </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.paymentsParties}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                            });
                                            this.callSubCategoryScreen(this.getPayablePartyName(item), '', this.getPayablePartyID(item))
                                        }}
                                    >

                                        <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={[CustomStyles.erpText, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>
                                                    {this.getPayablePartyName(item)}
                                                </Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalAmount}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.paidAmount}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.payableAmount}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.id} />
                            <View style={CustomStyles.erpCategoryFooterItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>Total</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.payableGrossAmounts.totalAmount}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.payableGrossAmounts.paidAmount}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.payableGrossAmounts.payableAmount}</Text>
                                </View>
                            </View>
                        </View>
                        <MailBox visible={this.state.showMail} Submit={'Submit'} cancel={'cancel'}
                            onAccept={() => { this.sendMail('Payments') }}
                            onDecline={() => { this.ShowModalFunction(!this.state.showMail) }}
                            onchange={(mail) => { this.setState({ mail: mail }) }} />
                        {this.iosDateModal()}
                        <NoInternetModal visible={this.state.netFlaf}
                            onAccept={() => { this.setState({ netFlaf: false }) }} />
                    </View>
                );
                break;
            case "Receivables":
                return (

                    <View style={CustomStyles.viewStyle}>
                        <View style={CustomStyles.erpCategory}>
                            <View style={[CustomStyles.row]}>
                                <Ctoggle label='Payables' activeStyle={{ backgroundColor: this.state.payablesBool }}
                                    labelStyle={{ color: 'black' }}
                                    onPress={() => this.changeRoleStatus('P')}
                                />
                                <Ctoggle label='Receivables' activeStyle={{ backgroundColor: this.state.receiveablesBool }}
                                    labelStyle={{ color: 'white' }}
                                    onPress={() => this.changeRoleStatus('R')}
                                />
                            </View>
                            <View style={{ alignSelf: 'stretch', flexDirection: 'column', flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'receivables') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black',
                                                borderColor: '#000', justifyContent: 'flex-end'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>

                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 20 }}
                                                            inputTextStyle={{ fontSize: 14, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.recMinDate} />

                                                    </View>

                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('max', 'receivables') }}
                                        >
                                            <View style={{
                                                backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'black'
                                            }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>

                                                        <CustomEditText underlineColorAndroid='transparent'
                                                            editable={false}
                                                            placeholder={'Select Date'}
                                                            inputContainerStyle={{ justifyContent: 'flex-end', height: 20 }}
                                                            inputTextStyle={{ fontSize: 14, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.recMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.ShowModalFunction(!this.state.showMail) }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_mail.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendMail('Receivables', 'download') }}
                                        >
                                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                                source={require('../images/erp_download.png')} />
                                        </TouchableOpacity>
                                    </View> */}
                                </View>
                                <View style={{ flex: 1, height: 100, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{
                                        width: 200, height: 45, backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#000'
                                    }}>
                                        <CPicker
                                            placeholder="Select Parties"
                                            cStyle={CustomStyles.cPickerStyle}
                                            selectedValue={this.state.truckText}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ truckText: Platform.OS==='ios'? itemValue.split("###")[1]:itemValue, selectedTruckId: itemValue.split("###")[0] })}>
                                            <Picker.Item label="Select Parties" value="Select Parties" />
                                            {this.renderPartyList()}
                                        </CPicker>
                                    </View>
                                    <View style={{ marginTop: 5, marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('receivables') }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 45, backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    GO
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <Text style={[CustomStyles.headText, { marginTop: 5 }]}>{this.props.navigation.state.params.label}</Text>
                            <View style={CustomStyles.erpCategoryHeaderItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Party</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Freight</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Paid</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpHeaderText}>Due</Text>
                                </View>
                            </View>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.paymentsParties}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                categoryBgColor: !this.state.categoryBgColor
                                            });
                                            this.callSubCategoryScreen(item.totalFright, '', item.id)
                                        }}
                                    >

                                        <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={[CustomStyles.erpText, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>
                                                    {this.getParty(item)}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalFright}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalPayment}</Text>
                                            </View>
                                            <View style={CustomStyles.erpTextView}>
                                                <Text style={CustomStyles.erpText}>{item.totalDue}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.id} />
                            <View style={CustomStyles.erpCategoryFooterItems}>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>Total</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.paymentsGrossAmounts.grossFreight}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.paymentsGrossAmounts.grossExpenses}</Text>
                                </View>
                                <View style={CustomStyles.erpTextView}>
                                    <Text style={CustomStyles.erpFooterText}>{this.state.paymentsGrossAmounts.grossDue}</Text>
                                </View>
                            </View>
                        </View>
                        <MailBox visible={this.state.showMail} Submit={'Submit'} cancel={'cancel'}
                            onAccept={() => { this.sendMail('Receivables') }}
                            onDecline={() => { this.ShowModalFunction(!this.state.showMail) }}
                            onchange={(mail) => { this.setState({ mail: mail }) }} />
                        {this.iosDateModal()}
                        <NoInternetModal visible={this.state.netFlaf}
                            onAccept={() => { this.setState({ netFlaf: false }) }} />
                    </View>
                );
                break;


        }
    }
}