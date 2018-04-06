import React, { Component } from 'react';
import { View, Text, Image, FlatList,AsyncStorage,Platform,NetInfo  } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { NoInternetModal } from './common';
import Config from '../config/Config';
import Axios from 'axios';

export default class Notifications extends Component {
    state = {notifyData: [],message:'', showMail: false};

    componentWillMount() {
                this.getCredentailsData();
    }
    async getCredentailsData() {
        this.connectionInfo();
     }

    async connectionInfo() {
        if (Platform.OS === "ios") {
            let isConnected = await fetch("https://www.google.com")
                .catch((error) => { this.setState({ showMail: true }); });
            if (isConnected) { this.onNetSuccess(); }
        } else {
            NetInfo.isConnected.fetch().then(isConnected => {
                console.log('isConnected', isConnected);
                if (isConnected) { this.onNetSuccess(); }
                else { return this.setState({ showMail: true }); }
            });
        }
    }
    
    onNetSuccess(){
        this.setState({showMail:false});
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
                        if(response.data.data.length > 0){
                            this.setState({notifyData:response.data.data})
                        }else{
                            this.setState({noData:'No Notification found'});
                            let message = "";
                        if (response.data)
                            response.data.messages.forEach(function (current_value) {
                                message = message + current_value;
                            });
                        Utils.ShowMessage(message);                        
                        }
                        this.setState({ spinnerBool: false });
                    } else {
                        console.log('no  Notification ==>', response);
                    // this.setState({ trucks: [] });
                    }
                    this.setState({ spinnerBool:false });
                }).catch((error) => {
                    console.log('error in getNotification ==>', error);
                    this.setState({ spinnerBool:false });
                    this.setState({noData:'No Data found'})
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

    convertDateTime(dtstr) {
        var commdate = new Date(dtstr)
        var currr = new Date();
        var testime = 0
        var test = '', test1 = ''
        var trick = [], trick1 = [], count = 0;
        var commtime = '', currrtime = '';
        var posttime = ''
        if (currr.getFullYear() === commdate.getFullYear()) {
          count = count + 1;
          test = commdate.toLocaleDateString();
    
          test1 = currr.toLocaleDateString();
          trick = test.split(/[/]/).map(parseFloat)
          trick1 = test1.split(/[/]/).map(parseFloat)
          commtime = commdate.toTimeString().split(/[: T-]/).map(parseFloat);
          currrtime = currr.toTimeString().split(/[: T-]/).map(parseFloat);
          // console.log(commtime)
          if (trick[0] === trick1[0] && trick[1] === trick1[1]) {
            // console.log('commentTime====='+' '+Math.abs(currrtime[0]-commtime[0])+' Hours  '+Math.abs(currrtime[1]-commtime[1])+' minutes'+Math.abs(currrtime[2]-commtime[2])+' seconds ago');
            posttime = Math.abs(currrtime[0] - commtime[0]) + ' Hours  ' + Math.abs(currrtime[1] - commtime[1]) + ' min' + Math.abs(currrtime[2] - commtime[2]) + ' sec ago'
            return posttime;
    
          }
          if (trick[0] != trick1[0] && trick[1] != trick1[1]) {
            posttime = Math.abs(trick[0] - trick1[0]) + ' months ' + Math.abs(trick[1] - trick1[1]) + ' days ago';
            return posttime;
          }
    
          if (trick1[0] === trick[0]) {
            // console.log('commentTime====='+' '+Math.abs(trick[1]-trick1[1])+' days ago');
            posttime = Math.abs(trick[1] - trick1[1]) + ' days ago';
            return posttime;
    
            // console.log('same day',trick)
    
          }
    
          else if (trick1[0] != trick[0]) {
            // console.log('commentTime====='+' '+Math.abs(trick[0]-trick1[0])+' months'+Math.abs(trick[1]-trick1[1])+' days ago');
            posttime = Math.abs(trick[0] - trick1[0]) + ' months ' + Math.abs(trick[1] - trick1[1]) + ' days ago';
            return posttime;
    
          }
        }
        else {
          posttime = Math.abs(currr.getFullYear() - commdate.getFullYear()) + '  years ago'
          return posttime;
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
                <View style={CustomStyles.noResultView}>
                            <Text style={[CustomStyles.erpText,{color:'#1e4495',fontWeight:'bold',
                                textDecorationLine:'underline',alignSelf:'stretch',alignItems:'center',}]}>
                                {this.state.noData}</Text>
                        </View>

                <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                            data={this.state.notifyData}
                            ItemSeparatorComponent={this.renderSeparator}
                            renderItem={({ item }) =>
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
                                                    <Text>{item.title}
                                                        </Text>
                                                </View>
                                                <View style={{ justifyContent: 'flex-end' }}>
                                                    <Text>{this.convertDateTime(item.date)}
                                                        </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text>{item.message}</Text>
                                            </View>
                                        </View>
                                    </View>
                            }
                            keyExtractor={item => item._id} />
                
                <NoInternetModal visible={this.state.showMail} 
                                onAccept={() => {this.setState({ showMail: false }); this.getCredentailsData(); }}/>
            </View>
        );
    }
}
