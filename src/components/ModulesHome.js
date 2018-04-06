import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity,AsyncStorage, BackHandler,Platform,NetInfo, Alert } from 'react-native';
import GPSTruckMap from '../components/GPSTruckMap';
import { NoInternetModal } from './common';
var count=0;
export default class ModulesHome extends Component {
    state={ netFlaf: false,gpsEnabled: true,
        erpEnabled: true,}
    componentDidMount() {
        this.getCredentailsData();
        BackHandler.addEventListener('hardwareBackPress', function () {
            count++;
            if (count === 1) {
                Alert.alert('', 'Do you want to exit app?', [
                    { text: 'Cancel', onPress: () => { count-- }, style: 'cancel' },
                    { text: 'OK', onPress: () => { count = 0; BackHandler.exitApp() } },], { cancelable: false }
                )
            }
            console.log('back button pressed', count);
            return true;
        });
        
    }

    async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({ token: egObj.token,gpsEnabled: egObj.gpsEnabled,
                    erpEnabled: egObj.erpEnabled, });
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.driverList
                })
                    .then((response) => {
                        if (response.data.status) {
                            console.log('DriverList ==>', response.data);
                            this.setState({ driver: response.data.drivers,dummydriver: response.data.drivers })
                        } else {
                            console.log('error in DriverList ==>', response);
                            this.setState({ erpDashBroadData: [], expirydetails: [] });
                        }

                    }).catch((error) => {
                        console.log('error in DriverList ==>', error);
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



    GPSMApcheckNetwork(){
        this.connectionInfo();
    }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { 
                this.setState({netFlaf:false});
                this.props.navigation.navigate('GPSMAp',{ nav:this.props,showHeader:true});
             }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected',isConnected);
                if (isConnected) {
                    this.setState({netFlaf:false});
                    this.props.navigation.navigate('GPSMAp',{ nav:this.props,showHeader:true});
                } else {
                 this.setState({netFlaf:true});
                }
            });
        }
    }

    SubModulecheckNetwork(){
        this.setState({netFlaf:false});
        this.connectNetInfo();
    }
    async connectNetInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ netFlaf: true }); });
            if (isConnected) { 
                this.setState({netFlaf:false});
                    this.props.navigation.navigate('SubModule');
             }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected',isConnected);
                if (isConnected) {
                    this.setState({netFlaf:false});
                    this.props.navigation.navigate('SubModule');
                } else {
                 this.setState({netFlaf:true});
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 10 }}>
                    <ScrollView horizontal>
                        <TouchableOpacity onPress={() => {  
                                this.GPSMApcheckNetwork()}} >
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('../images/gpsIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Gps</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity /* navigation={this.props.navigation} */ onPress={() => 
                            this.SubModulecheckNetwork()} style={{display:'flex'/* this.state.erpEnabled?'flex':'none' */}}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('../images/erpTruckIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Erp</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('../images/fuelCardIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Fuel Card</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('../images/tollCardIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Toll Card</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('../images/loadsIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Loads</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={{flex: 1,alignSelf:'stretch'}}>
                    <GPSTruckMap nav={this.props} showHeader={false}/>

                </View>
                <NoInternetModal visible={this.state.netFlaf} 
                                            onAccept={() => {this.setState({ netFlaf: false }) }}/>
            </View>
        );
    }
}
