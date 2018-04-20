//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { ActivityIndicator, View, ScrollView, BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, MailBox, CSpinner, CustomText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import Utils from './common/Utils';
export default class ExpiryDate extends Component {

    state = {
        categoryBgColor: false,
        itemIndex: 0,
        lookFor: '',
        label: '',
        spinnerBool: false,
        data: [],
        trucks: [],
        count: 0,
        showMail: false,
        mail: '',
    };
    componentWillMount() {
        const self = this;
        this.callExpiryAPI(self.props.navigation.state.params.baseExpiry);
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
    }


    callExpiryAPI(data) {
        this.setState({ label: data });
        switch (data) {
            case "Insurance":
                this.setState({ lookFor: 'insuranceExpiry' });
                console.log("Insurance", data);
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.insuranceExpiryTrucks);
                break;
            case "Pollution":
                console.log("Pollution", data);
                this.setState({ lookFor: 'pollutionExpiry' });
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.pollutionExpiryTrucks);
                break;
            case "Fittness":
                console.log("Fittness", data);
                this.setState({ lookFor: 'fitnessExpiry' });
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.fitnessExpiryTrucks);
                break;
            case "Tax":
                console.log("Tax", data);
                this.setState({ lookFor: 'taxDueDate' });
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.taxExpiryTrucks);
                break;
            case "Permit":
                console.log("Permit", data);
                this.setState({ lookFor: 'permitExpiry' });
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.permitExpiryTrucks);
                break;

            default:
                text = "I have never heard of that fruit...";
        }

    }

    callExpiryBaseAPI(Url) {
        const self = this;
        self.setState({ spinnerBool: true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Url
        })
            .then((response) => {
                console.log('expiry ==>', response.data);
                console.log('expiry ==>', response.status,
                    "====401");
                if (response.data.status) {
                    self.setState({
                        trucks: response.data.trucks
                    });
                    self.setState({ spinnerBool: false });
                } else {
                    console.log('error in ExpiryDate ==>', response);
                    self.setState({ spinnerBool: false });
                }
                var datad = [
                    {
                        id: '1',
                        selectedItem: true,
                        title: "Permit"
                    },
                    {
                        id: '2',
                        selectedItem: false,
                        title: "Tax"
                    },
                    {
                        id: '3',
                        selectedItem: false,
                        title: "Insurance"
                    },
                    {
                        id: '4',
                        selectedItem: false,
                        title: "Pollution"
                    },
                    {
                        id: '5',
                        selectedItem: false,
                        title: "Fittness"
                    }
                ];
                this.setState({ data: datad });
            }).catch((error) => {
                console.log('error in ExpiryDate ==>', error);
            })
    }


    callSubCategoryScreen(item) {
        console.log(item, ' --->');
        var data = this.state.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == item.id) {
                data[i].selectedItem = true;
                this.callExpiryAPI(data[i].title);
            } else {
                data[i].selectedItem = false;
            }
        }
        var data = this.state.data;
        this.setState({ itemIndex: this.state.data.indexOf(item), data: data });
    }


    renderItem(item) {
        if (this.state.data.indexOf(item) == this.state.itemIndex) {
            // console.log('in if', item.title);
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item)}>
                    <View style={[CustomStyles.iosSelectedButton, { flexDirection: 'row', padding: 5 }]}>
                        <Text style={[{
                        }, CustomStyles.epirySelectedButtons]}>
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            //console.log('in else', item.title);
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item)}>
                    <View style={{ flexDirection: 'row', padding: 5 }}>
                        <Text style={CustomStyles.epiryButtons}>
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    getParsedDate(item) {
        var date = item[this.state.lookFor];
        //console.log('date-riyaz',date,item[this.state.lookFor]);
        var formattedDate = new Date(date);
        if (true) {//this.functiona(new Date(date)) > 15
            return (
                <Text style={[CustomStyles.erpSubCatText, { color: 'red' }]}>
                    {formattedDate.getDate() + "/" + (formattedDate.getMonth()+1) + "/" + formattedDate.getFullYear()}
                </Text>);
        }else if (this.functiona(new Date(date)) > 2 && this.functiona(new Date(date)) <= 15) {
            return (
                <Text style={[CustomStyles.erpSubCatText, { color: 'orange' }]}>
                    {formattedDate.getDate() + "/" + (formattedDate.getMonth()+1) + "/" + formattedDate.getFullYear()}
                </Text>);
         } else {
            return (
                <Text style={[CustomStyles.erpSubCatText, { color: 'red' }]}>
                    {formattedDate.getDate() + "/" + (formattedDate.getMonth()+1) + "/" + formattedDate.getFullYear()}
                </Text>);
        }
    }

    functiona(date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var today = new Date();
        // Convert both dates to milliseconds
        var date1_ms = today.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        console.log('difference_ms',Math.round(difference_ms / one_day));
        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }
    ShowModalFunction(visible) {
        this.setState({ showMail: visible });
    }


    sendMail() {
        const self = this;
        if (this.state.mail.trim().length == 0) {
            return Utils.ShowMessage("Please Enter Email");
        }

        if (/^\S+@\S+\.\S+/.test(this.state.mail)) {
            var sort = { "createdAt": -1 };

            var tempURL = "email=" + this.state.mail + "&fromDate=&page=&regNumber=&size=&sort=" + JSON.stringify(sort) + "&toDate=";
            this.sendReportsData(Config.routes.base + Config.routes.expiryTrucksMail + tempURL);
        } else {
            return Utils.ShowMessage('Please Enter Valid Mail ID');
        }

    }

    sendReportsData(url) {
        this.setState({ spinnerBool: true });
        console.log('ExpiryDate posting data', url);
        Axios({
            method: 'get',
            headers: { 'token': this.props.token },
            url: url
        })
            .then((response) => {
                console.log('ExpiryDate posting data', response);
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
                console.log('error in ExpiryDate ==>', error);
                this.setState({ spinnerBool: false });
                Utils.ShowMessage("Something went Wrong,Please Try again ");
            })
    }

    render() {
        const self = this;
        return (
            <View style={CustomStyles.viewStyle}>
                {this.spinnerLoad()}
                <View style={[CustomStyles.erpexpiryCategory, { flex: 1 }]}>
                    <View style={{ alignSelf: 'stretch' }}>
                        <FlatList
                            horizontal={true}
                            data={this.state.data}
                            renderItem={({ item }) => this.renderItem(item)}
                            keyExtractor={(item, index) => index}
                            extraData={this.state.data}
                            selected={this.state.categoryBgColor}
                        />
                    </View>
                    <View style={{ alignSelf: 'stretch', flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={[CustomStyles.headText, { flex: 1 }]}>{this.state.label} Details</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity
                                        onPress={() => { this.ShowModalFunction(!this.state.showMail) }}
                                    >
                                        <Image style={{ width: 24, height: 24, margin: 5, resizeMode: 'contain' }}
                                            source={require('../images/erp_mail.png')} />
                                    </TouchableOpacity>
                                </View>
                                {/* <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Image style={{ width: 24, height: 24,margin:5, resizeMode: 'contain' }} 
                                    source={require('../images/erp_download.png')} />
                            </View> */}
                            </View>
                        </View>
                        <View style={CustomStyles.erpCategoryHeaderItems}>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>S.No</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>V.No</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Expiry Date</Text>
                            </View>
                        </View>
                        <View style={{ alignSelf: 'stretch', flex: 1 }}>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.trucks}
                                renderItem={({ item }) =>
                                    <View style={CustomStyles.erpCategoryItems}>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={[CustomStyles.erpText, { fontWeight: 'bold' }]}>{this.state.trucks.indexOf(item) + 1}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpText}>{item.registrationNo}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            {this.getParsedDate(item)}
                                        </View>
                                    </View>
                                }
                                keyExtractor={(item, index) => index} />
                        </View>
                    </View>
                </View>
                <MailBox visible={this.state.showMail} Submit={'Submit'} cancel={'cancel'}
                    onAccept={() => { this.sendMail() }}
                    onDecline={() => { this.ShowModalFunction(!this.state.showMail) }}
                    onchange={(mail) => { this.setState({ mail: mail }) }} />
            </View>
        );
    }


}
