//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import {
    View, ScrollView, Animated, DatePickerAndroid, StyleSheet, Platform, TouchableHighlight, DatePickerIOS,
    BackHandler, Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity
} from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems, TrackModal, CustomText, CSpinner, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import MapView, { Marker, Polyline, AnimatedRegion,Callout } from 'react-native-maps';
import Utils from '../components/common/Utils';
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const screen = Dimensions.get('window')

const ASPECT_RATIO = screen.width / screen.height

const LATITUDE_DELTA = 12
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class GPSTrackLocation extends Component {
    state = {
        defaultDate: new Date(),
        showModal: false, date: '',
        _mapView: MapView,
        categoryBgColor: false, token: '', truckMakers: [], coordinates: [], coordinates1: [],
        showDependable: '0',
        showTrack: false,
        truckNum: '',
        fromDate: '',
        fromPassdate: '',
        toDate: '',
        toPassdate: '',
        aspectRatio: 0,
        latitudeDelta: 1,
        longitudeDelta: 1,
        latitude: 17.46247,
        longitude: 78.3100319,
        animation: new Animated.Value(0),
        initialPoint: {
            latitude: 17.385044,
            longitude: 78.486671,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        },
        coordinate: new MapView.AnimatedRegion({
            latitude: 17.385044,
            longitude: 78.486671,
        }),
        spinnerBool: false,
        truckNum: '',
        averageSpeed: '',
        distanceTravelled: '',
        timeTravelled: '',
        odemeter:'',
        topSpeed:''

    };

    componentWillMount() {
        console.log('this.props gpstractlocation', this.props.nav)
        const self = this;
        console.log(self.props, "GPSTrackLocation=token");
        this.getCredentailsData();
        self.setState({ showDependable: '0' });
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

        onBackAndroid() {
            //Actions.pop();
            //var value = await this.getCache('credientails');
           }

           async getCredentailsData() {
               const self  = this;
               self.setState({ spinnerBool:true });
               const data = JSON.parse(self.props.navigation.state.params.sendingDate);
               self.setState({truckNum:data.truckId});
            this.getCache((value) => {
                if (value !== null) {
                    var egObj = {};
                    egObj = JSON.parse(value);
                    this.setState({ token: egObj.token });
                    Axios({
                        method: 'GET',
                        headers: { 'token': egObj.token },
                        url: Config.routes.base + Config.routes.gpsTrackLocation +"/"+data.truckId+"/"+data.startDate+"/"+data.endDate,
                        
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('truckMakers ==>', response.data);
                                var coordinateArr =[];
                                var coordinateArr1 =[];
                                if (response.data.results.positions.length > 0) {
                                   
                                    const arrList = response.data.results.positions;
                                    //arrList.length
                                    for (let index = 0; index < arrList.length; index++) {
                                        const element = arrList[index];
                                        if(index == 2){
                                            this.setState({initialPoint:{latitude:Number(element.location.coordinates[1]), 
                                                longitude:Number(element.location.coordinates[0]), 
                                                latitudeDelta:LATITUDE_DELTA,
                                                longitudeDelta: LONGITUDE_DELTA}});
                                        }
                                        coordinateArr.push({ strokeColor: "#00ff00",latitude: element.location.coordinates[1], 
                                            longitude:element.location.coordinates[0] });
                                        element.coordinate = { strokeColor: "#00ff00",latitude:  element.location.coordinates[1] , 
                                            longitude:element.location.coordinates[0]  };
                                        coordinateArr1.push(element);
                                //     }
                                //     coordinateArr.push({
                                //         strokeColor: "#00ff00", latitude: Number(element.location.coordinates[1]),
                                //         longitude: Number(element.location.coordinates[0])
                                //     });
                                //     element.coordinate = {
                                //         strokeColor: "#00ff00", latitude: Number(element.location.coordinates[1]),
                                //         longitude: Number(element.location.coordinates[0])
                                //     };
                                //     coordinateArr1.push(element);
                                 }

                                this.setState({ coordinates: coordinateArr, coordinates1: coordinateArr1, showDependable: '' + coordinateArr.length, spinnerBool: false }, () => {
                                    this.getView();
                                    console.log(this.state.coordinates1, ' coordinates1==>>>')
                                });
                            } else {
                                this.setState({ coordinates: [], showDependable: 'No Data Found', spinnerBool: false }, () => {
                                    this.getView();
                                    console.log(this.state.coordinates, ' ==>>>')
                                });
                                let message = '';
                                if (response.data)
                                    response.data.messages.forEach(function (current_value) {
                                        message = message + current_value;
                                    });
                                Utils.ShowMessage(message);
                            }



                            this.setState({
                                spinnerBool: false, truckNum: data.truckId, distanceTravelled: response.data.results.distanceTravelled,
                                timeTravelled: response.data.results.timeTravelled, averageSpeed: response.data.results.averageSpeed,
                               // odemeter: response.data.results.distanceTravelled,
                                //topSpeed:response.data.results.distanceTravelled,
                            })

                        } else {
                            console.log('error in GPSTrackLocation ==>', response);
                            this.setState({ coordinates: [], showDependable: 'No Data Found', spinnerBool: false }, () => {
                                this.getView();
                            });
                        }
                    }).catch((error) => {
                        console.log('error in GPSTrackLocation ==>', error);
                        this.setState({ coordinates: [], showDependable: 'No Data Found', spinnerBool: false }, () => {
                            this.getView();
                        });

                    })
            } else {
                this.setState({ coordinates: [], showDependable: 'No Data Found', spinnerBool: false }, () => {
                    this.getView();
                });

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
    lookingForLoad(items) {
        var temparr = [];
        for (let index = 0; index < this.state.trucks.length; index++) {
            const element = this.state.trucks[index];
            if (items._id == element._id) {
                if (element.rememberme) {
                    element.rememberme = false;
                } else {
                    element.rememberme = true;
                }
                this.state.trucks[index] = element;
                this.setState({ trucks: this.state.trucks });
                break;
            }

        }
    }
    markerClick(markerData) {
        console.log(markerData, 'markerData');
        this.ShowModalFunction(!this.state.showTrack);
    }

    ShowModalFunction(visible) {
        this.setState({ showTrack: visible });
    }


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
    getSpeed(speed) {
        var strSpeed = speed;
        // if (strSpeed.length > 4) {
        strSpeed = Math.round(Number(strSpeed) * 100) / 100
        // }
        return strSpeed;
    }

    getView() {
        console.log('this.state.showDependable', this.state.showDependable);
        switch (this.state.showDependable) {
            case '0':
                console.log('this.state.coordinates', this.state.coordinates);
                return (
                    <View style={[{
                        alignSelf: 'stretch', flexDirection: 'row', paddingTop: 5, position: 'absolute',
                        top: 100, justifyContent: 'center',
                        zIndex: 1, width: '100%'
                    }, { display: 'flex' }]}>
                        <Text>Loading Map..</Text>
                    </View>
                );
                break;
            case 'No Data Found':
                return (
                    <View style={[{
                        alignSelf: 'stretch', flexDirection: 'row', paddingTop: 5, position: 'absolute',
                        top: 100, justifyContent: 'center',
                        zIndex: 1, width: '100%'
                    }, { display: 'flex' }]}>
                        <Text >No Data Found</Text>
                    </View>
                );
                break;
            case '' + this.state.coordinates.length:
                console.log('this.state.coordinates', this.state.coordinates);
                return (
                    <View style={CustomStyles.mapcontainer}>
                        <MapView
                            ref={(mapView) => { _mapView = mapView; }}
                            style={CustomStyles.map}
                            initialRegion={this.state.initialPoint}
                            zoomEnabled={true}
                            maxZoomLevel={16}>

                            {this.state.coordinates1.map((marker, index) => {
                                if (index == 0) {
                                    return (
                                        <MapView.Marker key={index}
                                            image={require('../images/track_strat_end.png')}
                                            coordinate={{
                                                latitude: marker.coordinate.latitude,
                                                longitude: marker.coordinate.longitude
                                            }}>
                                            <MapView.Callout style={CustomStyles.mapcard}
                                            onPress={() => { console.log(marker,'shhhharatt') }}>
                                            <View style={CustomStyles.mapContent}>
                                                <Text>{'Reg.No :'}{this.state.truckNum}</Text>
                                                <Text>{'Speed :'}{`${this.getSpeed(marker.speed)} kmph`}</Text>
                                                <Text>{'Date :'}{`${this.getParsedDate(marker.updatedAt)} ${this.getParsedtime(marker.updatedAt)}`}</Text>

                                            </View>
                                        
                                        </MapView.Callout>
                                        
                                        </MapView.Marker>
                                    )
                                } else if (index == (this.state.coordinates.length - 1)) {
                                    return (
                                        <MapView.Marker key={index}
                                            image={require('../images/track_strat_end.png')}
                                            coordinate={{
                                                latitude: marker.coordinate.latitude,
                                                longitude: marker.coordinate.longitude
                                            }}>
                                            <MapView.Callout style={CustomStyles.mapcard}
                                            onPress={() => { console.log(marker,'shhhharatt') }}>
                                            <View style={CustomStyles.mapContent}>
                                                <Text>{'Reg.No :'}{this.state.truckNum}</Text>
                                                <Text>{'Speed :'}{`${this.getSpeed(marker.speed)} kmph`}</Text>
                                                <Text>{'Date :'}{`${this.getParsedDate(marker.updatedAt)} ${this.getParsedtime(marker.updatedAt)}`}</Text>

                                            </View>
                                        
                                        </MapView.Callout>
                                        
                                        </MapView.Marker>)
                                } else {
                                   
                                    if (marker.hasOwnProperty("isIdle") && marker.hasOwnProperty('isStopped')) {
                                        if (marker.isStopped) {
                                            return (
                                                <MapView.Marker key={index}
                                                    image={require('../images/track_stop.png')}
                                                    coordinate={{
                                                        latitude: marker.coordinate.latitude,
                                                        longitude: marker.coordinate.longitude
                                                    }}
                                                >
                                                <MapView.Callout style={CustomStyles.mapcard}
                                                    onPress={() => { console.log(marker,'shhhharatt') }}>
                                                    <View style={CustomStyles.mapContent}>
                                                        <Text>{'Reg.No :'}{this.state.truckNum}</Text>
                                                        <Text>{'Speed :'}{`${this.getSpeed(marker.speed)} kmph`}</Text>
                                                        <Text>{'Date :'}{`${this.getParsedDate(marker.updatedAt)} ${this.getParsedtime(marker.updatedAt)}`}</Text>

                                                    </View>
                                                
                                                </MapView.Callout>
                                                
                                                </MapView.Marker>)
                                        }
                                        if (marker.isIdle && !marker.isStopped) {
                                            return (
                                                <MapView.Marker key={index}
                                                    image={require('../images/track_idle.png')}
                                                    coordinate={{
                                                        latitude: marker.coordinate.latitude,
                                                        longitude: marker.coordinate.longitude
                                                    }}
                                                >
                                                 <MapView.Callout style={CustomStyles.mapcard}
                                                    onPress={() => { console.log(marker,'shhhharatt') }}>
                                                    <View style={CustomStyles.mapContent}>
                                                        <Text>{'Reg.No :'}{this.state.truckNum}</Text>
                                                        <Text>{'Speed :'}{`${this.getSpeed(marker.speed)} kmph`}</Text>
                                                        <Text>{'Date :'}{`${this.getParsedDate(marker.updatedAt)} ${this.getParsedtime(marker.updatedAt)}`}</Text>

                                                    </View>
                                                
                                                </MapView.Callout>
                                                
                                                </MapView.Marker>)
                                        }
                                        if(!marker.isIdle && !marker.isStopped){
                                        //     console.log(index+'!marker.isIdle && !marker.isStopped', !marker.isIdle +"&&"+ !marker.isStopped +"marker.coordinate.latitude" +marker.coordinate.latitude +"\n"+
                                        // marker);
                                                return (
                                                    <MapView.Marker key={index}
                                                        image={require('../images/truck_running.png')}
                                                        coordinate={{
                                                            latitude: marker.coordinate.latitude,
                                                            longitude: marker.coordinate.longitude
                                                        }}
                                                    >
                                                     <MapView.Callout style={CustomStyles.mapcard}
                                                        onPress={() => { console.log(marker,'shhhharatt') }}>
                                                        <View style={CustomStyles.mapContent}>
                                                            <Text>{'Reg.No :'}{this.state.truckNum}</Text>
                                                            <Text>{'Speed :'}{`${this.getSpeed(marker.speed)} kmph`}</Text>
                                                            <Text>{'Date :'}{`${this.getParsedDate(marker.updatedAt)} ${this.getParsedtime(marker.updatedAt)}`}</Text>
        
                                                        </View>
                                                    
                                                    </MapView.Callout>
                                                    
                                                    </MapView.Marker>)
                                            
                                        }


                                    }
                                }//close



                            })
                            }
                            <MapView.Polyline
                                onPress={() => {
                                    () => _mapView.animateToCoordinate({
                                        latitude: 17.46247,
                                        longitude: 78.3100319,
                                    }, 1000)

                                }}
                                coordinates={this.state.coordinates}
                                strokeWidth={1}
                                fillColor="rgba(255,0,0,0.5)"
                                strokeColor="green"
                                lineCap="round"
                                lineJoin="round"
                                geodesic={true}
                            />

                        </MapView>
                    </View>
                );
                break;
            case 'stops':
                return (
                    <View style={{ backgroundColor: 'red', top: 50 }}>

                        <FlatList style={{ marginTop: 10 }}
                            data={this.state.coordinates1}
                            // ItemSeparatorComponent={this.renderSeparator}
                            removeClippedSubviews={true}
                            renderItem={({ item }) => {
                                if (item.isStopped) {
                                    return (
                                        <View style={[CustomStyles.erpCategoryItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#ffffff',borderBottomWidth:1,borderBottomColor: '#ddd' }]}>
                                            <View style={CustomStyles.erpDriverItems}>
                                                <View style={[CustomStyles.erpTextView, { flex: 0.6, borderBottomWidth: 0 }]}>
                                                    <Image resizeMode="contain"
                                                        source={require('../images/truck_stops.png')}
                                                        style={CustomStyles.imageViewContainer} />

                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>

                                                    <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
                                                        <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
                                                            <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                                                Date</Text>
                                                            <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                                                {this.getParsedDate(item.updatedAt)}</Text>
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: 'column', padding: 2 }}>
                                                            <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                                                Time</Text>
                                                            <Text style={[CustomStyles.erpText, { fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                                                {this.getParsedtime(item.updatedAt)} {}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>)
                                }
                                
                            }
                            }
                            keyExtractor={item => item._id} />
                    </View>

                );
                break;
            case 'Animate':
                return (
                    <View style={CustomStyles.mapcontainer}>
                        <MapView

                            style={CustomStyles.map}
                            initialRegion={this.state.initialPoint}
                            zoomEnabled={true}
                            maxZoomLevel={25}
                            image={require('../images/truck_stop.png')}>

                            <MapView.Polyline
                                onPress={() => {
                                    () => _mapView.animateToCoordinate({
                                        latitude: 17.46247,
                                        longitude: 78.3100319,
                                    }, 1000)

                                }}
                                coordinates={this.state.coordinates}
                                strokeWidth={1}
                                fillColor="rgba(255,0,0,0.5)"
                                strokeColor="green"
                                lineCap="round"
                                lineJoin="round"
                                geodesic={true} />
                            {this.state.coordinates1.map((marker, index) => {
                                console.log('marker sharath data', marker)
                                if (index !== 0) {
                                    return (
                                        <MapView.Callout style={CustomStyles.mapcard}
                                            onPress={() => { this.markerClick(marker) }}>
                                            <View style={CustomStyles.mapContent}>
                                                <Text>{'Reg.No :'}{'marker.registrationNo'}</Text>
                                                <Text>{'Odemeter :'}{'*****km'}</Text>
                                                <Text>{'Date :'}{'this.getParsedDate(marker.date)'}</Text>

                                            </View>
                                           
                                        </MapView.Callout>
                                    )
                                }

                            })
                            }
                        </MapView>
                    </View>
                );
                break;
            case 'info':
                return (
                    <View style={{ top: 55 }}>
                        <View style={{ flexDirection: 'column', padding: 10 }}>
                            <View style={{ alignSelf: 'stretch', flexDirection: 'column', padding: 10 }}>
                                <View style={{ alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text style={[CustomStyles.erpText, { alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        Truck Reg No</Text>
                                    <Text style={[CustomStyles.erpText, { textAlign: 'center', alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        {this.state.truckNum}</Text>
                                </View>
                                <View style={{ alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text style={[CustomStyles.erpText, { alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                    Distance Travelled</Text>
                                    <Text style={[CustomStyles.erpText, { textAlign: 'center', alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        {Math.floor(Number(this.state.distanceTravelled))}</Text>
                                </View>
                                <View style={{ alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text style={[CustomStyles.erpText, { alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        Time Travelled </Text>
                                    <Text style={[CustomStyles.erpText, { textAlign: 'center', alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        {Math.floor(this.gettimeTravelled(this.state.timeTravelled))} hours</Text>
                                </View>
                                <View style={{ alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text style={[CustomStyles.erpText, { alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        Average Speed </Text>
                                    <Text style={[CustomStyles.erpText, { textAlign: 'center', alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        {Math.floor(this.gettimeTravelled(this.state.averageSpeed))} Kmph</Text>
                                </View>
                                <View style={{ alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text style={[CustomStyles.erpText, { alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        Odemeter </Text>
                                    <Text style={[CustomStyles.erpText, { textAlign: 'center', alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        {Math.floor(Number(this.state.odemeter))} Km</Text>
                                </View>
                                <View style={{ alignSelf: 'stretch', justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 10 }}>
                                    <Text style={[CustomStyles.erpText, { alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                    Top Speed </Text>
                                    <Text style={[CustomStyles.erpText, { textAlign: 'center', alignSelf: 'stretch', fontFamily: 'Gotham-Medium', fontSize: 16, }]}>
                                        {Math.floor(Number(this.state.topSpeed)) } Kmph</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                );
                break;
            default:
                break;
        }
    }

    onPickdate(category) {
        const self = this;
        if (Platform.OS === 'ios') {
            console.warn('in ios')
            this.setState({ showModal: true, category: category })
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
        if (this.state.date === '') {
            alert('Select a date');
        } else {
            this.setState({ showModal: false })
        }
    }

    onDecline() {
        this.setState({ showModal: false, date: '' });

    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    playRoute() {
        this.state.coordinates.map((marker, index) => {
            console.log(
                "latitude:" + marker.latitude,
                "longitude:" + marker.longitude
            )
            _mapView.animateMarkerToCoordinate({
                latitude:  marker.latitude+ this.state.latitudeDelta * 0.01 ,
                longitude:  marker.longitude+ this.state.latitudeDelta * 0.01 
              }, 6000)
            })
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
                }, { display: 'flex' }]}>

                    <View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-start', margin: 15 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/back_icon.png')} />
                        </TouchableOpacity>
                        <Text style={[CustomStyles.erpText, { color: 'white', paddingVertical: 3, fontFamily: 'Gotham-Medium', fontSize: 12, margin: 10, marginLeft: 3 }]}>
                            Track {this.state.truckNum}</Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', margin: 5 }}>
                        <TouchableOpacity onPress={() => { this.setState({ showDependable: 'info' }); }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/gps_trip_info_icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ showDependable: 'stops' }); }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/gps_trip_stops_icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({coordinates:[]}),this.getCredentailsData(); }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/reload_track.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.state.coordinates.length == 0 ? this.setState({ showDependable: 'No Data Found' }) : this.setState({ showDependable: '' + this.state.coordinates.length });
                        }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/gps_map_lap_icon.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }}>
                            <Image style={{ width: 26, height: 25, resizeMode: 'contain', margin: 10, marginHorizontal: 5 }}
                                source={require('../images/gps_map_icon.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.spinnerLoad()}

                {self.getView()}


                <TrackModal
                    visible={this.state.showTrack} cancel={'cancel'}
                    onAccept={() => { this.ShowModalFunction(!this.state.showTrack) }}
                    onDecline={() => { this.ShowModalFunction(!this.state.showTrack) }}
                    onPickFromdate={() => { this.onPickdate('fromDate') }}
                    onPickTodate={() => { this.onPickdate('toDate') }}
                    frmDate={this.state.fromDate}
                    toDate={this.state.toDate} />
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
                                this.setState({ date: date, passdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                // this.moveInputLabelUp(3, date)
                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>
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