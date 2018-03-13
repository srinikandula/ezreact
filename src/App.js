import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import AppNavigation from './AppNavigation';
import Config from './config/Config';
import Axios from 'axios';

export default class App extends Component {
  state = { check: false, signed: false };


  componentWillMount() {
    // AsyncStorage.clear();
    this.getItem().then((resp) => {
      console.log('resp',resp);
      if (!resp)
        this.setState({ signed: false, check: true });
      else
        this.setState({ signed: true, check: true },()=>{
          var egObj = {};
          egObj = JSON.parse(resp);
          Axios({
              method: 'get',
              headers: { 'token': egObj.token},
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


            if (error.response.status === 504 ) {
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


