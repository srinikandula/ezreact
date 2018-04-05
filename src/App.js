import React, { Component } from 'react';
import { AsyncStorage, NativeModules } from 'react-native';
import AppNavigation from './AppNavigation';
import Config from './config/Config';
import Axios from 'axios';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

export default class App extends Component {
  state = { check: false, signed: false, fcmToken:'' };

  componentWillMount() {
    this.runFCMService();
    // AsyncStorage.clear();
    this.getItem().then((resp) => {
      console.log('resp', resp);
      if (!resp)
        this.setState({ signed: false, check: true });
      else
        this.setState({ signed: true, check: true }, () => {
          var egObj = {};
          egObj = JSON.parse(resp);
          Axios({
            method: 'get',
            headers: { 'token': egObj.token },
            url: Config.routes.base + Config.routes.easygaadiDashBroad
          }).then((response) => {
            console.log('APP ==>', response.status);
            if (response.data.status) {
              console.log('APP ==>', response.data);
            } else {
              console.log('error in APP ==>', response);
              AsyncStorage.clear();// AsyncStorage.clear();
              this.setState({ signed: false, check: true });
            }
          }).catch((error) => {
            if (error.response.status === 401 || error.response.status === 502) {
              AsyncStorage.clear();// AsyncStorage.clear();
              this.setState({ signed: false, check: true });
            }
            if (error.response.status === 504) {
              AsyncStorage.clear();// AsyncStorage.clear();
              this.setState({ signed: false, check: true });
              alert("Something went Wrong.Please try after some time");
            }
            console.log('error in APP ==>', error);
          })
        });
    }).catch((error) => {
      AsyncStorage.clear();// AsyncStorage.clear();
      this.setState({ signed: false, check: true });
    });
  }

  runFCMService() {
    //FCM.requestPermissions().then(() => console.log('granted')).catch(() => console.log('notification permission rejected'));
    
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        // optional, do some component related stuff
        console.log("notify", notif);
        this.sendRemote(notif);
    });

    // FCM.getInitialNotification().then(notif => {
    //     console.log('getInitialNotification',notif)
    // });
  }

  sendRemote(notif) {
    //console.log('sendRemote',notif.fcm.body +'--'+notif.fcm.title);
    //console.log('sendRemote',notif.body +'--'+notif.title);
    if(notif.fcm.body){
      FCM.presentLocalNotification({
          title: notif.fcm.title,
          body: notif.fcm.body,
          priority: "high",
          click_action: notif.click_action,
          show_in_foreground: true,
          local: true
      });
    }else{
      FCM.presentLocalNotification({
        title: notif.title,
        body: notif.body,
        priority: "high",
        click_action: notif.click_action,
        show_in_foreground: true,
        local: true
    });
    }
    
}

  getItem() {
    return AsyncStorage.getItem('credientails');
  }


  render() {
    if (!this.state.check) {
      return null;
    }
    if (this.state.signed) {
      let LoginValid = AppNavigation(true);
      return <LoginValid />;
    } else {
      let LoginInvalid = AppNavigation(false);//false
      return <LoginInvalid />;
    }
  }
}


