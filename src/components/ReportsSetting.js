import React, { Component } from 'react';
import {
    View, Image, AsyncStorage, Text, DatePickerAndroid, DatePickerIOS, Platform,
    TouchableOpacity, ScrollView, Keyboard, FlatList, BackHandler
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { CustomInput, CSpinner, Card, CustomEditText, CustomErpDateView, CustomText, Confirm } from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import CustomStyles from './common/CustomStyles';
import Axios from 'axios';
import Utils from './common/Utils';

class ReportsSetting extends Component {
    state = {
        defaultDate: new Date(),
        showModal: false,
        RData: [{ key: 'default', selectedItem: false },{ key: 'day', selectedItem: false }, { key: 'week', selectedItem: false }, { key: 'month', selectedItem: false }, { key: 'year', selectedItem: false }, { key: 'custom', selectedItem: false }],
        itemIndex: 1,
        rMaxDate: '', rMaxPassdate: '', rMinDate: '', rMinPassdate: '', rcustomBool: 'none',

        PData: [{ key: 'default', selectedItem: false },{ key: 'day', selectedItem: false }, { key: 'week', selectedItem: false }, { key: 'month', selectedItem: false }, { key: 'year', selectedItem: false }, { key: 'custom', selectedItem: false }],
        PitemIndex: 1,
        pMaxDate: '', pMaxPassdate: '', pMinDate: '', pMinPassdate: '', pcustomBool: 'none',

        expData: [{ key: 'default', selectedItem: false },{ key: 'day', selectedItem: false }, { key: 'week', selectedItem: false }, { key: 'month', selectedItem: false }, { key: 'year', selectedItem: false }, { key: 'custom', selectedItem: false }],
        expitemIndex: 1,
        expMaxDate: '', expMaxPassdate: '', expMinDate: '', expMinPassdate: '', expcustomBool: 'none',

        tcData: [{ key: 'default', selectedItem: false },{ key: 'day', selectedItem: false }, { key: 'week', selectedItem: false }, { key: 'month', selectedItem: false }, { key: 'year', selectedItem: false }, { key: 'custom', selectedItem: false }],
        tcitemIndex: 1,
        tcMaxDate: '', tcMaxPassdate: '', tcMinDate: '', tcMinPassdate: '', tccustomBool: 'none',

        fcData: [{ key: 'default', selectedItem: false },{ key: 'day', selectedItem: false }, { key: 'week', selectedItem: false }, { key: 'month', selectedItem: false }, { key: 'year', selectedItem: false }, { key: 'custom', selectedItem: false }],
        fcitemIndex: 1,
        fcMaxDate: '', fcMaxPassdate: '', fcMinDate: '', fcMinPassdate: '', fccustomBool: 'none',

        expiryData: [{ key: 'default', selectedItem: false },{ key: 'day', selectedItem: false }, { key: 'week', selectedItem: false }, { key: 'month', selectedItem: false }, { key: 'year', selectedItem: false }, { key: 'custom', selectedItem: false }],
        expiryitemIndex: 1,
        expiryMaxDate: '', expiryMaxPassdate: '', expiryMinDate: '', expiryMinPassdate: '', expirycustomBool: 'none',
        erpSettings: [],
        spinnerBool: false

    };




    componentWillMount() {
        const self = this;
        self.getCredentailsData();
        self.setState({ spinnerBool: true });
        BackHandler.addEventListener('hardwareBackPress', self.onBackAndroid.bind(self));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token });
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.erpSettingData
                })
                    .then((response) => {
                        console.log('erpSettings', response);
                        if (response.data.status) {
                            console.log('expiry ==>', response.data.erpSettings);
                            this.setState({ erpSettings: response.data.erpSettings });
                            this.setSelection('revenue', response.data.erpSettings.revenue);
                            this.setSelection('tollCard', response.data.erpSettings.tollCard);
                            this.setSelection('fuelCard', response.data.erpSettings.fuelCard);
                            this.setSelection('payment', response.data.erpSettings.payment);
                            this.setSelection('expense', response.data.erpSettings.expense);
                            this.setSelection('expiry', response.data.erpSettings.expiry);
                            this.setState({ spinnerBool: false });

                        } else {
                            //console.log('error in erpSettingData ==>', response);
                            this.setState({ spinnerBool: false });
                            let message = "";
                            response.data.messages.forEach(function (current_value) {
                                message = message + current_value;
                            });
                            Utils.ShowMessage(message);
                        }

                    }).catch((error) => {
                        console.log('error in erpSettingData ==>', error);
                    })
            } else {
                this.setState({ spinnerBool: false });
            }
        }
        );
    }
    async getCache(callback) {
        try {
            var value = await AsyncStorage.getItem('credientails');
            callback(value);
        }
        catch (e) {
            console.log('caught error', e);
            // Handle exceptions
        }
    }

    onBackAndroid() {
        //  Actions.pop();
    }

    setSelection(type, filterTypes) {
        switch (type) {
            case "revenue":
                var display = 'none';
                if (filterTypes.filterType === 'custom') {
                    display = 'flex'
                    this.setState({ rMaxDate: this.getParsedDate(filterTypes.fromDate), rMaxPassdate: this.getISODate(filterTypes.fromDate), rMinDate: this.getParsedDate(filterTypes.toDate), rMinPassdate: this.getISODate(filterTypes.toDate) });
                }
                return this.setState({ itemIndex: this.getIndexofDateArray(this.state.RData, filterTypes.filterType), rcustomBool: display }, () => {
                    //console.log('itemIndex',this.state.itemIndex,'\n',this.state.RData);                                     
                });
                break;
            case "payment":
                var display = 'none';
                if (filterTypes.filterType === 'custom') {
                    display = 'flex'
                    this.setState({ pMaxDate: this.getParsedDate(filterTypes.fromDate), pMaxPassdate: this.getISODate(filterTypes.fromDate), pMinDate: this.getParsedDate(filterTypes.toDate), pMinPassdate: this.getISODate(filterTypes.toDate) });
                }
                return this.setState({ PitemIndex: this.getIndexofDateArray(this.state.PData, filterTypes.filterType), pcustomBool: display }, () => {
                    //console.log('PitemIndex',this.state.PitemIndex,'\n',this.state.PData);                                     
                });
                break;
            case "expense":
                var display = 'none';
                if (filterTypes.filterType === 'custom') {
                    display = 'flex'
                    this.setState({ expMaxDate: this.getParsedDate(filterTypes.fromDate), expMaxPassdate: this.getISODate(filterTypes.fromDate), expMinDate: this.getParsedDate(filterTypes.toDate), expMinPassdate: this.getISODate(filterTypes.toDate) });
                }
                return this.setState({ expitemIndex: this.getIndexofDateArray(this.state.expData, filterTypes.filterType), expcustomBool: display }, () => {
                    //console.log('expitemIndex',this.state.expitemIndex,'\n',this.state.expData);                                     
                });
                break;
            case "tollCard":
                var display = 'none';
                if (filterTypes.filterType === 'custom') {
                    display = 'flex';
                    this.setState({ tcMaxDate: this.getParsedDate(filterTypes.fromDate), tcMaxPassdate: this.getISODate(filterTypes.fromDate), tcMinDate: this.getParsedDate(filterTypes.toDate), tcMinPassdate: this.getISODate(filterTypes.toDate) });
                }
                return this.setState({ tcitemIndex: this.getIndexofDateArray(this.state.tcData, filterTypes.filterType), tccustomBool: display }, () => {
                    //console.log('tcitemIndex',this.state.tcitemIndex,'\n',this.state.tcData);                                     
                });
                break;
            case "fuelCard"://fuelcard
                var display = 'none';
                if (filterTypes.filterType === 'custom') {
                    display = 'flex';
                    this.setState({ fcMaxDate: this.getParsedDate(filterTypes.fromDate), fcMaxPassdate: this.getISODate(filterTypes.fromDate), fcMinDate: this.getParsedDate(filterTypes.toDate), fcMinPassdate: this.getISODate(filterTypes.toDate) });
                }

                return this.setState({ fcitemIndex: this.getIndexofDateArray(this.state.fcData, filterTypes.filterType), fccustomBool: display }, () => {
                    //console.log('fuelcarditemIndex',this.state.fcitemIndex,'\n',this.state.fcData);                                     
                });
                break;
            case "expiry"://fuelcard
                var display = 'none';
                if (filterTypes.filterType === 'custom') {
                    display = 'flex';
                    this.setState({ expiryMaxDate: this.getParsedDate(filterTypes.fromDate), expiryMaxPassdate: this.getISODate(filterTypes.fromDate), expiryMinDate: this.getParsedDate(filterTypes.toDate), expiryMinPassdate: this.getISODate(filterTypes.toDate) });
                }
                return this.setState({ expiryitemIndex: this.getIndexofDateArray(this.state.expiryData, filterTypes.filterType), expirycustomBool: display }, () => {
                    //console.log('expiryitemIndex',this.state.expiryitemIndex,'\n',this.state.expiryData);                                     
                });
                break;
        }
    }

    getIndexofDateArray(arrayData, dateSelection) {
        for (let i = 0; i < arrayData.length; i++) {
            if (arrayData[i].key === dateSelection) {
                return i;
                break;
            }
        }
    }

    getParsedDate(item) {
        var formattedDate = new Date(item);
        return formattedDate.getDate().toString() + "/" + (formattedDate.getMonth() + 1) + "/" + formattedDate.getFullYear().toString();
    }

    getISODate(item) {
        var formattedDate = new Date(item);
        return formattedDate.toISOString();
    }


    sendReportsData() {
        this.setState({ spinnerBool: true });
        console.log('posting data', this.state.erpSettings);
        //console.log('posting token',this.state.token);
        Axios({
            method: 'put',
            headers: { 'token': this.state.token },
            data: this.state.erpSettings,
            url: Config.routes.base + Config.routes.updateErpSettingData
        })
            .then((response) => {
                //console.log('erpSettings',Config.routes.base + Config.routes.erpSettingData);
                //console.log('update erpSettings',response);
                if (response.data.status) {
                    this.getCredentailsData();
                    this.setState({ spinnerBool: false });
                    let message = "";
                    response.data.messages.forEach(function (current_value) {
                        message = message + current_value;
                    });
                    Utils.ShowMessage(message);

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


    callSubCategoryScreen(item, category) {
        switch (category) {
            case "revenue":
                var display = 'none';
                if (item.key === 'custom') {
                    display = 'flex'
                }
                return this.setState({ itemIndex: this.state.RData.indexOf(item), rcustomBool: display }, () => {
                    //console.log('itemIndex',this.state.itemIndex,'\n',this.state.RData);                                     
                    if (display === 'none') {
                        this.state.erpSettings.revenue = { "filterType": item.key };
                        this.sendReportsData();
                    }
                });
                break;
            case "payment":
                var display = 'none';
                if (item.key === 'custom') {
                    display = 'flex'
                }
                return this.setState({ PitemIndex: this.state.PData.indexOf(item), pcustomBool: display }, () => {
                    // console.log('itemIndex',this.state.PitemIndex,'\n',this.state.PData);
                    if (display === 'none') {
                        this.state.erpSettings.payment = { "filterType": item.key };
                        this.sendReportsData();
                    }
                });
                break;
            case "expense":
                var display = 'none';
                if (item.key === 'custom') {
                    display = 'flex'
                }
                return this.setState({ expitemIndex: this.state.expData.indexOf(item), expcustomBool: display }, () => {
                    //console.log('expitemIndex',this.state.expitemIndex,'\n',this.state.expData);    
                    if (display === 'none') {
                        this.state.erpSettings.expense = { "filterType": item.key };
                        this.sendReportsData();
                    }
                });
                break;
            case "tollCard":
                var display = 'none';
                if (item.key === 'custom') {
                    display = 'flex'
                }
                return this.setState({ tcitemIndex: this.state.tcData.indexOf(item), tccustomBool: display }, () => {
                    //console.log('expitemIndex',this.state.tcitemIndex,'\n',this.state.tcData); 
                    if (display === 'none') {
                        this.state.erpSettings.tollCard = { "filterType": item.key };
                        this.sendReportsData();
                    }
                });
                break;
            case "fuelCard"://fuelcard
                var display = 'none';
                if (item.key === 'custom') {
                    display = 'flex'
                }
                return this.setState({ fcitemIndex: this.state.fcData.indexOf(item), fccustomBool: display }, () => {
                    //console.log('fuelcarditemIndex',this.state.fcitemIndex,'\n',this.state.fcData);  
                    if (display === 'none') {
                        this.state.erpSettings.fuelCard = { "filterType": item.key };
                        this.sendReportsData();
                    }
                });
                break;
            case "expiry"://fuelcard
                var display = 'none';
                if (item.key === 'custom') {
                    display = 'flex'
                }
                return this.setState({ expiryitemIndex: this.state.expiryData.indexOf(item), expirycustomBool: display }, () => {
                    //console.log('expiryitemIndex',this.state.fcitemIndex,'\n',this.state.expiryData);   
                    if (display === 'none') {
                        this.state.erpSettings.expiry = { "filterType": item.key };
                        this.sendReportsData();
                    }
                });
                break;
        }

    }

    renderItem(item) {
        if (this.state.RData.indexOf(item) == this.state.itemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'revenue')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#404040' }} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'revenue')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#ffffff' }} />
                </TouchableOpacity>
            );
        }
    }

    payementRenderItem(item) {
        if (this.state.PData.indexOf(item) == this.state.PitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'payment')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#404040' }} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'payment')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#ffffff' }} />
                </TouchableOpacity>
            );
        }
    }

    expenseRenderItem(item) {
        if (this.state.expData.indexOf(item) == this.state.expitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'expense')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#404040' }} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'expense')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#ffffff' }} />
                </TouchableOpacity>
            );
        }
    }

    tollcardRenderItem(item) {
        if (this.state.tcData.indexOf(item) == this.state.tcitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'tollCard')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#404040' }} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'tollCard')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#ffffff' }} />
                </TouchableOpacity>
            );
        }
    }

    fuelcardRenderItem(item) {
        if (this.state.fcData.indexOf(item) == this.state.fcitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'fuelCard')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#404040' }} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'fuelCard')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#ffffff' }} />
                </TouchableOpacity>
            );
        }
    }
    //expiryRenderItem
    expiryRenderItem(item) {
        if (this.state.expiryData.indexOf(item) == this.state.expiryitemIndex) {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'expiry')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#404040' }} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item, 'expiry')}>
                    <CustomErpDateView name={item.key} setStyle={{ backgroundColor: '#ffffff' }} />
                </TouchableOpacity>
            );
        }
    }

    onPickdate(str, category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal, str: str, category: category })
        } else {
            try {
                const { action, year, month, day } = DatePickerAndroid.open({

                    minDate: str == 'min' ? new Date() : new Date('1-1-2007'),
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
                            case "payment":
                                if (str === 'max') {
                                    this.setState({ pMaxDate: date, pMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ pMinDate: date, pMinPassdate: month + "/" + response.day + "/" + response.year });
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
                            case "tollCard":
                                if (str === 'max') {
                                    this.setState({ tcMaxDate: date, tcMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ tcMinDate: date, tcMinPassdate: month + "/" + response.day + "/" + response.year });
                                }
                                return;
                                break;
                            case "fuelCard":
                                if (str === 'max') {
                                    this.setState({ fcMaxDate: date, fcMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ fcMinDate: date, fcMinPassdate: month + "/" + response.day + "/" + response.year });
                                }
                                return;
                                break;
                            case "expiry":
                                if (str === 'max') {
                                    this.setState({ expiryMaxDate: date, expiryMaxPassdate: month + "/" + response.day + "/" + response.year });
                                } else {
                                    this.setState({ expiryMinDate: date, expiryMinPassdate: month + "/" + response.day + "/" + response.year });
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
            case "tollCard":
                if (this.state.str === 'max' && this.state.tcMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.tcMinDate === '') {
                    alert('Select a date');
                } else {
                    this.setState({ showModal: false })
                }
                return;
                break;
            case "fuelCard":
                if (this.state.str === 'max' && this.state.fcMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.fcMinDate === '') {
                    alert('Select a date');
                } else {
                    this.setState({ showModal: false })
                }
                return;
                break;
            case "expiry":
                if (this.state.str === 'max' && this.state.expiryMaxDate === '') {
                    alert('Select a date');
                } else if (this.state.str !== 'max' && this.state.expiryMinDate === '') {
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
            case "tollCard":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, tcMaxDate: '', tcMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, tcMinDate: '', tcMinPassdate: '' });
                }
                return;
                break;
            case "fuelCard":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, fcMaxDate: '', fcMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, fcMinDate: '', fcMinPassdate: '' });
                }
                return;
                break;
            case "expiry":
                if (this.state.str === 'max') {
                    this.setState({ showModal: false, expiryMaxDate: '', expiryMaxPassdate: '' });
                } else {
                    this.setState({ showModal: false, expiryMinDate: '', expiryMinPassdate: '' });
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
                            case "tollCard":
                                if (this.state.str === 'max') {
                                    this.setState({ tcMaxDate: date, tcMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ tcMinDate: date, tcMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                return;
                                break;
                            case "fuelCard":
                                if (this.state.str === 'max') {
                                    this.setState({ fcMaxDate: date, fcMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ fcMinDate: date, fcMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                return;
                                break;
                            case "expiry":
                                if (this.state.str === 'max') {
                                    this.setState({ expiryMaxDate: date, expiryMaxPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ expiryMinDate: date, expiryMinPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
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
                if (this.state.rMinDate.includes('/')) {
                    if (this.state.rMaxDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.rMinPassdate), new Date(this.state.rMaxPassdate)) > 0) {

                            this.state.erpSettings.revenue = {
                                "fromDate": this.getISODate(this.state.rMinPassdate),
                                "toDate": this.getISODate(this.state.rMaxPassdate),
                                "filterType": "custom"
                            };
                            this.sendReportsData();
                        } else {
                            Utils.ShowMessage("Please Check Mini./Max. Date");
                        }
                    } else {
                        Utils.ShowMessage("Please Enter Revenue Max. Date");
                    }
                } else {
                    Utils.ShowMessage("Please Enter Revenue Mini. Date");
                }
                return;
                break;
            case "payment":
                if (this.state.pMinDate.includes('/')) {
                    if (this.state.pMaxDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.pMinPassdate), new Date(this.state.pMaxPassdate)) > 0) {
                            this.state.erpSettings.payment = {
                                "fromDate": this.getISODate(this.state.pMinPassdate),
                                "toDate": this.getISODate(this.state.pMaxPassdate),
                                "filterType": "custom"
                            };
                            this.sendReportsData();
                        } else {
                            Utils.ShowMessage("Please Check Mini./Max. Date");
                        }
                    } else {
                        Utils.ShowMessage("Please Enter Payment Max. Date");
                    }
                } else {
                    Utils.ShowMessage("Please Enter Payment Mini. Date");
                }
                return;
                break;
            case "expense":
                if (this.state.expMinDate.includes('/')) {
                    if (this.state.expMaxDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.expMinPassdate), new Date(this.state.expMaxPassdate)) > 0) {
                            this.state.erpSettings.expense = {
                                "fromDate": this.getISODate(this.state.expMinPassdate),
                                "toDate": this.getISODate(this.state.expMaxPassdate),
                                "filterType": "custom"
                            };
                            this.sendReportsData();
                        } else {
                            Utils.ShowMessage("Please Check Mini./Max. Date");
                        }
                    } else {
                        Utils.ShowMessage("Please Enter Expense Max. Date");
                    }
                } else {
                    Utils.ShowMessage("Please Enter Expense Mini. Date");
                }
                return;
                break;
            case "tollCard":
                if (this.state.tcMinDate.includes('/')) {
                    if (this.state.tcMaxDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.tcMinPassdate), new Date(this.state.tcMaxPassdate)) > 0) {
                            this.state.erpSettings.expense = {
                                "fromDate": this.getISODate(this.state.tcMinPassdate),
                                "toDate": this.getISODate(this.state.tcMaxPassdate),
                                "filterType": "custom"
                            };
                            this.sendReportsData();
                        } else {
                            Utils.ShowMessage("Please Check Mini./Max. Date");
                        }
                    } else {
                        Utils.ShowMessage("Please Enter Toll Card Max. Date");
                    }
                } else {
                    Utils.ShowMessage("Please Enter Toll Card Mini. Date");
                }
                return;
                break;
            case "fuelCard":
                if (this.state.fcMinDate.includes('/')) {
                    if (this.state.fcMaxDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.fcMinPassdate), new Date(this.state.fcMaxPassdate)) > 0) {
                            this.state.erpSettings.expense = {
                                "fromDate": this.getISODate(this.state.fcMinPassdate),
                                "toDate": this.getISODate(this.state.fcMaxPassdate),
                                "filterType": "custom"
                            };
                            this.sendReportsData();
                        } else {
                            Utils.ShowMessage("Please Check Mini./Max. Date");
                        }
                    } else {
                        Utils.ShowMessage("Please Enter Fuel Card  Max. Date");
                    }
                } else {
                    Utils.ShowMessage("Please Enter Fuel Card Mini. Date");
                }
                return;
                break;
            case "expiry":
                if (this.state.expiryMinDate.includes('/')) {
                    if (this.state.expiryMaxDate.includes('/')) {
                        if (this.getDaysfunction(new Date(this.state.expiryMinPassdate), new Date(this.state.expiryMaxPassdate)) > 0) {
                            this.state.erpSettings.expense = {
                                "fromDate": this.getISODate(this.state.expiryMinPassdate),
                                "toDate": this.getISODate(this.state.expiryMaxPassdate),
                                "filterType": "custom"
                            };
                            this.sendReportsData();
                        } else {
                            Utils.ShowMessage("Please Check Mini./Max. Date");
                        }
                    } else {
                        Utils.ShowMessage("Please Enter Fuel Card  Max. Date");
                    }
                } else {
                    Utils.ShowMessage("Please Enter Fuel Card Mini. Date");
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

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    render() {

        return (
            <View style={[CustomStyles.viewStyle, {backgroundColor: 'rgba(255,255,255,0)'}]}>
                <ScrollView style={{ alignSelf: 'stretch', flex: 1, marginBottom: 10 }}>
                    <View style={CustomStyles.containerStyle}>
                        {this.spinnerLoad()}
                        <Card>
                            <View style={{ alignSelf: 'stretch' }}>
                                <Text style={CustomStyles.headText}>{'Revenue'}</Text>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.RData}
                                    renderItem={({ item }) => this.renderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.RData}
                                    selected={this.state.itemIndex}
                                />
                                <View style={{ display: this.state.rcustomBool, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
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
                                    <View style={{ flex: 2, justifyContent: 'flex-end', marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('revenue') }}>
                                            <View style={{ backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>
                        {/* //Payment */}
                        <Card>
                            <View style={{ alignSelf: 'stretch' }}>
                                <Text style={CustomStyles.headText}>{'Payement'}</Text>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.PData}
                                    renderItem={({ item }) => this.payementRenderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.PData}
                                    selected={this.state.PitemIndex}
                                />
                                <View style={{ display: this.state.pcustomBool, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
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
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
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
                                    <View style={{ flex: 2, justifyContent: 'flex-end', marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('payment') }}>
                                            <View style={{ backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>
                        {/* //Expense */}
                        <Card>
                            <View style={{ alignSelf: 'stretch' }}>
                                <Text style={CustomStyles.headText}>{'Expense'}</Text>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.expData}
                                    renderItem={({ item }) => this.expenseRenderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.expData}
                                    selected={this.state.expitemIndex}
                                />
                                <View style={{ display: this.state.expcustomBool, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
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
                                    <View style={{ flex: 2, justifyContent: 'flex-end', marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('expense') }}>
                                            <View style={{ backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>

                        {/* //Toll Card */}
                        <Card>
                            <View style={{ alignSelf: 'stretch' }}>
                                <Text style={CustomStyles.headText}>{'Toll Card'}</Text>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.tcData}
                                    renderItem={({ item }) => this.tollcardRenderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.tcData}
                                    selected={this.state.tcitemIndex}
                                />
                                <View style={{ display: this.state.tccustomBool, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'tollCard') }}
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
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.tcMinDate} />

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
                                            onPress={() => { this.onPickdate('max', 'tollCard') }}
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
                                                            value={this.state.tcMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 2, justifyContent: 'flex-end', marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('tollCard') }}>
                                            <View style={{ backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>

                        {/* //fuel Card */}
                        <Card>
                            <View style={{ alignSelf: 'stretch' }}>
                                <Text style={CustomStyles.headText}>{'Fuel Card'}</Text>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.fcData}
                                    renderItem={({ item }) => this.fuelcardRenderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.fcData}
                                    selected={this.state.fcitemIndex}
                                />
                                <View style={{ display: this.state.fccustomBool, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'fuelCard') }}
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
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.fcMinDate} />

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
                                            onPress={() => { this.onPickdate('max', 'fuelCard') }}
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
                                                            value={this.state.fcMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 2, justifyContent: 'flex-end', marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('fuelCard') }}>
                                            <View style={{ backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>

                        {/* //expiry Card */}
                        <Card>
                            <View style={{ alignSelf: 'stretch' }}>
                                <Text style={CustomStyles.headText}>{'Expiry'}</Text>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.expiryData}
                                    renderItem={({ item }) => this.expiryRenderItem(item)}
                                    keyExtractor={(item, index) => index}
                                    extraData={this.state.expiryData}
                                    selected={this.state.expiryitemIndex}
                                />
                                <View style={{ display: this.state.expirycustomBool, flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.onPickdate('min', 'expiry') }}
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
                                                            inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                            value={this.state.expiryMinDate} />

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
                                            onPress={() => { this.onPickdate('max', 'expiry') }}
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
                                                            value={this.state.expiryMaxDate} />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Image style={{ width: 18, height: 18, resizeMode: 'contain' }}
                                                            source={require('../images/down_arrow.png')} />
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 2, justifyContent: 'flex-end', marginLeft: 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { this.sendSettingData('expiry') }}>
                                            <View style={{ backgroundColor: "#e83b13" }}>
                                                <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                                    SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>

                    </View>
                </ScrollView>
                {this.iosDateModal()}

            </View>
        );
    }
}


export default ReportsSetting;

{/*  <View style={{flex:2,justifyContent:'flex-end',paddingBottom:2}}>
                                        <TouchableOpacity
                                            onPress={() => { alert('max','revenue') }}>
                                            <View style={{ backgroundColor: "transparent",borderWidth: 1,borderColor:'#000000'}}>
                                                <Text style={{ color: '#000', fontSize:10,padding: 5, alignSelf: 'center' }}>
                                                    15 SET
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>    */}