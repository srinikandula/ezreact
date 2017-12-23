// from index.js this is where you land

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, AsyncStorage } from 'react-native';
//import Router from './Router';
import {withNavigation} from 'react-navigation';
import CustomStyles from './common/CustomStyles';
import {MainNavigation} from '../AppNavigation';
//import MainNavigation from '../MainNavigation';

 export default class MainScreen extends Component {
  state = { headerTitle: '' };
  renderGlobalTabs() {
    return (
      <View style={CustomStyles.globalTabs}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ headerTitle: 'ErpHome' })
            this.props.navigation.navigate('ErpHome');
          }}
        >
          <View style={CustomStyles.homeButtonContainer}>
            <Image
              resizeMode="contain"
              style={CustomStyles.globalTabsIcon}
              source={require('../images/homeButton.png')}
            />
            <Text>
              Home
			</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('props', this.props.navigation.navigate)
            this.setState({ headerTitle: 'Settings' })
            this.props.navigation.navigate('SettingsTab');
          }}
        >
          <View style={CustomStyles.homeButtonContainer}>
            <Image
              resizeMode="contain"
              style={CustomStyles.globalTabsIcon}
              source={require('../images/settingsButton.png')}
            />
            <Text>
              Settings
			</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({ headerTitle: 'Profile' })
            // Actions.tab3()
          }}
        >
          <View style={CustomStyles.homeButtonContainer}>
            <Image
              resizeMode="contain"
              style={CustomStyles.globalTabsIcon}
              source={require('../images/profileButton.png')}
            />
            <Text>
              Profile
			</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({ headerTitle: 'Notifications' })
            // Actions.tab4()
          }}
        >
          <View style={CustomStyles.homeButtonContainer}>
            <Image
              resizeMode="contain"
              style={CustomStyles.globalTabsIcon}
              source={require('../images/notificationButton.png')}
            />
            <Text>
              Notifications
			</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } 
  render(){
        return  <View style={{flex: 1}}>
        <View style={{flex:1,justifyContent: 'flex-end'}}>
        <MainNavigation style={{flex:1}}/>
        {this.renderGlobalTabs()}
            </View>
        </View>
  }

}