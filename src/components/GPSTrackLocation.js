//Home screen is where you can see tabs like GPS, ERP, Fuel Cards etc..

import React, { Component } from 'react';
import { View, ScrollView,Animated,DatePickerAndroid,StyleSheet,Platform,TouchableHighlight,BackHandler,Dimensions, ListView, FlatList, Text, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import CustomStyles from './common/CustomStyles';
import { ExpiryDateItems,TrackModal, CustomText } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CheckBox from 'react-native-checkbox';
import MapView, { Marker,Polyline } from 'react-native-maps';
import Utils from '../components/common/Utils';
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class GPSTrackLocation extends Component {
    state = {
        categoryBgColor: false,token:'',truckMakers:[],coordinates:[],
        showTrack:false,
        fromDate:'',
        fromPassdate:'',
        toDate:'',
        toPassdate:'',
        aspectRatio :0,
        latitudeDelta : 1,
        longitudeDelta : 1,        
        latitude: 17.46247,
        longitude: 78.3100319,
        animation : new Animated.Value(0),
        

    };

    componentWillMount() {
        const self = this;
        console.log(self.props,"GPSTrackLocation=token");
        this.getCredentailsData();
    }
        componentWillUnmount(){
         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }

        onBackAndroid() {
            //Actions.pop();
            //var value = await this.getCache('credientails');
           }

           async getCredentailsData() {
               const self  = this;
               const data = JSON.parse(self.props.navigation.state.params.sendingDate);
            this.getCache((value) => {
                if (value !== null) {
                    var egObj = {};
                    egObj = JSON.parse(value);
                    this.setState({ token: egObj.token });
                    Axios({
                        method: 'GET',
                        headers: { 'token': egObj.token },
                        url: Config.routes.base + Config.routes.gpsTrackLocation +"/"+data.truckId+"/"+data.startDate+"/"+data.endDate,
                        
                    })
                        .then((response) => {
                            if (response.data.status) {
                                console.log('truckMakers ==>', response.data);
                                if (response.data.results.length > 0) {
                                    var coordinateArr =[];
                                    const arrList = response.data.results;
                                    //arrList.length
                                    for (let index = 0; index < arrList.length; index++) {
                                        const element = arrList[index];
                                        coordinateArr.push({ latitude: element.location.coordinates[0], longitude:element.location.coordinates[1], strokeColor: '#F00' });
                                    }
                                    this.setState({coordinates:coordinateArr, loadSpinner: false},()=>{
                                        this.getView();
                                        console.log(this.state.coordinates, ' ==>>>')});
                                } else {
                                    let message ='';
                                    if (response.data)
                                    response.data.messages.forEach(function (current_value) {
                                        message = message + current_value;
                                    });
                                    Utils.ShowMessage(message);
                                }
                                this.setState({ loadSpinner: false })
    
                            } else {
                                console.log('error in trucksList ==>', response);
                                
                                this.setState({ loadSpinner: false })
                            }
                        }).catch((error) => {
                            console.log('error in trucksList ==>', error);
                        })
                } else {
                    this.setState({ loading: false })
                }
            }
            );
        }
        async getCache(callback) {
            try {
                var value = await AsyncStorage.getItem('credientails');
                console.log('credientails', value);
                if (value !== null) {
                    console.log('riyaz', value);
                } else {
                    console.log('value', value);
                }
                callback(value);
            }
            catch (e) {
                console.log('caught error', e);
                // Handle exceptions
            }
        }

    

    getParsedDate(date){
        var formattedDate = new Date(date);
        return formattedDate.getDay().toString() + "/" + formattedDate.getMonth().toString() + "/" + formattedDate.getFullYear().toString() +"  "+ formattedDate.getHours() +' : '+ formattedDate.getMinutes();
      }

      renderSeparator = () => (
        <View
          style={{
            backgroundColor: '#d6d6d6',
            height: 0,
          }}
        />
      );

    getName(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.fullName;
        }else{
            data =  '-';
        }
        return data;
    }

    getmobile(item){
        var data ='-';
        if(item.hasOwnProperty("attrs")){
            data = item.attrs.mobile;
        }else{
            data =  '-';
        }
        return data;
    }

    componentWillReceiveProps(nextProps){
        console.log('nextProps====',nextProps);
    }

    coordinate() {        
        //markers
        return this.state.markers.map((item,index)=>{           
            <Marker
            key={index}
            coordinate = {{
                latitude: item.coordinate.latitude,
                longitude: item.coordinate.longitude
            }}
            />
        });
    }
    lookingForLoad(items){
        var temparr=[];
        for (let index = 0; index < this.state.trucks.length; index++) {
            const element = this.state.trucks[index];
            if(items._id == element._id){
                if(element.rememberme){
                element.rememberme =false;                
               }else{
                element.rememberme =true;    
                }
                this.state.trucks[index] = element;
                this.setState({trucks:this.state.trucks});
                break;
            }
            
        }
    }
    markerClick(markerData) {
        console.log(markerData,'markerData');
        this.ShowModalFunction(!this.state.showTrack);
    }

    ShowModalFunction(visible) {
        this.setState({ showTrack: visible });
    }

    getView(){
        switch ('mapShow') {
            case 'mapShow':
                return(
                    <View style ={CustomStyles.mapcontainer}>
                        <MapView
                        style={CustomStyles.map}
                        zoomEnabled ={true}
                        >
                        <Polyline
                            coordinates={this.state.coordinates}
                            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                            // strokeColors={[
                            //     '#7F0000',
                            //     '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                            //     '#B24112',
                            //     '#E5845C',
                            //     '#238C23',
                            //     '#7F0000'
                            // ]}
                            strokeWidth={6}
                        />
                        
                        </MapView>
                  </View>
                );
                break;
                
            default:
                break;
        }
    }

    onPickdate(category) {
        const self = this;
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal, str: str, category: category })
        } else {
            try {
                const { action, year, month, day } = DatePickerAndroid.open({

                    //minDate: str == 'min'? new Date() :new Date('1-1-2007'),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        switch (category) {
                            case "fromDate":
                                this.setState({ fromDate: date, fromPassdate: month + "/" + response.day + "/" + response.year });
                                return;
                            break;
                            case "toDate":
                                this.setState({ toDate: date, toPassdate: month + "/" + response.day + "/" + response.year });
                                return;
                            break;
                            default:
                            return ;
                            break;
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    render() {
        const self=this;
        const { region } = this.props; 
        const {width, height} = Dimensions.get('window');         
        return(
                <View style={CustomStyles.viewStyle}>

                    {/* <View style={CustomStyles.erpCategory}> */}
                            {self.getView()}      
                        {/* </View> */}
                        <TrackModal 
                            visible={this.state.showTrack}  cancel={'cancel'}
                            onAccept={() => { this.ShowModalFunction(!this.state.showTrack) }}
                            onDecline={() => { this.ShowModalFunction(!this.state.showTrack) }}
                            onPickFromdate={()=>{this.onPickdate('fromDate') }}
                            onPickTodate={()=>{this.onPickdate('toDate') }}
                            frmDate = {this.state.fromDate}
                            toDate={this.state.toDate} />
                </View>
                
            );           
        }
      
    }
       
    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        scrollView: {
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          paddingVertical: 10,
        },
        endPadding: {
          paddingRight: width - CARD_WIDTH,
        },
        card: {
          padding: 10,
          elevation: 2,
          backgroundColor: "#FFF",
          marginHorizontal: 10,
          shadowColor: "#000",
          shadowRadius: 5,
          shadowOpacity: 0.3,
          shadowOffset: { x: 2, y: -2 },
          height: CARD_HEIGHT,
          width: CARD_WIDTH,
          overflow: "hidden",
        },
        cardImage: {
          flex: 3,
          width: "100%",
          height: "100%",
          alignSelf: "center",
        },
        textContent: {
          flex: 1,
        },
        cardtitle: {
          fontSize: 12,
          marginTop: 5,
          fontWeight: "bold",
        },
        cardDescription: {
          fontSize: 12,
          color: "#444",
        },
        markerWrap: {
          alignItems: "center",
          justifyContent: "center",
        },
        marker: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: "rgba(130,4,150, 0.9)",
        },
        ring: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "rgba(130,4,150, 0.3)",
          position: "absolute",
          borderWidth: 1,
          borderColor: "rgba(130,4,150, 0.5)",
        },
      });