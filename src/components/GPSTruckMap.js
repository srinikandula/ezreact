//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import {
    View, ScrollView, Animated, DatePickerAndroid,TimePickerAndroid, StyleSheet, Platform, TouchableHighlight, DatePickerIOS,
    BackHandler, Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity, NetInfo
} from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, TrackModal, CustomText, CSpinner, CustomEditText, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import Utils from './common/Utils';
import MapView, { Marker, Callout } from 'react-native-maps';
import { NoInternetModal } from './common';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 10
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class GPSTruckMap extends Component {
    state = {
        defaultDate: new Date(),
        truckTypeIs: '',
        registrationNumber: '',
        lookLoadIcon: false,
        dispLookLoad: 'none',
        lookLoadSource: '',
        dispDatePicker: 'none',
        showModal: false, date: '',
        categoryBgColor: false, token: '', trucks: [], dummytrucks: [],
        showTrack: false,
        showHeader: 'none',
        truckNumber: '',
        fromDate: '',
        fromPassdate: '',
        toDate: '',
        toPassdate: '',
        passData: {},
        aspectRatio: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        latitude: Number(17.46247),
        longitude: Number(78.3100319),
        animation: new Animated.Value(0),
        markers: [{
            coordinate: {
                latitude: 0,
                longitude: 0
            }
        }],
        forDate: '',
        forPassdate: '',
        view: 'mapShow',
        netFlaf: false,
        spinnerBool: false,
        fromtime:'',
        totime:''
    };

    componentWillMount() {
        const self = this;
        console.log('this.props gpstractlocation', self.props);
        let currDate = new Date();
        currDate.setMinutes(0);
        currDate.setHours(0);
        currDate.setSeconds(0);
        let showHeaderBool = self.props.showHeader;
        if (self.props.showHeader === undefined || self.props.showHeader === 'undefined') {
            showHeaderBool = self.props.navigation.state.params.showHeader;
            console.log(self.props.navigation.state.params.showHeader, "GPSTruckMap-token");
        }
        console.log(self.props.showHeader, "GPSTruckMap-token"+currDate.toLocaleDateString() +"  "+currDate.toLocaleTimeString());
        this.setState({ showHeader: showHeaderBool ? 'flex' : 'none', 
                        fromDate: currDate.toDateString()+"  "+currDate.toLocaleTimeString(),
                        toDate: currDate.toDateString()+"  "+currDate.toLocaleTimeString(),
                        fromPassdate: currDate.toDateString()+" "+currDate.toLocaleTimeString(),
                        toPassdate: currDate.toDateString()+"  "+currDate.toLocaleTimeString() });
        this.connectionInfo();



        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: Number(position.coords.latitude),
                    longitude: Number(position.coords.longitude),
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );


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


    async getCredentailsData() {
        this.setState({ spinnerBool: true });
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token });

                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.gpsTrackingByMapView
                })
                    .then((response) => {
                        if (response.data.status) {
                            console.log('GPSTruckMap-trucksList ==>', response.data);
                            if (response.data.data.length == 0) {
                                this.setState({ spinnerBool: false, view: 'no' });
                            } else {
                                this.setState({ spinnerBool: false });
                                var catgryarr = response.data.data;
                                catgryarr = catgryarr.filter(function (item, index) {
                                    if (item.hasOwnProperty('attrs'))
                                        return item;
                                });

                                this.setState({ trucks: catgryarr });

                                var dump = [];
                                for (let index = 0; index < catgryarr.length; index++) {
                                    const element = catgryarr[index];
                                    element.rememberme = false;
                                    //console.log(this.state.location[index], 'element.location');
                                    dump.push(element);
                                    this.setState({ trucks: dump, dummytrucks: dump });
                                }
                                
                                var catgryarr1 = [];
                                for (let index = 0; index < catgryarr.length; index++) {//catgryarr.length
                                    const truckElement = this.state.trucks[index];
                                    if (catgryarr[index].attrs.hasOwnProperty('latestLocation')) {
                                        if (!catgryarr[index].attrs.latestLocation.hasOwnProperty('location')) {
                                            
                                        }else{
                                            const element = catgryarr[index].attrs.latestLocation.location.coordinates;
                                            //console.log(element,'attrs.latestLocation.location.coordinates',element[0],element[1]);
                                            //latitude:0,longitude:0
                                            var obj = {
                                                coordinate: { latitude: Number(element[1]), longitude: Number(element[0]), image: 'https://i.imgur.com/sNam9iJ.jpg' },
                                                registrationNo: catgryarr[index].registrationNo,
                                                speed: catgryarr[index].attrs.latestLocation.speed,
                                                address: catgryarr[index].attrs.latestLocation.address,
                                                odemeter:catgryarr[index].attrs.latestLocation.totalDistance,
                                                date: catgryarr[index].attrs.latestLocation.updatedAt,
                                                isStopped: catgryarr[index].attrs.latestLocation.isStopped,
                                                isIdle: catgryarr[index].attrs.latestLocation.isIdle
                                            };
                                            catgryarr1.push(obj);
                                            //truckElement.updatedAt = catgryarr[index].attrs.latestLocation.updatedAt;
                                            truckElement.speed = catgryarr[index].attrs.latestLocation.speed;
											truckElement.updatedAt = catgryarr[index].attrs.latestLocation.updatedAt;
                                            this.setState({ latitude: element[1], longitude: element[0] });
                                            this.setState({ markers: catgryarr1 }, () => { console.log(this.state.markers, 'markers'); });
                                        }
                                    }
                                    this.state.trucks[index] = truckElement;

                                }
                                this.setState({ spinnerBool: false, trucks: this.state.trucks });

                            }
                        }
                        else {
                            console.log('error in trucksList ==>', response);
                            this.setState({ erpDashBroadData: [], expirydetails: [], spinnerBool: false });
                        }
                        this.setState({ spinnerBool: false });


                    }).catch((error) => {
                        console.log('error in trucksList ==>', error);
                        //504
                        if (error.response.status === 504 || error.response.status === 401 || error.response.status === 502) {
                            Utils.ShowMessage('Something went wrong. Please try later');
                        }
                        this.setState({ spinnerBool: false })

                    })
            } else {
                this.setState({ spinnerBool: false })
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



    getParsedDate(date) {
        if (date) {
            var formattedDate = new Date(date);
            if (this.state.view === 'mapShow') {
                return formattedDate.getDate().toString() + "/" + (formattedDate.getMonth() + 1).toString() + "/" + formattedDate.getFullYear().toString() + " " + formattedDate.getHours() + ' : ' + formattedDate.getMinutes();
            } else if (this.state.view === 'listShow') {
                return formattedDate.getDate().toString() + "/" + (formattedDate.getMonth() + 1).toString() + "/" + formattedDate.getFullYear().toString();
            }else {
                return formattedDate.getDate().toString() + "/" + (formattedDate.getMonth() + 1).toString() + "/" + formattedDate.getFullYear().toString() + " \n " + formattedDate.getHours() + ' : ' + formattedDate.getMinutes();
            }

        } else {
            return '-';
        }

    }
    lisDateFilter(date) {
        if (date) {
            var formattedDate = new Date(date);          
                var hours = ""+(formattedDate.getHours());
                hours = hours.trim().length == 1 ? '0'+hours: hours;
                var mins = ""+formattedDate.getMinutes().toString();
                mins = mins.trim().length == 1 ? '0'+mins:mins;

                return formattedDate.getFullYear().toString()+ "/" + (formattedDate.getMonth() + 1).toString() + "/" + formattedDate.getDate().toString()  +
                 "  "+ hours+ ":"+ mins;
            

        } else {
            return '-';
        }

    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#d6d6d6',
                height: 1,
            }}
        />
    );

    getName(item) {
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            data = item.attrs.fullName;
        } else {
            data = '-';
        }
        return data;
    }

    getmobile(item) {
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            data = item.attrs.mobile;
        } else {
            data = '-';
        }
        return data;
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps====', nextProps);
    }

    coordinate() {
        //markers
        return this.state.markers.map((item, index) => {
            <Marker
                key={index}
                coordinate={{
                    latitude: item.coordinate.latitude,
                    longitude: item.coordinate.longitude
                }}
            />
        });
    }
    lookingForLoad(items, val) {
        if (!val) {
            this.setState({ registrationNumber: items.registrationNo, truckTypeIs: items.truckType, showModal: true, dispLookLoad: 'flex' });
            console.log('val', val)
            console.log('items', items)
            var temparr = [];
            for (let index = 0; index < this.state.trucks.length; index++) {
                const element = this.state.trucks[index];
                if (items._id == element._id) {
                    if (element.lookingForLoad) {
                        element.lookingForLoad = false;
                    } else {
                        element.lookingForLoad = true;
                    }
                    this.state.trucks[index] = element;
                    this.setState({ trucks: this.state.trucks });
                    break;
                }
            }
        } else {
            for (let index = 0; index < this.state.trucks.length; index++) {
                const element = this.state.trucks[index];
                console.log(element, 'element');
                if (items._id == element._id) {
                    if (element.lookingForLoad) {
                        element.lookingForLoad = false;
                    } else {
                        element.lookingForLoad = true;
                    }
                    this.state.trucks[index] = element;
                    this.setState({ trucks: this.state.trucks });
                    console.log(element.registrationNo, 'element-registrationNo');
                    this.unCheckLookingForLoad(element.registrationNo);

                    break;
                }
            }
        }

    }
    markerClick(markerData) {
        let currDate = new Date();
        currDate.setMinutes(0);
        currDate.setHours(0);
        currDate.setSeconds(0);

        this.setState({ fromPassdate: this.lisDateFilter(new Date(currDate)), toPassdate: this.lisDateFilter(new Date()) })
        console.log(markerData, 'markerData');
        let date = new Date();
        var passdateStr = date.toLocaleDateString() + "  "+ date.getHours()+1 +": " + date.getMinutes();
        const data = {
            truckId: markerData.registrationNo, startDate: passdateStr,
            endDate: passdateStr
        }
        this.setState({ passData: data });
        this.ShowModalFunction(!this.state.showTrack);
    }

    getDateISo(dateString) {
        var date = new Date(dateString);
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() ;
        console.log('passdateStr', passdateStr);
        var passdate = new Date(passdateStr);
        return passdate.toISOString();
    }
    ShowModalFunction(visible) {
        this.setState({ showTrack: visible });
    }

    getSpeed(item) {
        //speed
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            if (item.attrs.hasOwnProperty('latestLocation')) {
                var strSpeed='0';
                if (item.attrs.latestLocation.hasOwnProperty('speed')) {
                    strSpeed = item.attrs.latestLocation.speed;
                }
                data = Math.round(Number(strSpeed) * 100) / 100;
            } else {
                data = '-'
            }
        } else {
            data = '-';
        }
        return data;
    }
 getOdometer(item){
    //totalDistance
    var data = '-';
        if (item.hasOwnProperty("attrs")) {
            if (item.attrs.hasOwnProperty('latestLocation')) {
                var address = '';
                if (item.attrs.latestLocation.hasOwnProperty('totalDistance')) {
                    totalDistance = item.attrs.latestLocation.totalDistance;
                }
                data = totalDistance;
            } else {
                data = '-'
            }
        } else {
            data = '-';
        }
        return data;
 }
    getAddress(item) {
        var data = '-';
        if (item.hasOwnProperty("attrs")) {
            if (item.attrs.hasOwnProperty('latestLocation')) {
                var address = '';
                if (item.attrs.latestLocation.hasOwnProperty('address')) {
                    address = item.attrs.latestLocation.address;
                }else{
					address = '-'
				}
                data = address;
            } else {
                data = '-'
            }
        } else {
            data = '-';
        }
        return data;
    }

    //this.getParsedDate(item.updatedAt)
    getupdateDate(item) {
       // console.log(item.updatedAt, 'updatedAt');
        var data = 'Date : \n' + '';
        if (item.hasOwnProperty("updatedAt")) {
            data = 'Date : \n' + this.getParsedDate(item.updatedAt);
        } else {
            data = 'Date : \n' + '';
        }
        return data;
    }

    renderlookLoadIcon(value) {
        if (this.state.lookLoadIcon)
            return require('../images/ic_trip.png')
        else {
            return require('../images/unchecked.png')
        }
    }

    getShortAddress(address) {
        let addr = '';
        // addr=address.length
        console.log(typeof (address));
        /* if (addr.length > 30) {
            addr = address.substring(0, 30) + "..."
        }
        return addr; */
    }
    truckStatus(marker) {
        //console.log(marker,'truckStatus')
        if (marker.attrs.hasOwnProperty('latestLocation')) {
            if (marker.attrs.latestLocation.isStopped ) {
                return require('../images/redTruck.png');
            } else if(marker.attrs.latestLocation.isIdle){                
                return require('../images/truck_idle.png');
            }else {
                return require('../images/greenTruck.png');
            }
        } else {
            return require('../images/greenTruck.png');
        }


    }

    getView() {
        switch (this.state.view) {
            case 'mapShow':
                return (
                    <View style={CustomStyles.mapcontainer}>
                        <MapView
                            style={CustomStyles.map}
                            zoomEnabled={true}
                            initialRegion={{
                                latitude: Number(this.state.latitude),
                                longitude: Number(this.state.longitude),
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,

                            }}
                        >
                            {this.state.markers.map((marker, index) => {
                                var imgsrc = require('../images/truck_running.png');
                                if (marker.isStopped) {
                                    imgsrc = require('../images/truck_stopped.png');
                                }
                                if (!marker.isIdle && !marker.isStopped) {
                                    imgsrc = require('../images/truck_running.png');
                                }

                                return (
                                    <Marker key={index}
                                        image={imgsrc}
                                        coordinate={marker.coordinate}
                                    >
                                    
                                        <Text style={{fontSize:12,marginTop:10,marginRight:10, color:'#000000'}}>{marker.registrationNo}</Text>
                                   
                                        <MapView.Callout style={[CustomStyles.mapcard,{width:170}]}
                                            onPress={() => { this.markerClick(marker) }}>
                                            <View style={CustomStyles.mapContent}>
                                                <Text>{'Reg.No :'}{marker.registrationNo}</Text>
                                                <Text>{'Speed :'}{Math.round(marker.speed)}'km/hr'</Text>
                                                <Text>{'Odoemeter :'}{Math.round(marker.odemeter)} 'km'</Text>
                                                <Text>{'Date :'}{this.getParsedDate(marker.date)}</Text>
                                                <Text>{'Address :'}{marker.address}</Text>

                                            </View>
                                            <TouchableHighlight style={{ alignSelf: 'stretch' }}
                                                underlayColor='#dddddd'>
                                                <View style={{ maxWidth: 200, alignItems: 'center', margin: 5, padding: 2, borderBottomWidth: 0, }}>
                                                    <Text style={{ color: '#1e4495' }}>{'Track'}</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </MapView.Callout>
                                    </Marker>
                                );
                            })}
                        </MapView>
                    </View>
                );
                break;
            case 'listshow':
                return (
                    <View style={{
                        flex: 1, alignSelf: 'stretch', flexDirection: 'column',
                        // top: 50,
                        justifyContent: 'space-around'
                    }}>
                        <View style={{ alignSelf: 'stretch' }}>
                            <CustomEditText underlineColorAndroid='transparent'
                                placeholder={'Enter Truck Number'}
                                value={this.state.truckNumber}
                                inputTextStyle={{ alignSelf: 'stretch', marginHorizontal: 16, borderBottomWidth: 1, borderColor: '#727272' }}
                                onChangeText={(truckNumber) => { this.FilterList(truckNumber) }}
                            />
                        </View>

                        <FlatList style={{ alignSelf: 'stretch', flex: 1, display: 'flex' }}
                            data={this.state.trucks}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
                                <View style={[CustomStyles.erpCategoryCardItems, { flexDirection: 'column' }]}>
                                    <View style={CustomStyles.erpDriverItems}>

                                        <View style={[CustomStyles.erpTextView, { flex: 0.4, borderBottomWidth: 0 }]}>
                                            <TouchableOpacity onPress={() => { this.markerClick(item) }}>
                                                <View>
                                                    <Image resizeMode="contain"
                                                        source={this.truckStatus(item)}
                                                        style={{ width: 50, height: 50 }}
                                                    // style={[{width:'100%'},CustomStyles.imageWithoutradiusViewContainer]}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                                            <Text style={[CustomStyles.erpText, { color: '#1e4495', fontWeight: 'bold' }]}>
                                                {item.registrationNo}</Text>
                                            <Text numberOfLines={3} style={[CustomStyles.erpText, { color: '#1e4495', fontSize: 14, }]}>
                                                Location :{this.getAddress(item)}</Text>
                                            <Text style={[CustomStyles.erpText, { color: '#1e4495', fontSize: 10 }]}>
                                            Odoemeter :{Math.floor(Number(this.getOdometer(item)))} Km</Text>

                                        </View>
                                    </View>
                                    <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', padding: 2, alignItems: 'center' }}>
                                        <Text style={[CustomStyles.erpText, { textAlign: 'center', color: '#1e4495', fontWeight: 'bold', fontSize: 12 }]}>
                                            {this.getupdateDate(item)}</Text>
                                        <Text style={[CustomStyles.erpText, { textAlign: 'center', color: '#1e4495', fontWeight: 'bold', fontSize: 12 }]}>
                                            {'speed \n' + `${this.getSpeed(item)} kmph`}</Text>
                                        <CheckBox style={{ width: 10, height: 10, fontSize: 12 }}
                                            label='Looking For Load'
                                            color={'#000000'}
                                            checkboxStyle={{ width: 15, height: 15 }}
                                            //checkedImage={this.renderlookLoadIcon(item.lookingForLoad)}
                                            //uncheckedImage={require('../images/unchecked.png')}
                                            checked={item.lookingForLoad}
                                            onChange={(val) => this.lookingForLoad(item, val)}
                                        />

                                    </View>
                                </View>
                            }
                            keyExtractor={item => item._id}
                            extraData={this.state.trucks} />
                    </View>);
                break;


            case 'no':
                return (<Text style={[CustomStyles.erpText, { textAlign: 'center', color: '#1e4495', fontWeight: 'bold', fontSize: 12, top: 50 }]}>
                    No Data Found</Text>);
                break;
            default:
                break;
        }
    }

    FilterList(truck) {
        const GetJsonArr = this.state.dummytrucks;
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
            this.setState({ trucks: this.state.dummytrucks });
        }
    }

    onPickdate(category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: true, dispDatePicker: 'flex', showTrack: false, category: category })

        } else {
            try {
                const { action, year, month, day } = DatePickerAndroid.open({
                    date: new Date(),
                    //minDate: str == 'min'? new Date() :new Date('1-1-2007'),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                          console.log(response.month+1,'onPickdate-->',response.month);
                        let dates = response.day + "/" + month + "/" + response.year;
                        let day = response.day.toLocaleString().length == 1 ? "0"+response.day:""+response.day;
                        month = month.toLocaleString().length == 1 ? "0"+month:month;

                        let  dDate = new Date(this.state.fromPassdate); 
                        //dDate.setHours(response.hour); 
                        //dDate.setMinutes(response.minute);
                        console.log('dDate---',dDate.toDateString());
                        switch (category) {
                            case "fromDate":
                                this.setState({ fromDate: dDate.toDateString(), fromPassdate: response.year + "/" + day + "/" + month });
                                this.onPicktime(category);
                                return;
                                break;
                            case "toDate":
                                this.setState({ toDate: dDate.toDateString(), toPassdate: response.year + "/" + day + "/" + month });
                                this.onPicktime(category);
                                return;
                                break;
                            case "forDate":
                                this.setState({ forDate: dates, forPassdate: month + "/" + response.day + "/" + response.year });
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

    onPicktime(category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: true, dispDatePicker: 'flex', showTrack: false, category: category })

        } else {
            try {
                const { action, hour, minute } = TimePickerAndroid.open({
                    hour: 14,
                    minute: 0,
                    is24Hour: true, // Will display '2 PM'
                }).then((response) => {
                    if (response.action === "timeSetAction") {
                        let hour = response.hour.toLocaleString().length === 1 ? "0"+response.hour : ""+response.hour;
                        let mins = response.minute.toLocaleString().length === 1 ? "0"+ response.minute : ""+response.minute;
                        let time = hour +":"+ mins;    
                        let parseDate = this.state.fromPassdate.split('/');;
                        if(category ==='toDate'){
                            parseDate = this.state.toPassdate.split('/');;
                        }
                        //parseDate = parseDate[0] +"/"+parseDate[2]+"/"+parseDate[1];
                        let  dDate = new Date(parseDate[0],parseDate[2],parseDate[1],hour,mins); 
                        

                        console.log('onPicktime',dDate.toLocaleString());
                        console.log('ryz--time',time);
                        switch (category) {
                            case "fromDate":
                                this.setState({ fromDate: dDate.toLocaleDateString(), fromPassdate: dDate.getFullYear()  + "/" + (dDate.getMonth())+ "/" + dDate.getDate() +" "+time.trim() });
                                return;
                                break;
                            case "toDate":
                                this.setState({ toDate: dDate.toLocaleDateString(), toPassdate: dDate.getFullYear() + "/" + (dDate.getMonth()) + "/" + dDate.getDate()+" "+time.trim()});
                                return;
                                break;
                            case "forDate":
                                this.setState({ forDate: date, forPassdate: (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() +" "+time.trim() });
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



    async connectNetInfo() {
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
        if (this.state.dispDatePicker === 'flex') {
            if (this.state.fromDate === '' || this.state.toDate === '') {
                alert('Select a date');
            } else {
                this.setState({ dispDatePicker: 'none', showModal: false, showTrack: true })
            }
        } else if (this.state.dispLookLoad === 'flex') {
            if (this.state.lookLoadSource === '' || this.state.lookLoadDestination === '' || this.state.lookLoadPrice === '') {
                alert('All fields mandatory');
            } else if (!isNaN(this.state.lookLoadSource) || !isNaN(this.state.lookLoadDestination)) {
                alert('Number')
            } else if (this.state.lookLoadPrice === '') {
                alert('Please Set Price')
            } else if (this.state.forDate === '') {
                alert('Please Set Date')
            } else {
                var date = new Date(this.state.forPassdate);
                console.log(
                    'sourceAddress', this.state.lookLoadSource,
                    'destinationAddress', this.state.lookLoadDestination,
                    'truckType', this.state.truckTypeIs,
                    'registrationNo', this.state.registrationNumber,
                    'pricePerTon', Number(this.state.lookLoadPrice),
                    'dateAvailable', date,
                )
                Axios({
                    url: Config.routes.base + Config.routes.lookingForLoad,
                    method: 'POST',
                    headers: { 'token': this.state.token },
                    data: {
                        sourceAddress: this.state.lookLoadSource,
                        destinationAddress: this.state.lookLoadDestination,
                        truckType: this.state.truckTypeIs,
                        registrationNo: this.state.registrationNumber,
                        pricePerTon: Number(this.state.lookLoadPrice),
                        dateAvailable: date.toISOString()
                    }
                }).then((response) => {
                    console.log('response', response);
                    if (response.data.status) {

                        // alert('Update successfull')
                        this.setState({ lookLoadDestination: '', lookLoadPrice: '', lookLoadSource: '', lookLoadIcon: true, dispLookLoad: 'none', showModal: false })
                    } else {
                        alert(response.data.messages)
                    }
                }).catch((error) => {
                    console.log(error.response);
                })
            }
        }
    }

    onAccept() {
        this.connectNetInfo();
    }

    onDecline() {
        this.setState({ lookLoadDestination: '', lookLoadPrice: '', lookLoadSource: '', lookLoadIcon: false, dispLookLoad: 'none', dispDatePicker: 'none', showModal: false, date: '' });

    }

    unCheckLookingForLoad(registrationNumber) {
        console.log('unCheckLookingForLoad', registrationNumber);
        Axios({
            url: Config.routes.base + Config.routes.unCheckLookingForLoad,
            method: 'POST',
            headers: { 'token': this.state.token },
            data: {
                registrationNo: registrationNumber,
            }
        }).then((response) => {
            console.log('response', response);
            if (response.data.status) {

                alert('Update successfull')
                //this.setState({ lookLoadDestination: '', lookLoadPrice: '', lookLoadSource: '', lookLoadIcon: true, dispLookLoad: 'none', showModal: false })
            } else {
                alert(response.data.messages)
            }
        }).catch((error) => {
            console.log(error.response);
        })
    }

    /*const data = {truckId:markerData.registrationNo,,
    }
    this.setState({passData:data})*/
    moveToTrackScreen() {
        this.ShowModalFunction(!this.state.showTrack);
        const Data = this.state.passData
        Data.startDate = this.state.fromPassdate.replace('/','-');
        Data.startDate =  Data.startDate.replace('/','-');
        Data.endDate = this.state.toPassdate.replace('/','-');
        Data.endDate = Data.endDate.replace('/','-');
        console.log('asd', Data.toString());
        console.log('Data',Data.startDate+"--"+Data.startDate);
        if (this.props.showHeader === undefined || this.props.showHeader === 'undefined') {
            this.props.navigation.state.params.nav.navigation.navigate('GPSTrack', { token: this.state.token, sendingDate: JSON.stringify(Data) })
        } else {
            this.props.nav.navigation.navigate('GPSTrack', { token: this.state.token, sendingDate: JSON.stringify(Data) })
        }
    }

    refreshFunction = (nextProps) => {
        if (nextProps.view) {
            console.log('hurra=refresh', nextProps.view);
            this.setState({ view: nextProps.view });
        }
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
            <View style={CustomStyles.viewStyle}>
                <View style={[{
                    alignSelf: 'stretch', flexDirection: 'row', paddingTop: 5, position: 'absolute',
                    top: 0, justifyContent: 'space-between',
                    zIndex: 1, backgroundColor: '#1e4495', width: '100%'
                }, { display: self.state.showHeader }]}>
                    <View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-start', marginTop: 15 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/back_icon.png')} />
                        </TouchableOpacity>
                        <Text style={[CustomStyles.erpText, { color: 'white', fontFamily: 'Gotham-Light', fontSize: 16, margin: 10, marginLeft: 3 }]}>
                            {`All Vehicles Location`.toUpperCase()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 10, margin: 5 }}>
                        <TouchableOpacity onPress={() => { this.setState({ view: 'mapShow' }); }}>
                            <Image style={{
                                width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5,
                                opacity: this.state.view === 'mapShow' ? 0.2 : 1
                            }}
                                source={require('../images/gps_map_lap_icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({ view: 'listshow' });
                        }}>
                            <Image style={{
                                width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5,
                                opacity: this.state.view === 'listshow' ? 0.2 : 1
                            }}
                                source={require('../images/gps_truck_list_icon.png')} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('GPSDistReport',{refresh: this.refreshFunction}) }}>
                                        <Image style={{ width: 26, height: 25, resizeMode: 'contain',margin:10,marginHorizontal:5 }}
                                        source={require('../images/gps_truck_reports.png')} />
                                    </TouchableOpacity> */}
                    </View>
                </View>
                <View style={CustomStyles.erpCategory}>
                    <View style={[CustomStyles.noResultView, { alignSelf: 'center', position: 'absolute', top: 20, backgroundColor: 'transparent' }]}>
                        <Text style={[CustomStyles.erpText, {
                            color: '#1e4495', fontWeight: 'bold', textDecorationLine: 'underline', alignSelf: 'stretch', alignItems: 'center',
                        }]}>
                            {self.state.trucks.length == 0 ? 'No Trucks Found' : ''}</Text>
                    </View>
                    {this.spinnerLoad()}
                    {self.getView()}
                </View>

                <View style={[CustomStyles.addGroupImageStyle, {  justifyContent: 'center', alignItems: 'center'  }]}>
                    <View style={ { marginBottom:5, backgroundColor: '#4c69a9', width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 25 }}>
                        <TouchableOpacity
                                onPress={() => { this.connectionInfo();; }}
                            >
                            <Image source={  require('../images/reload_track.png')  }
                                style={{ width: 15, height: 15, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={ { backgroundColor: '#4c69a9', width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 25 }}>
                        <TouchableOpacity
                            onPress={() => { this.setState({ view: this.state.view === 'mapShow' ? 'listshow' : 'mapShow' }); }}
                        >
                            <Image source={this.state.view === 'mapShow' ? require('../images/gps_truck_list_icon.png') : require('../images/gps_map_lap_icon.png')}
                                style={{ width: 15, height: 15, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TrackModal
                    visible={this.state.showTrack} cancel={'cancel'}
                    onAccept={() => { this.moveToTrackScreen(); }}
                    onDecline={() => { this.ShowModalFunction(!this.state.showTrack) }}
                    onPickFromdate={() => { this.onPickdate('fromDate') }}
                    onPickTodate={() => { this.onPickdate('toDate') }}
                    frmDate={this.state.fromPassdate}
                    toDate={this.state.toPassdate} />

                <Confirm visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                    sayNo="CANCEL"
                    sayYes="CONFIRM"
                >
                    <View style={{ flex: 1, padding: 20 }}>
                        <DatePickerIOS
                            style={{ display: this.state.dispDatePicker }}
                            date={this.state.defaultDate}
                            onDateChange={(pickedDate) => {
                                this.setState({ defaultDate: pickedDate })
                                var month = pickedDate.getMonth() + 1
                                let date = pickedDate.getDate() + "/" + month + "/" + pickedDate.getFullYear();
                                // console.warn(month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear())
                                // let passdate='';
                                if (this.state.category === 'fromDate') {
                                    this.setState({ fromDate: date, fromPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                } else {
                                    this.setState({ toDate: date, toPassdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                }
                                // this.moveInputLabelUp(3, date)
                            }}
                            mode="date"
                        />
                        <View style={{ display: this.state.dispLookLoad }}>
                            <View>

                                <CustomEditText
                                    underlineColorAndroid='transparent'
                                    placeholder={'Enter Source'}
                                    value={this.state.lookLoadSource}
                                    inputTextStyle={{ alignSelf: 'stretch', marginHorizontal: 16, borderWidth: 1, borderColor: '#3085d6', borderRadius: 5 }}
                                    onChangeText={(lookLoadSource) => { this.setState({ lookLoadSource }) }}
                                />
                            </View>
                            <View>

                                <CustomEditText
                                    underlineColorAndroid='transparent'
                                    placeholder={'Enter Destination'}
                                    value={this.state.lookLoadDestination}
                                    inputTextStyle={{ alignSelf: 'stretch', marginHorizontal: 16, borderWidth: 1, borderColor: '#3085d6', borderRadius: 5 }}
                                    onChangeText={(lookLoadDestination) => { this.setState({ lookLoadDestination }) }}
                                />
                            </View>
                            <View>
                                <CustomEditText
                                    underlineColorAndroid='transparent'
                                    placeholder={'Enter Price'}
                                    keyboardType='numeric'
                                    value={this.state.lookLoadPrice}
                                    inputTextStyle={{ alignSelf: 'stretch', marginHorizontal: 16, borderWidth: 1, borderColor: '#3085d6', borderRadius: 5 }}
                                    onChangeText={(lookLoadPrice) => { this.setState({ lookLoadPrice }) }}
                                />
                            </View>
                            <View>
                                <TouchableOpacity style={{ marginTop: 10, marginHorizontal: 16, }}
                                    onPress={() => { this.onPickdate('forDate') }}>
                                    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#3085d6', borderRadius: 5 }}>
                                        <View style={{ flex: 4 }}>
                                            <CustomEditText
                                                underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Select Date'}
                                                value={this.state.forDate}
                                                inputTextStyle={{ alignSelf: 'stretch' }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Confirm>

                <NoInternetModal visible={this.state.netFlaf}
                    onAccept={() => { this.setState({ netFlaf: false }) }} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
});