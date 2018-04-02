import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import CustomStyles from './common/CustomStyles';
import Config from '../config/Config';
import Axios from 'axios';

export default class Notifications extends Component {

    componentWillMount() {
        this.getCredentailsData();
        
     }

     async getCredentailsData() {
        this.getCache((value) => {
            if (value !== null) {
                var egObj = {};
                egObj = JSON.parse(value);
                this.setState({token:egObj.token});
                if(egObj.hasOwnProperty('profilePic')){
                    this.setState({token:egObj.token,profilePic:Config.routes.getProfilePic+egObj.profilePic},()=>{console.log(this.state.profilePic,'dinesshhhh')});
                }
                this.setState({ spinnerBool:true });
                Axios({
                    method: 'get',
                    headers: { 'token': egObj.token },
                    url: Config.routes.base + Config.routes.getPushNotifications
                })
                .then((response) => {
                    if (response.data.status) {
                        console.log('getNotification ==>', response.data);
                       
                    } else {
                        console.log('no  Notification ==>', response);
                       // this.setState({ trucks: [] });
                    }
                    this.setState({ spinnerBool:false });
                }).catch((error) => {
                    console.log('error in getNotification ==>', error);
                    this.setState({ spinnerBool:false });
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
    render() {
        return (
            <View style={[CustomStyles.viewStyle, { backgroundColor: '#ddd' }]}>
             <View style={{flexDirection: 'row',height: 60, paddingTop:20, backgroundColor: '#1e4495',alignItems: 'center'}}>
                    <Text style={{fontSize: 14, color: '#fff', paddingLeft: 20, fontFamily: 'Gotham-Light'}}>
                        NOTIFICATIONS
                        </Text>
                </View>
                <View style={CustomStyles.notificationContainer}>
                    <View style={{ margin: 5 }}>
                        <Image
                            resizeMode="contain"
                            style={{ marginHorizontal: 10, marginVertical: 5, width: 50, height: 50 }}
                            source={require('../images/truckIcon.png')}
                        />
                    </View>
                    <View style={CustomStyles.notificationTextContainer} >
                        <View style={CustomStyles.nTextRowOne}>
                            <View style={{ justifyContent: 'flex-start' }}>
                                <Text>KA542323
                                    </Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end' }}>
                                <Text>12/05/2017
                                    </Text>
                            </View>
                        </View>
                        <View>
                            <Text>NP will expire on 15/10/2017</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
