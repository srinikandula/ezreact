//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView, Animated, StyleSheet, BackHandler, Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { LoadingSpinner, ExpiryDateItems, CustomText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import MapView, { Marker,Callout } from 'react-native-maps';
const { width, height } = Dimensions.get("window");
import Utils from './common/Utils';
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class GPSTruckList extends Component {
    state = {
        loadSpinner: false,
        categoryBgColor: false, token: '', trucks: [],
        aspectRatio: 0,
        latitudeDelta: 1,
        longitudeDelta: 1,
        latitude: 78.3100319,
        longitude: 17.46247,
        animation: new Animated.Value(0),
        markers: [{
            coordinate: {
                latitude: 0,
                longitude: 0
            }
        }],
        view: 'listshow',
        location: ['Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna',
            'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi',
            'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai',
            'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna',
            'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad',
            'patna', 'mumbai', 'Delhi', 'Pune', 'Hyderabad', 'patna', 'mumbai', 'Delhi', 'Pune']

    };

    componentWillMount() {
        this.setState({ loadSpinner: true });
        const self = this;
        console.log(self.props, "token");
        this.getCredentailsData();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("wokeeey");
                console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
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
                            //console.log('trucksList ==>', response.data);
                            if (response.data.trucks.length == 0) {
                                this.setState({ loadSpinner: false })
                            } else {

                                var catgryarr = response.data.trucks;
                                catgryarr = catgryarr.filter(function (item, index) {
                                    if (item.hasOwnProperty('attrs'))
                                        return item;
                                });

                                this.setState({ trucks: catgryarr });

                                var dump = [];
                                for (let index = 0; index < catgryarr.length; index++) {
                                    const element = catgryarr[index];
                                    element.location = this.state.location[index];
                                    element.rememberme = false;
                                    //console.log(this.state.location[index], 'element.location');
                                    dump.push(element);
                                    this.setState({ trucks: dump });
                                }

                                console.log(catgryarr, 'vignesh == ', dump);
                                var catgryarr1 = [];
                                for (let index = 0; index < catgryarr.length; index++) {
                                    if (catgryarr[index].attrs.hasOwnProperty('latestLocation')) {
                                        const element = catgryarr[index].attrs.latestLocation.location.coordinates;
                                        // console.log(element,'attrs.latestLocation.location.coordinates',element[0],element[1]);
                                        //latitude:0,longitude:0
                                        var obj = { coordinate: { latitude: element[1], longitude: element[0], image: 'https://i.imgur.com/sNam9iJ.jpg' } };
                                        catgryarr1.push(obj);
                                        this.setState({ latitude: element[1], longitude: element[0] });
                                        this.setState({ markers: catgryarr1 }, () => { console.log(this.state.markers, 'markers'); });
                                    }
                                }
                            }
                            this.setState({ loadSpinner: false })

                        } else {
                            console.log('error in GPStrucksList ==>', response);
                            this.setState({ loadSpinner: false })
                            let message ="";
                            if(response.data)
                            response.data.messages.forEach(function(current_value) {
                                message = message+current_value;
                            });
                            Utils.ShowMessage(message);
                        }
                    }).catch((error) => {
                        console.log('error in GPStrucksList ==>', error);
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



    getParsedDate(date) {
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getFullYear().toString() + "  " + formattedDate.getHours() + ' : ' + formattedDate.getMinutes();
    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#d6d6d6',
                height: 0,
            }}
        />
    );

    getName(item) {
        var data = '-';
        if (item.attrs.hasOwnProperty("latestLocation")) {
            data = item.attrs.latestLocation.speed;
            data = `Speed: ${parseInt(data)}`
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

    renderLoadingSpinner() {
        if (this.state.loadSpinner)
            return <LoadingSpinner />;
        return false;
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
            >
            <Callout tooltip style={styles.customView}>
                <View style={styles.calloutText}>
                    <Text>{'Riyaz'}{"\n"}{'description'}</Text>
                </View>
            </Callout>
            </Marker>
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

    renderTruckIcon(item) {
        if (item.attrs.hasOwnProperty('latestLocation')) {
            const speed = parseInt(item.attrs.latestLocation.speed)
            if (speed > 10) {
                return <Image resizeMode="contain"
                    source={require('../images/greenTruck.png')}
                    style={CustomStyles.imageWithoutradiusViewContainer} />
            } else if (speed === 0) {
                return <Image resizeMode="contain"
                    source={require('../images/redTruck.png')}
                    style={CustomStyles.imageWithoutradiusViewContainer} />
            } else {
                return <Image resizeMode="contain"
                    source={require('../images/orangeTruck.png')}
                    style={CustomStyles.imageWithoutradiusViewContainer} />
            }
        } else {
            return;
        }
    }


    getView() {
        switch ('listshow') {
            case 'mapshow':
                console.log(this.state.markers.length, '--99999--', 'item');
                return (
                    <View style={CustomStyles.mapcontainer}>
                        <MapView
                            style={CustomStyles.map}
                            maxZoomLevel={7}
                            initialRegion={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.021,
                                longitudeDelta: 0.021,

                            }}
                        >
                            {this.state.markers.map((marker, index) => {
                                return (
                                    <MapView.Marker key={index} coordinate={marker.coordinate}>
                                        <Animated.View style={[styles.markerWrap]}>
                                            <Animated.View style={[styles.ring]} />
                                            <View style={styles.marker} />
                                        </Animated.View>
                                    </MapView.Marker>
                                );
                            })}
                        </MapView>
                    </View>
                );
                break;
            case 'listshow':
                return (<FlatList style={{ alignSelf: 'stretch', flex: 1, display: this.state.listshow }}
                    data={this.state.trucks}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item }) =>
                        <View style={[CustomStyles.erpCategoryCardItems, { backgroundColor: !this.state.categoryBgColor ? '#ffffff' : '#f6f6f6' }]}>
                            <View style={CustomStyles.erpDriverItems}>
                                <View style={[CustomStyles.erpTextView, { flex: 0.4, borderBottomWidth: 0 }]}>
                                    {this.renderTruckIcon(item)}
                                    <Text style={[CustomStyles.erpText, { color: '#1e4495', fontWeight: 'bold', textDecorationLine: 'underline' }]}>
                                        {item.registrationNo}</Text>
                                    <Text style={[CustomStyles.erpText, { color: '#1e4495', fontWeight: 'bold', fontSize: 12 }]}>
                                        {this.getParsedDate(item.updatedAt)}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                    <View style={{ flexDirection: 'row', padding: 10 }}>
                                        <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                            <Text style={[CustomStyles.erpText, { color: '#1e4495', fontWeight: 'bold', }]}>
                                                Location {item.location}</Text>

                                            <Text style={[CustomStyles.erpText, { color: '#1e4495', fontWeight: 'bold', }]}>
                                                {this.getName(item)} km/hr</Text>
                                            <CheckBox
                                                checkboxStyle={{ width: 12, height: 12 }}
                                                label='Looking For Load'
                                                color={'#000000'}
                                                checked={item.rememberme}
                                                onChange={() => this.lookingForLoad(item)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    keyExtractor={item => item._id}
                    extraData={this.state} />);
                break;
            default:
                break;
        }
    }

    showResult(){
        if(this.state.trucks.length == 0)
         return 'No Trucks Found';
    }

    render() {
        const self = this;
        const { region } = this.props;
        const { width, height } = Dimensions.get('window');

        return (
            <View style={CustomStyles.viewStyle}>
                {this.renderLoadingSpinner()}
                <View style={CustomStyles.noResultView}>
                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',
                                textDecorationLine:'underline',alignSelf:'stretch',alignItems:'center',}]}>
                                {this.showResult()}</Text>
                        </View>
                <View style={CustomStyles.erpCategory}>

                    {self.getView()}



                </View>

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