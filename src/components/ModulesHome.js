import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, BackHandler, Alert } from 'react-native';
import GPSTruck from '../components/GPSTruckList';
var count=0;
export default class ModulesHome extends Component {
    componentDidMount() {
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
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 10 }}>
                    <ScrollView horizontal>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('GPS')}}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('../images/gpsIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Gps</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity /* navigation={this.props.navigation} */ onPress={() => this.props.navigation.navigate('SubModule')}>
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
                    <GPSTruck/>
                    </View>
            </View>
        );
    }
}
