import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, FlatList, ScrollView, Keyboard, Dimensions, AsyncStorage } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { CustomInput, Card, CustomEditText, CustomButton, CustomText, CommonBackground } from './common';
import CustomStyles from './common/CustomStyles';
import { NoInternetModal } from './common';
import Config from '../config/Config';
import CheckBox from 'react-native-checkbox';
import Utils from './common/Utils';
import RNGooglePlaces from 'react-native-google-places';
import Axios from 'axios';
class GpsSetting extends Component {
    state = { RoutesList:[],routesBool: false, mstop: ' ', OverSpeed: '', interval: '', stopTime: '', source: '', destination: '', message: '', accountId: '',
    netFlaf: false, };

    constructor(props) {
        super(props);
        this.state = {
            mstoplbl: false, OverSpeedlbl: false, intervallbl: false, stopTimelbl: false, sourcelbl: false, destinationlbl: false
        };
    }


    componentWillMount() {
        this.getCredentailsData();
    }
    getAccountRoutes() {
        Axios({
            method: 'get',
            url: Config.routes.base + Config.routes.getAccountRoutes,
            headers: { token: this.state.token }
        }).then((response) => {
            console.log('getAccountRoutes', response.data.data);
            this.setState({ RoutesList: response.data.data })
                        this.setState({ spinnerBool: false });

        }).catch((error) => {
            console.log('error in GpsSetting ==>', error);
            this.setState({ spinnerBool: false });
        })
    }
    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token });
                if (egObj.hasOwnProperty('GpsSetting')) {
                    this.setState({ token: egObj.token, });
                }
                this.setState({ spinnerBool: true });
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.gpsSetting
                })
                    .then((response) => {
                        if (response.data.status) {
                            console.log('GpsSetting ==>', response.data);
                            if (response.data.results) {
                                this.setState({
                                    //accountId:response.data.results.accountId,                
                                    mstop: '' + response.data.results.idleTime,
                                    OverSpeed: '' + response.data.results.overSpeedLimit,
                                    interval: '' + response.data.results.routeNotificationInterval,
                                    stopTime: '' + response.data.results.stopTime,
                                    mstoplbl: true, OverSpeedlbl: true, intervallbl: true, stopTimelbl: true
                                });
                               

                            }
                        } else {

                        }
                        this.getAccountRoutes();
                        // this.setState({ spinnerBool: false });
                    }).catch((error) => {
                        console.log('error in GpsSetting ==>', error);
                        this.setState({ spinnerBool: false });
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
            console.log('credientails=Notification', value);
            if (value !== null) {
                console.log('riyaz=Notification', value);
            } else {
                console.log('value=Notification', value);
            }
            callback(value);
        }
        catch (e) {
            console.log('caught error=Notification', e);
            // Handle exceptions
        }
    }

    UpdateSetting() {
        var postData = {
            'idleTime': Number(this.state.mstop),
            'overSpeedLimit': Number(this.state.OverSpeed),
            'routeNotificationInterval': Number(this.state.interval),
            'stopTime': Number(this.state.stopTime),
            'accountId': this.state.accountId
        };
        this.callupdateGPSAPI(postData)
    }

    callupdateGPSAPI(postdata) {
        const self = this;
        self.setState({ spinnerBool: true });
        var methodType = 'POST';
        var url = Config.routes.base + Config.routes.updateGpsSettings
        Axios({
            method: methodType,
            headers: { 'token': self.state.token },
            url: url,
            data: postdata
        })
            .then((response) => {
                console.log(Config.routes.base + Config.routes.updateGpsSettings, "URL");
                console.log(postdata, '<- updateGpsSettings ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });

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
                console.log('error in update updateGpsSettings ==>', error);
                self.setState({ spinnerBool: false });
                Utils.ShowMessage("Something went wrong.Please try after sometime");
            })
    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                if (this.state.point === 'source') {
                    this.setState({ source: place.name, sourceState: place.addressComponents.administrative_area_level_1, sourceAddress: place.address, sourceLng: place.longitude, sourceLat: place.latitude }, () => {
                        console.log("source========>>>>", this.state.source, this.state.sourceAddress, this.state.sourceState, this.state.sourceLng, this.state.sourceLat)
                    })
                } else {
                    this.setState({ destination: place.name, destinationState: place.addressComponents.administrative_area_level_1, destinationAddress: place.address, destinationLng: place.longitude, destinationLat: place.latitude }, () => {
                        console.log("source========>>>>", this.state.destination, this.state.destinationAddress, this.state.destinationState, this.state.destinationLng, this.state.destinationLat)
                    })
                }
            })
            .catch((error) =>{
                console.log(error.message);  // error is a Javascript Error object
            }); 

    }

    updateRoutes() {
        const self = this;
        if (!self.state.source) {
            alert('Enter source')
        } else if (!self.state.destination) {
            alert('Enter destination')
        } else {
            Axios({
                method: 'post',
                url: Config.routes.base + Config.routes.updateAccountRoutes,
                headers: { token: self.state.token },
                data: [{
                    source: self.state.source,
                    sourceState: self.state.sourceState,
                    sourceAddress: self.state.sourceAddress,
                    sourceLocation: [Number(self.state.sourceLng), Number(self.state.sourceLat)],
                    destination: self.state.destination,
                    destinationState: self.state.destinationState,
                    destinationAddress: self.state.destinationAddress,
                    destinationLocation: [Number(self.state.destinationLng), Number(self.state.destinationLat)]
                }]
            }).then((response) => {
                console.log('response', response);
                if (response.data.status) {
                    alert('Update successful')
                    this.getAccountRoutes();
                }
            })
        }
    }
    renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#d6d6d6',
                height: 0,
            }}
        />
    );

    render() {
        const {
            viewStyle,
            loginbuttonStyle,
            containerStyle,
            profileImageStyle,
            editProfileImageStyle,
            actionStyle,
            addGroupImageStyle,
            sendTextStyle,
            forgotTextStyle,
            rememberTextStyle,
            inputStyle,
            imageStyle,
            inputContainerStyle,
            text,
            backgroundImage,
            headerStyle,
            checkForgotStyle,
            checkboxStyle
        } = styles;

        const miniStoplabelStyle = {
            position: 'absolute',
            left: 10,
            //   fontFamily:'Gotham-Light',
            top: !this.state.mstoplbl ? 16 : 0,
            fontSize: !this.state.mstoplbl ? 16 : 14,
            color: !this.state.mstoplbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 1,
            height: 30,
        }

        const overSpeedlabelStyle = {
            position: 'absolute',
            left: 10,
            //   fontFamily:'Gotham-Light',
            top: !this.state.OverSpeedlbl ? 16 : 0,
            fontSize: !this.state.OverSpeedlbl ? 16 : 14,
            color: !this.state.OverSpeedlbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 3
        }


        const intervallbl = {
            position: 'absolute',
            left: 10,
            //   fontFamily:'Gotham-Light',
            top: !this.state.intervallbl ? 16 : 0,
            fontSize: !this.state.intervallbl ? 16 : 14,
            color: !this.state.intervallbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 3
        }

        const stoplabelStyle = {
            position: 'absolute',
            left: 10,
            //   fontFamily:'Gotham-Light',
            top: !this.state.stopTimelbl ? 16 : 0,
            fontSize: !this.state.stopTimelbl ? 16 : 14,
            color: !this.state.stopTimelbl ? '#aaa' : '#000',
            //   fontFamily:'Gotham-Light',
            padding: 3
        }

        const sourcelabelStyle = {
            position: 'absolute',
            left: 10,
            // fontFamily:'Gotham-Light',
            top: !this.state.sourcelbl ? 16 : 0,
            fontSize: !this.state.sourcelbl ? 16 : 14,
            color: !this.state.sourcelbl ? '#aaa' : '#000',
            // fontFamily:'Gotham-Light',
            padding: 3
        }
        const destlabelStyle = {
            position: 'absolute',
            left: 10,
            // fontFamily:'Gotham-Light',
            top: !this.state.destinationlbl ? 16 : 0,
            fontSize: !this.state.destinationlbl ? 16 : 14,
            color: !this.state.destinationlbl ? '#aaa' : '#000',
            // fontFamily:'Gotham-Light',
            padding: 3
        }

        return (
            <View style={viewStyle}>
                <ScrollView style={{ alignSelf: 'stretch', flex: 1, marginBottom: 10 }}>
                    <View style={containerStyle}>
                        <Card>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-start', paddingTop: 3, marginTop: 5 }}>
                                <Text style={miniStoplabelStyle} >
                                    Minimum stop duration
                                </Text>
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.mstop}
                                    onChangeText={(value) => {
                                        this.setState({ mstop: value, mstoplbl: value.Length == 0 ? false : true })
                                    }}
                                />
                            </View>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-start', padding: 3 }}>
                                <Text style={overSpeedlabelStyle} >
                                    OverSpeed Limit Km ph
                                </Text>

                                <CustomEditText
                                    maxLength={Config.limiters.mobileLength}
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.OverSpeed}
                                    onChangeText={(value) => {
                                        this.setState({ OverSpeed: value, OverSpeedlbl: value.Length == 0 ? false : true })
                                    }}
                                />
                            </View>
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-start', padding: 3 }}>
                                <Text style={intervallbl} >
                                    Route Notification interval
                                </Text>

                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.interval}
                                    onChangeText={(value) => {
                                        this.setState({ interval: value, intervallbl: value.Length == 0 ? false : true })
                                    }}
                                />
                            </View>

                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-start', padding: 3 }}>
                                <Text style={stoplabelStyle} >
                                    Stop Alert Time
                                </Text>
                                <CustomEditText
                                    keyboardType='numeric'
                                    inputContainerStyle={inputContainerStyle}
                                    inputTextStyle={inputStyle}
                                    value={this.state.stopTime}
                                    onChangeText={(value) => {
                                        this.setState({ stopTime: value, stopTimelbl: value.Length == 0 ? false : true })
                                    }}
                                />
                            </View>
                            <View style={{ justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-end', padding: 3 }}>
                                <TouchableOpacity style={actionStyle} onPress={() => { this.UpdateSetting() }}>
                                    <CustomText customTextStyle={sendTextStyle}>
                                        Submit
                                </CustomText>
                                </TouchableOpacity>
                            </View>

                        </Card>

                        <Card>
                            <View style={{ flexDirection: 'row' }} >
                                <Text style={text}>
                                    Set operating Routes
                                </Text>
                                <TouchableOpacity onPress={()=> {this.setState({routesBool: !this.state.routesBool})}}>
                                    <Image style={{ width: 18, height: 18, resizeMode: 'contain' }} source={require('../images/form_edit.png')} />
                                </TouchableOpacity>
                            </View>

                            <View style={{display: this.state.routesBool? 'flex': 'none' }}>
                                <View style={{ justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-start', padding: 3, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <Text style={sourcelabelStyle} >
                                        Source
                                </Text>
                                    <CustomEditText
                                        onFocus={() => {
                                            this.setState({ point: 'source' }, () => {
                                                this.openSearchModal()
                                            });
                                        }}
                                        // keyboardType='numeric'
                                        inputContainerStyle={inputContainerStyle}
                                        inputTextStyle={inputStyle}
                                        value={this.state.source}
                                        onChangeText={(value) => {
                                            this.setState({ source: value, sourcelbl: true })
                                        }}
                                    />
                                </View>
                                <View style={{ justifyContent: 'flex-start', alignSelf: 'stretch', alignItems: 'flex-start', padding: 3, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <Text style={destlabelStyle} >
                                        Destination
                                </Text>

                                    <CustomEditText
                                        onFocus={() => {
                                            this.setState({ point: 'destination' }, () => {
                                                this.openSearchModal()
                                            });
                                        }}
                                        // keyboardType='numeric'
                                        inputContainerStyle={inputContainerStyle}
                                        inputTextStyle={inputStyle}
                                        value={this.state.destination}
                                        onChangeText={(value) => {
                                            this.setState({ destination: value, destinationlbl: true })
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[CustomStyles.erpCategoryCardItems]}>
                                <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                    data={this.state.RoutesList}
                                    // extraData={this.state.RoutesList}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    renderItem={({ item }) =>
                                        <View style={[CustomStyles.erpCategoryItems]}>
                                            <CustomText customTextStyle={[CustomStyles.erpText, { color: '#000' }]}>
                                                {`${item.source} - ${item.destination}`}
                                            </CustomText>
                                        </View>

                                    }
                                    keyExtractor={item => item._id} />
                            </View>
                            <View style={checkForgotStyle}>

                                <TouchableOpacity style={actionStyle} >
                                    <CustomText customTextStyle={sendTextStyle}>
                                        Clear
                                        </CustomText>
                                </TouchableOpacity>
                                <TouchableOpacity style={actionStyle} onPress={() => { this.updateRoutes() }}>
                                    <CustomText customTextStyle={sendTextStyle}>
                                        Submit
                                        </CustomText>
                                </TouchableOpacity>

                            </View>
                        </Card>


                    </View>
                </ScrollView>


            </View>
        );
    }
}
const winW = Dimensions.get('window').width;
const winH = Dimensions.get('window').width;
const styles = {
    circle: {
        width: 60,
        height: 60,
        borderRadius: 100 / 2,
        backgroundColor: '#e22b0b',
        paddingLeft: 15,
        justifyContent: 'center',
    },
    backgroundImage: {
        width: 20,
        height: 30,
        resizeMode: 'contain'
    },
    viewStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 10

    },
    containerStyle: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
        marginTop: 40,
        marginRight: 10,
        marginLeft: 10

    },
    profileImageStyle: {
        position: 'absolute',
        top: 20
    },
    editProfileImageStyle: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#a7a4a4',
        position: 'absolute',
        top: 40,
        right: winW - 250
    },
    addGroupImageStyle: {
        padding: 5,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 70,
        right: 20,
        zIndex: 1
    },
    inputContainerStyle: {
        marginTop: 10,
        marginLeft: 5,
        marginBottom: 0
    },
    inputStyle: {
        // fontFamily:'Gotham-Light',
        fontSize: 14,
        marginTop: 6,
        backgroundColor: 'transparent',
        height: 35
    },
    sendTextStyle: {
        // fontFamily:'Gotham-Light',
        textAlign: 'right',
        color: '#ffffff',
        padding: 5
    },
    signInButtonStyle: {
        alignSelf: 'stretch',
        backgroundColor: '#ffffff',
        marginTop: 1
    },
    actionStyle: {
        paddingLeft: 5,
        backgroundColor: '#1e4495'
    },
    forgotTextStyle: {
        // fontFamily:'Gotham-Light',
        textAlign: 'right',
        color: '#1e4495',
        paddingTop: 2
    },

    imageStyle: {
        width: 25,
        height: 30
    },
    text: {
        flex: 1,
        // fontFamily:'Gotham-Light',
        color: '#000000',
        fontSize: 18,
        paddingLeft: 10
    },
    rememberTextStyle: {
        textAlign: 'center',
        color: '#3B3B3B',
        paddingTop: 2
    },
    headerStyle: {
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        height: 60,
        paddingTop: 5,
        paddingRight: 10,
        backgroundColor: '#1e4495',
        position: 'relative'
    },
    checkForgotStyle: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-around',

    },
    checkboxStyle: {
        color: '#000000'
    }

};

export default GpsSetting;