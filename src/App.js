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
    FCM.requestPermissions().then(() => console.log('granted')).catch(() => console.log('notification permission rejected'));
    var refreshedToken = FCM.on('FCMTokenRefreshed', (refreshedToken) => {
      console.log('refreshedToken', refreshedToken)
      // alert(refreshedToken, ' refresh token');
      this.setState({ fcmToken: refreshedToken });
    });
    FCM.getFCMToken().then(token => {
      // store fcm token in your server
      console.log('token', token)
      // setFcmToken(token);
      this.setState({ fcmToken: token });
      NativeModules.customActivity.findEvents((error, imeiResp) => {
        // alert(imeiResp);
       /*  Utils.dbCall(Config.routes.fetchDeviceDetails + imeiResp, 'GET', { devicetoken: Config.appUtils.deviceId }, {}, (dFResp) => {
          console.warn(dFResp);
          if (dFResp.status && !dFResp.devices) {
            Utils.dbCall(Config.routes.updateDeviceDetails, 'POST', null, { imei: imeiResp, deviceId: token, email: '', mobile: '' }, (dResp) => {
              // alert(JSON.stringify(dResp));
            });
          } else if (dFResp.devices) {
            Utils.dbCall(Config.routes.updateDeviceDetails, 'POST', null, { _id: dFResp.devices._id, imei: imeiResp, deviceId: token, email: '', mobile: '' }, (dResp) => {
              // alert(JSON.stringify(dResp));
            });
          }
        }); */
      }); // Native modules end
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      if (notif.fcm !== '') {
        // this.props.navigation.navigate('notifications');
      }
    });
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


