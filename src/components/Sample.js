//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View,BackHandler, ScrollView,Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import {ExpiryDateItems} from  './common';
import Config from '../config/Config';
import Router from '../Router';
import {Actions,Reducer} from 'react-native-router-flux';
import Axios from 'axios';
const category = [
    {
        'name': 'Revenue',
        'subname': 'From all vehicles',
        'amount': 1000000,
        'imagepath': '../images/revenue.png'
    }]

export default class ErpHome extends Component {
    render(){
        return(
            <Router/>
        );
    }
}