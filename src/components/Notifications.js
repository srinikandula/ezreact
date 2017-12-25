import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import CustomStyles from './common/CustomStyles';
import Config from '../config/Config';
import { Actions } from 'react-native-router-flux';
import Axios from 'axios';

export default class Notifications extends Component {
    render() {
        return (
            <View style={[CustomStyles.viewStyle, { backgroundColor: '#ddd' }]}>
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