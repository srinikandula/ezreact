//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { ActivityIndicator,View, ScrollView, BackHandler, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems,CSpinner, CustomText } from './common';
import Config from '../config/Config';
import { Actions, Reducer } from 'react-native-router-flux';
import Axios from 'axios';

export default class ExpiryDate extends Component {

    state = {
        categoryBgColor: false,
        itemIndex:0,
        lookFor:'',
        label:'',
        spinnerBool: false,
        data: [ ],
        trucks: [],
        count: 0
    };
    componentWillMount() {
        const self = this;
        this.callExpiryAPI(self.props.baseExpiry);
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
    }

    onBackAndroid() {
        //Actions.pop();
        //var value = await this.getCache('credientails');
    }

 
    callExpiryAPI(data){
        this.setState({label : data});
        switch (data) {
            case "Insurance":
                this.setState({lookFor:'insuranceExpiry'});
                console.log("Insurance", data);
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.insuranceExpiryTrucks);
                break;
            case "Pollution":
                console.log("Pollution", data);
                this.setState({lookFor:'pollutionExpiry'});
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.pollutionExpiryTrucks);
                break;
            case "Fittness":
                console.log("Fittness", data);
                this.setState({lookFor:'fitnessExpiry'});
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.fitnessExpiryTrucks);
                break;
            case "Tax":
                console.log("Tax", data);
                this.setState({lookFor:'taxDueDate'});
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.taxExpiryTrucks);
                break;
            case "Permit":
                console.log("Permit", data);
                this.setState({lookFor:'permitExpiry'});
                this.callExpiryBaseAPI(Config.routes.base + Config.routes.permitExpiryTrucks);
                break;

            default:
                text = "I have never heard of that fruit...";
        }

    }

    callExpiryBaseAPI(Url){
        const self = this;
        self.setState({ spinnerBool:true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.token },
            url: Url
        })
            .then((response) => {
                console.log('expiry ==>', response.data);
                if (response.data.status) {
                    self.setState({
                        trucks: response.data.trucks
                    });
                    self.setState({ spinnerBool:false });
                } else {
                    console.log('error in ExpiryDate ==>', response);
                    self.setState({ spinnerBool:false });
                }
                var datad= [
                    {
                        id:'1',
                        selectedItem: true,
                        title: "Permit"
                    },
                    {
                        id:'2',
                        selectedItem: false,
                        title: "Tax"
                    },
                    {
                        id:'3',
                        selectedItem: false,
                        title: "Insurance"
                    },
                    {
                        id:'4',
                        selectedItem: false,
                        title: "Pollution"
                    },
                    {
                        id:'5',
                        selectedItem: false,
                        title: "Fittness"
                    }
                ];
                this.setState({data:datad});
            }).catch((error) => {
                console.log('error in ExpiryDate ==>', error);
            })
    }


    callSubCategoryScreen(item) {
        console.log(item, ' --->');
        var data = this.state.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i].id == item.id) {
                data[i].selectedItem = true;
                this.callExpiryAPI( data[i].title);
            } else {
                data[i].selectedItem = false;
            }
        }
        var data = this.state.data;
        this.setState({itemIndex:this.state.data.indexOf(item),data:data});
    }


    renderItem(item) {
        if (this.state.data.indexOf(item) == this.state.itemIndex) {
            //console.log('in if', item.title);
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item)}>
                    <View style={{flexDirection: 'row', padding: 5 }}>
                        <Text style={CustomStyles.epirySelectedButtons}>
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            //console.log('in else', item.title);
            return (
                <TouchableOpacity onPress={() => this.callSubCategoryScreen(item)}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', padding: 5 }}>
                        <Text style={CustomStyles.epiryButtons}>
                            {item.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    getParsedDate(item) {
        var date = item[this.state.lookFor];
        //console.log('date-riyaz',date,item[this.state.lookFor]);
        var formattedDate = new Date(date);
        if (true) {
            return (
                <Text style={[CustomStyles.erpSubCatText, { color: 'red' }]}>
                    {formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString()
                    }
                </Text>);
        } else {
            return (
                <Text style={[CustomStyles.erpSubCatText, { color: 'yellow' }]}>
                    {formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getYear().toString()
                    }
                </Text>);
        }
    }

    functiona(date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var today = new Date();
        // Convert both dates to milliseconds
        var date1_ms = today.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner/>;
        return false;
    }
    
    render() {
        const self = this;
        return (
            <View style={CustomStyles.viewStyle}>
            {this.spinnerLoad()}
                <View style={[CustomStyles.erpexpiryCategory, { flex: 1 }]}>
                    <View style={{ alignSelf: 'stretch' }}>
                        <FlatList
                            horizontal={true}
                            data={this.state.data}
                            renderItem={({item}) => this.renderItem(item)}
                            keyExtractor={(item, index) => index}
                            extraData={this.state.data}
                            selected={this.state.categoryBgColor}
                        />
                    </View>
                    <View style={{ alignSelf: 'stretch', flex: 1 }}>

                    <Text style={CustomStyles.headText}>{this.state.label} Details</Text>
                        
                        <View style={CustomStyles.erpCategoryHeaderItems}>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>S.No</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>V.No</Text>
                            </View>
                            <View style={CustomStyles.erpTextView}>
                                <Text style={CustomStyles.erpHeaderText}>Expiry Date</Text>
                            </View>
                        </View>
                        <View style={{ alignSelf: 'stretch', flex: 1 }}>
                            <FlatList style={{ alignSelf: 'stretch', flex: 1 }}
                                data={this.state.trucks}
                                renderItem={({ item }) =>
                                    <View style={CustomStyles.erpCategoryItems}>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={[CustomStyles.erpText, { fontWeight: 'bold' }]}>{this.state.trucks.indexOf(item) + 1}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            <Text style={CustomStyles.erpText}>{item.registrationNo}</Text>
                                        </View>
                                        <View style={CustomStyles.erpTextView}>
                                            {this.getParsedDate(item)}
                                        </View>
                                    </View>
                                }
                                keyExtractor={(item, index) => index} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }


}
