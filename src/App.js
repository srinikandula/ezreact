// from index.js this is where you land

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Router from './Router';
import HomeScreen from './components/HomeScreen';

export default class App extends Component {
  render() {
    return (
      <Router/>
    );
  }
}


