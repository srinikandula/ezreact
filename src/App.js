import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import AppNavigation from './AppNavigation';

export default class App extends Component {
  state = { check: false, signed: false };


  componentWillMount() {
    this.getItem().then((resp) => {
      if (!resp)
        this.setState({ signed: false, check: true });
      else
        this.setState({ signed: true, check: true });
    }).catch((error) => {
      console.log('error===> ', error)
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
      let LoginInvalid = AppNavigation(false);
      return <LoginInvalid />;
    }
  }
}


