//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView, BackHandler, ListView, FlatList, Platform, Text, AsyncStorage, Image, TouchableOpacity, NetInfo } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, CustomText, CustomEditText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Utils from './common/Utils';
import { NoInternetModal } from './common';

export default class TruckList extends Component {
    state = {
        categoryBgColor: false, token: '', trucks: [], dummyTrucks: [], truckNumber: '', netFlaf: false,
    };

    componentWillMount() {
        const self = this;
        console.log(self.props, "token");
        this.connectionInfo();
    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.getCredentailsData();
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.getCredentailsData();
                } else {
                    return this.setState({ netFlaf: true });
                }
            });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
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
                    url: Config.routes.base + Config.routes.trucksList
                })
                    .then((response) => {
                        if (response.data.status) {
                            console.log('trucksList ==>', response.data);
                            this.setState({ trucks: response.data.trucks, dummyTrucks: response.data.trucks })
                        } else {
                            console.log('no in trucksList ==>', response);
                            this.setState({ trucks: [] });
                        }
                    }).catch((error) => {
                        console.log('error in trucksList ==>', error);
                    })
            } else {
                this.setState({ loading: false })
            }
        }
        );
    }
    async getCache(callback) {
        try {
            var value = await AsyncStorage.getItem('credientails');
            console.log('credientails', value);
            if (value !== null) {
                console.log('riyaz', value);
            } else {
                console.log('value', value);
            }
            callback(value);
        }
        catch (e) {
            console.log('caught error', e);
            // Handle exceptions
        }
    }

    getcolorDate(item, dateType, typeLabel) {
        var formattedDate = new Date(item);
        //console.log(this.functiona(formattedDate),"difference b/w");
        if (this.functiona(formattedDate) > 15) {
            return (
                <Image resizeMode="contain"
                    source={require('../images/green.png')}
                    style={{ width: 10, height: 10, marginTop: 5 }} />
            );
        } else if (this.functiona(formattedDate) > 2 && this.functiona(formattedDate) <= 15) {
            return (
                <Image resizeMode="contain"
                    source={require('../images/orange.png')}
                    style={{ width: 10, height: 10, marginTop: 5 }} />
            );
        } else {
            return (
                <Image resizeMode="contain"
                    source={require('../images/red.png')}
                    style={{ width: 10, height: 10, marginTop: 5 }} />
            );
        }
    }

    getParsedDate(date) {
        var formattedDate = new Date(date);
        return formattedDate.getDate().toString() + "/" + (formattedDate.getMonth()+ 1) + "/" + formattedDate.getFullYear().toString();
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

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#d6d6d6',
                height: 0,
            }}
        />
    );
    gettruckType(item) {
        var data = '- T';
        if (item.hasOwnProperty("truckType")) {
            data = item.truckType  ;
        } else {
            data = '- ';
        }
        return data;
    }
    getName(item) {
        var data = 'Name not available';
        if (item.hasOwnProperty("attrs")) {
            if (item.attrs.hasOwnProperty("fullName")) {
                data = item.attrs.fullName;
            } else {
                return data;
            }
        } else {
            data = 'Name not available';
        }
        return data;
    }

    getmobile(item) {
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            if (item.attrs.hasOwnProperty("mobile")) {
                data = '+91 ' + item.attrs.mobile;
            } else {
                return data;
            }

        } else {
            data = '-';
        }
        return data;
    }

    callSubCategoryScreen(item) {
        if (this.getmobile(item).length > 1) {
            RNImmediatePhoneCall.immediatePhoneCall('' + item.attrs.mobile);
        } else {
            Utils.ShowMessage('Mobile Number is Invalid');
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log('nextProps====', nextProps);
    }

    refreshFunction = (nextProps) => {
        if (nextProps.refresh) {
            console.log('hurra=refresh', nextProps.refresh);
            this.getCredentailsData();
        }
    }

    showResult() {
        if (this.state.trucks.length == 0)
            return 'No Trucks Found';
    }

    FilterList(truck) {
        const GetJsonArr = this.state.dummyTrucks;
        let text = truck.toLowerCase();
        this.setState({ truckNumber: truck });
        if (text.length != 0) {
            let catgryarr = [];
            catgryarr = GetJsonArr.filter((item) => {
                if (item.registrationNo.toLowerCase().match(text)) {
                    return item;
                }
            });
            if (catgryarr.length > 0) {
                this.setState({ trucks: catgryarr })
            } else {
                this.setState({ trucks: [] });
            }
        } else {
            this.setState({ trucks: this.state.dummyTrucks });
        }
    }


    editTruckDetails(token, _id) {
        //this.props.navigation.navigate('AddTruck', { token: this.state.token, id: item._id, edit: true, refresh: this.refreshFunction }) 
        this.connectNetInfo(token, _id);
        
    }

    async connectNetInfo(token, _id) {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) {
                this.setState({ netFlaf: false });
                this.props.navigation.navigate('AddTruck', { token: token, id: _id, edit: true, refresh: this.refreshFunction })
            }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) {
                    this.setState({ netFlaf: false });
                    this.props.navigation.navigate('AddTruck', { token: token, id: _id, edit: true, refresh: this.refreshFunction })
                } else {
                    return this.setState({ netFlaf: true });
                }
            });
        }
    }

    render() {
        const self = this;
        return (

            <View style={CustomStyles.viewStyle}>
                <View style={CustomStyles.erpCategory}>

                    <View style={{
                        alignSelf: 'stretch', shadowColor: '#ddd'
                    }}>
                        <CustomEditText underlineColorAndroid='transparent'
                            placeholder={'Enter Truck Number'}
                            value={this.state.truckNumber}
                            inputTextStyle={{ alignSelf: 'stretch', marginHorizontal: 16, borderBottomWidth: 1, borderColor: '#727272' }}
                            onChangeText={(truckNumber) => { this.FilterList(truckNumber) }}
                        />
                    </View>
                    <View style={[{ display: self.state.trucks.length === 0 ? 'flex' : 'none' }, CustomStyles.noResultView]}>
                        <Text style={[CustomStyles.erpText, {
                            color: '#1e4495', fontWeight: 'bold',
                            textDecorationLine: 'underline', alignSelf: 'stretch', alignItems: 'center',
                        }]}>
                            {self.state.trucks.length == 0 ? 'No Trucks Found' : ''}</Text>
                    </View>
                    <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                        data={this.state.trucks}
                        extraData={this.state.trucks}
                        ItemSeparatorComponent={this.renderSeparator}
                        renderItem={({ item }) =>
                            <View style={[CustomStyles.erpCategoryCardItems]}>
                                <View style={CustomStyles.erpDriverItems}>
                                    <View style={[CustomStyles.erpTextView, {
                                        flex: 0.6, borderBottomWidth: 0,
                                        alignItems: 'flex-start'
                                    }]}>
                                        <Image resizeMode="contain"
                                            source={require('../images/truck_icon.png')}
                                            style={CustomStyles.imageWithoutradiusViewContainer} />
                                        <Text style={[CustomStyles.erpText, {
                                            color: '#1e4495', fontWeight: 'bold', textDecorationLine: 'underline'
                                        }]}>
                                            {item.registrationNo}</Text>
                                        <Text style={[CustomStyles.erpText, { color: '#1e4495', fontWeight: 'bold', }]}>
                                            {this.gettruckType(item)}  {item.modelAndYear}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                        <View style={{ flexDirection: 'row', padding: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>

                                                <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 12, }]}>
                                                    {this.getName(item)}
                                                </Text>
                                                {/* <Text style={CustomStyles.erpText}>
                                                    {this.getmobile(item)}
                                                </Text> */}
                                            </View>
                                            <View style={[CustomStyles.erpTextView, { flex: 0.2, alignItems: 'flex-end', borderBottomWidth: 0, paddingBottom: 5 }]}>
                                                <TouchableOpacity onPress={() => { this.editTruckDetails(this.state.token, item._id) }
                                                }>
                                                    <Image resizeMode="contain"
                                                        source={require('../images/form_edit.png')}
                                                        style={CustomStyles.drivervEditIcons} />
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity onPress={() => { this.callSubCategoryScreen(item) }
                                                }>
                                                    <Image resizeMode="contain"
                                                        source={require('../images/call_user.png')}
                                                        style={CustomStyles.drivervCallIcons} />
                                                </TouchableOpacity> */}
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
                                            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5 }}>
                                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingLeft: 5 }}>
                                                    {this.getcolorDate(item.permitExpiry)}
                                                    <Text style={[CustomStyles.erpText, { paddingLeft: 2, paddingBottom: 2, fontFamily: 'Gotham-Medium', fontSize: 10, }]}>
                                                        Permit
                                                                </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingLeft: 5 }}>
                                                    {this.getcolorDate(item.pollutionExpiry)}
                                                    <Text style={[CustomStyles.erpText, { paddingLeft: 2, paddingBottom: 2, fontFamily: 'Gotham-Medium', fontSize: 10, }]}>
                                                        Pollution
                                                                </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingLeft: 5 }}>
                                                    {this.getcolorDate(item.insuranceExpiry)}
                                                    <Text style={[CustomStyles.erpText, { paddingLeft: 2, paddingBottom: 2, fontFamily: 'Gotham-Medium', fontSize: 10, }]}>
                                                        Insurance
                                                                </Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5 }}>
                                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingLeft: 5 }}>
                                                    {this.getcolorDate(item.fitnessExpiry)}
                                                    <Text style={[CustomStyles.erpText, { paddingLeft: 2, paddingBottom: 2, fontFamily: 'Gotham-Medium', fontSize: 10, }]}>
                                                        Fitness
                                                            </Text>
                                                </View>
                                                <View style={{ flex: 2, flexDirection: 'row', paddingTop: 5, paddingLeft: 5 }}>
                                                    {this.getcolorDate(item.taxDueDate)}
                                                    <Text style={[CustomStyles.erpText, { paddingLeft: 2, paddingBottom: 2, fontFamily: 'Gotham-Medium', fontSize: 10, }]}>
                                                        Tax
                                                            </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            //</TouchableOpacity>
                        }
                        keyExtractor={item => item._id} />



                </View>
                <View style={CustomStyles.addGroupImageStyle}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('AddTruck', { token: this.state.token, edit: false, refresh: this.refreshFunction }) }}
                    >
                        <Image source={require('../images/eg_truck.png')}
                            style={CustomStyles.addImage} />
                    </TouchableOpacity>
                </View>
                <NoInternetModal visible={this.state.netFlaf}
                    onAccept={() => { this.setState({ netFlaf: false }) }} />
            </View>

        );
    }

}

