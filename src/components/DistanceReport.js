//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import {
    View, ScrollView, Animated, DatePickerAndroid, StyleSheet, Platform, TouchableHighlight, DatePickerIOS,
    BackHandler, Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity
} from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, TrackModal, CustomText, CSpinner, CustomEditText, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import MapView, { Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Utils from '../components/common/Utils';
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const screen = Dimensions.get('window')

const ASPECT_RATIO = screen.width / screen.height

const LATITUDE_DELTA = 12
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class DistanceReport extends Component {
    state = {
        defaultDate: new Date(),
        _mapView: MapView,
        showModal: false, date: '',
        categoryBgColor: false, token: '', truckMakers: [], coordinates: [], coordinates1: [],
        showDependable: '0',
        showTrack: false,
        truckNum: '',
        fromDate: '',
        fromPassdate: '',
        toDate: '',
        toPassdate: '',
        spinnerBool: false,
        records: [{ _id: 1, trucknum: 'TS36AA5432', localArea: 'madhapur', City: 'Hyderabad', dist: '542.00KMS' },
        { _id: 2, trucknum: '0D96AA1532', localArea: 'madhapur', City: 'Ordisha', dist: '632.00KMS' },
        { _id: 3, trucknum: 'AP52AA9532', localArea: 'Vishka', City: 'Vijayawad', dist: '258.00KMS' },
        { _id: 4, trucknum: 'CH87AA6332', localArea: 'Otty', City: 'Hyderabad', dist: '784.00KMS' }]
    };

    componentWillMount() {
        console.log('this.props distanceReport', this.props.nav)
        const self = this;
        console.log(self.props, "distanceReport=token");
        // this.getCredentailsData();
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
    }

    async getCredentailsData() {
        const self = this;
        self.setState({ spinnerBool: true });

        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token });
                let currDate = new Date();
                this.fetchDistanceReports(currDate.toDateString(), currDate.toDateString());
            } else {
                this.setState({ spinnerBool: false });

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

    fetchDistanceReports(fromdate, todate) {
        console.log(fromdate + '-fromdate', todate + '-todate');
        Axios({
            method: 'GET',
            headers: { 'token': this.state.token },
            url: Config.routes.base + Config.routes.getTruckReport,

        })
            .then((response) => {
                if (response.data.status) {
                    console.log('Dist Reports ==>', response.data);
                    if (response.data.results.length > 0) {


                    } else {

                        let message = '';
                        if (response.data)
                            response.data.messages.forEach(function (current_value) {
                                message = message + current_value;
                            });
                        Utils.ShowMessage(message);
                    }

                    this.setState({ spinnerBool: false })

                } else {
                    console.log('error in Dist Reports ==>', response);
                    this.setState({ spinnerBool: false });
                }
            }).catch((error) => {
                console.log('error in Dist Reports ==>', error);
                this.setState({ spinnerBool: false });

            })
    }



    getParsedDate(date) {
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getFullYear().toString();
    }

    getParsedtime(date) {
        var formattedDate = new Date(date);
        return formattedDate.getHours() + ':' + formattedDate.getMinutes();
    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: 'transparent',
                height: 1,
            }}
        />
    );



    gettimeTravelled(time) {
        var timeStr = time.toString();
        var travelTime = time;
        if (timeStr.length > 0) {
            if (timeStr.length > 6) {
                return timeStr.substr(0, 5);
            } else {
                return timeStr;
            }
        } else {
            travelTime = '';
        }
        return travelTime;
    }


    returToScreen(viewName) {
        const { navigation } = this.props;
        const { state } = navigation;
        let refreshFunc = state.params.refresh;
        if (typeof refreshFunc === 'function') {
            refreshFunc({ view: viewName });
        }
        this.props.navigation.goBack();
    }


    onPickdate(category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal, category: category })
        } else {
            try {
                const { action, year, month, day } = DatePickerAndroid.open({

                    //minDate: str == 'min'? new Date() :new Date('1-1-2007'),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        switch (category) {
                            case "fromDate":
                                this.setState({ fromDate: date, fromPassdate: month + "/" + response.day + "/" + response.year });
                                return;
                                break;
                            case "toDate":
                                this.setState({ toDate: date, toPassdate: month + "/" + response.day + "/" + response.year });
                                return;
                                break;
                            default:
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

        this.setState({ showModal: false })

    }

    onDecline() {
        this.setState({ showModal: false, date: '' });

    }
    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    render() {
        const self = this;
        const { region } = this.props;
        const { width, height } = Dimensions.get('window');
        return (
            <View style={[CustomStyles.viewStyle, { backgroundColor: '#f8f8f8' }]}>
                <View style={[{
                    alignSelf: 'stretch', flexDirection: 'row', paddingTop: 0,
                    justifyContent: 'space-between',
                    backgroundColor: '#1e4495', width: '100%'
                }, { display: 'flex' }]}>
                    <View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-start', margin: 5 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
                            <Image style={{ width: 25, height: 20, resizeMode: 'contain', marginTop: 20, margin: 10, marginHorizontal: 5 }}
                                source={require('../images/back_icon.png')} />
                        </TouchableOpacity>
                        <Text style={[CustomStyles.erpText, { color: 'white', fontFamily: 'Gotham-Light', fontSize: 16, marginTop: 20, margin: 10, marginLeft: 3 }]}>
                            Distance Report</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', margin: 5 }}>
                        <TouchableOpacity onPress={() => { this.returToScreen('listshow') }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/gps_dist_rports_icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.returToScreen('mapShow')
                        }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/gps_map_lap_icon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    alignSelf: 'stretch', flexDirection: 'column', paddingTop: 5, justifyContent: 'space-between',
                    backgroundColor: '#ffffff', width: '100%', paddingHorizontal: 10, paddingTop: 10
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => { this.onPickdate('fromDate') }}
                            >
                                <View style={{
                                    backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                    borderWidth: 0,
                                    borderBottomWidth: 0,
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
                                                value={this.state.fromDate} />
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
                                onPress={() => { this.onPickdate('toDate') }}
                            >
                                <View style={{
                                    backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5,
                                    borderWidth: 0,
                                    borderBottomWidth: 0,
                                    borderBottomColor: 'black'
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Select Date'}
                                                inputContainerStyle={{ justifyContent: 'flex-end', height: 30 }}
                                                inputTextStyle={{ fontSize: 11, justifyContent: 'flex-end', marginHorizontal: 16, lineHeight: 5 }}
                                                value={this.state.toDate} />
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
                                onPress={() => { alert('coming soon'); }}
                            >
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: 60, height: 45, backgroundColor: "#e83b13" }}>
                                    <Text style={{ color: '#fff', padding: 5, alignSelf: 'center' }}>
                                        Go
                                                </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flex: 1, alignSelf: 'stretch', flexDirection: 'column', paddingTop: 5, justifyContent: 'space-between',
                            backgroundColor: '#f8f8f8', width: '100%', paddingHorizontal: 10, paddingTop: 10,
                            height: 50
                        }}>
                        </View>
                    </View>


                    {console.log(this.state.records)}
                    <FlatList style={{ backgroundColor: '#ffffff', flex: 1 }}
                        data={this.state.records}
                        ItemSeparatorComponent={this.renderSeparator}
                        removeClippedSubviews={true}
                        renderItem={({ item }) => {
                            { console.log(item) }
                            return (

                                <View style={[CustomStyles.erpCategoryItems, { backgroundColor: '#ffffff' }]}>
                                    <View style={CustomStyles.erpDriverItems}>

                                        <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                                                    <Text numberOfLines={1} style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 12, }]}>
                                                        {item.trucknum}</Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                                                    <Text numberOfLines={1} style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 12, }]}>
                                                        {item.localArea} </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                                                    <Text numberOfLines={3} style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 12, }]}>
                                                        {item.City} </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                                                    <Text numberOfLines={1} style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 12, }]}>
                                                        {item.dist} </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>)
                        }
                        }

                        keyExtractor={item => item._id} />

                </View>
                {this.spinnerLoad()}
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
                                if (this.state.category === 'fromDate') {
                                    this.setState({ fromDate: date, fromPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ toDate: date, toPassDate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>
            </View>

        );
    }

}



