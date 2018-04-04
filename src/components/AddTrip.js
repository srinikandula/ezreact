import React, { Component } from 'react';
import {
    View, Image, Text, Picker, DatePickerAndroid, DatePickerIOS, Platform,NetInfo,
    TouchableOpacity, ScrollView, Keyboard, Dimensions, BackHandler
} from 'react-native';
import { CPicker,CustomInput, CSpinner, CustomEditText, CustomButton, CustomText, CommonBackground, Confirm } from './common';
import Config from '../config/Config';
import Axios from 'axios';
import CustomStyles from './common/CustomStyles';
import CheckBox from 'react-native-checkbox';
import Utils from './common/Utils';
import { NoInternetModal } from './common';
export default class AddTrip extends Component {

    state = {
        showModal: false,
        date: "",
        passdate: '',
        selectedVehicleId: '',
        selectedDriverId: '',
        tripPartyId: '',
        temptripPartyId: '',
        selectedlaneId: '',
        tempLaneID: '',
        Amount: '',
        remark: 'test',
        trucks: [],
        drivers: [],
        partyList: [{ name: 'Select Party', _id: '' }],
        lanesList: [{ name: 'Select Lane' }],
        share: true,
        rate: '',
        tonnage: '',
        famount: '',
        spinnerBool: false,
        accountId: '',
        netFlaf: false,
    };
    componentWillMount() {
        console.log("payment token", this.props.navigation.state.params.token);
        
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('isConnected',isConnected);
            if (isConnected) {
                this.setState({netFlaf:false});
                this.getDataList('trucks', Config.routes.base + Config.routes.trucksList);
			} else {
            return this.setState({netFlaf:true});
        }
    });

    }

    getDataList(calltype, url) {
        const types = calltype;
        Axios({
            method: 'get',
            headers: { 'token': this.props.navigation.state.params.token },
            url: url
        })
            .then((response) => {
                if (response.data.status) {
                    if (types === 'trucks') {
                        console.log('trucksList from add trip ==>', response.data.trucks);
                        this.setState({ trucks: response.data.trucks }, () => {
                            console.log('trucks array is  ', this.state.trucks);
                        });
                        this.getDataList('drivers', Config.routes.base + Config.routes.driverList);
                        return;
                    } else if (types === 'drivers') {
                        console.log('driversListfrom add trip ==>', response.data.drivers);
                        this.setState({ drivers: response.data.drivers }, () => {
                            console.log('drivers array in add trip  ', this.state.drivers);
                        });
                        this.getDataList('Party', Config.routes.base + Config.routes.partyList);
                        return;
                    } else {

                        for (let i = 0; i < response.data.parties.length; i++) {
                            this.state.partyList.push(response.data.parties[i]);
                        }

                        this.setState({ partyList: this.state.partyList }, () => {
                            console.log('party array isfrom add trip ', this.state.partyList);
                        });

                        if (this.props.navigation.state.params.edit) {
                            this.gettripDetails(this.props.navigation.state.params.id);
                        }
                    }
                } else {
                    console.log('error in add trip ==>', response);
                    this.setState({ partyList: [{ name: 'Select Party', _id: '' }] });
                    if (this.props.navigation.state.params.edit) {
                        this.gettripDetails(this.props.navigation.state.params.id);
                    }
                }


            }).catch((error) => {
                console.log('error in add partyList ==>', error);
            })
    }


    gettripDetails(TRIPID) {
        const self = this;
        self.setState({ spinnerBool: true });
        Axios({
            method: 'get',
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + Config.routes.getTripsDetails + TRIPID,

        })
            .then((response) => {
                console.log(TRIPID + '<--editTripAPI ==>', response.data);
                if (response.data.status) {
                    self.setState({ spinnerBool: false });
                    this.updateViewdate(response.data.trip);
                    this.updateLaneList(response.data.trip.partyId);//////////////////////////////////////////// added

                } else {
                    // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool: false });
                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                }
            }).catch((error) => {
                console.log('error in editTripAPI ==>', error);
            })
    }

    updateViewdate(paymentDetails) {
        const self = this;
        console.log("lanesList[i].name === paymentDetails.tripLane",self.state.lanesList,  "===" ,paymentDetails.tripLane)

        let trucksList = self.state.trucks;
        let driversList = self.state.drivers;
        let partiesList = self.state.partyList;
        let lanesList = self.state.lanesList;

        for (let i = 0; i < trucksList.length; i++) {
            if (trucksList[i]._id === paymentDetails.registrationNo) {
                self.setState({ truckText: trucksList[i].registrationNo })
            }
        }
        for (let i = 0; i < driversList.length; i++) {
            if (driversList[i]._id === paymentDetails.driverId) {
                self.setState({ driverText: driversList[i].fullName })
            }
        }
        for (let i = 0; i < partiesList.length; i++) {
            if (partiesList[i]._id === paymentDetails.partyId) {
                self.setState({ partiesText: partiesList[i].name })
            }
        }
        for (let i = 0; i < lanesList.length; i++) {
            console.log("lanesList[i].name === paymentDetails.tripLane",lanesList[i].name, "===" ,paymentDetails.tripLane)
            if (lanesList[i].name === paymentDetails.tripLane) {
                self.setState({ laneText: lanesList[i].name })
            }
        }

        var date = new Date(paymentDetails.date);
        var dateStr = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        var passdateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        //var amt = paymentDetails.amount.toString();
        this.setState({
            date: dateStr,
            passdate: passdateStr,
            selectedVehicleId: paymentDetails.registrationNo,
            selectedDriverId: paymentDetails.driverId,
            tripPartyId: paymentDetails.partyId,
            temptripPartyId: paymentDetails.partyId,
            selectedlaneId: paymentDetails.tripLane,
            tempLaneID: paymentDetails.tripLane,
            share: paymentDetails.share,
            rate: '' + paymentDetails.rate,
            tonnage: '' + paymentDetails.tonnage,
            famount: '' + paymentDetails.freightAmount,
            remark: paymentDetails.remarks,
            accountId: paymentDetails.accountId
        }, () => {

            console.log('party ID', paymentDetails.partyId, this.state.tripPartyId, this.state.selectedVehicleId, this.state.selectedDriverId);
        });
        this.updateLaneList(paymentDetails.partyId);
        this.getTruckNum(paymentDetails.registrationNo);
        this.getDriverName(paymentDetails.driverId);
        for (let index = 0; index < 10; index++) {
            this.moveInputLabelUp(index, "55")

        }

    }

    callAddTripAPI(postdata) {
        const self = this;
        self.setState({ spinnerBool: true });
        var methodType = 'post';
        var url = Config.routes.addTrip;
        if (this.props.navigation.state.params.edit) {
            methodType = 'put';
            url = Config.routes.getTripsDetails;
            postdata._id = self.props.navigation.state.params.id;
            postdata.accountId = self.state.accountId;
        }
        Axios({
            method: methodType,
            headers: { 'token': self.props.navigation.state.params.token },
            url: Config.routes.base + url,
            data: postdata
        })
            .then((response) => {
                console.log(postdata, '<--callAddtripAPI ==>', response.data);
                if (response.data.status) {

                    self.setState({ spinnerBool: false });
                    // Actions.pop();
                    const { navigation } = this.props;
                    const { state } = navigation;
                    let refreshFunc = state.params.refresh;
                    if (typeof refreshFunc === 'function') {
                        refreshFunc({ refresh: true });
                    }
                    this.props.navigation.goBack();
                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                } else {
                    // console.log('fail in forgotPassword ==>', response);
                    self.setState({ spinnerBool: false });
                    let message = "";
                    if (response.data)
                        response.data.messages.forEach(function (current_value) {
                            message = message + current_value;
                        });
                    Utils.ShowMessage(message);
                }
            }).catch((error) => {
                self.setState({ spinnerBool: false });
                //Actions.pop();
                console.log('error in callAddtripAPI ==>', error);
            })
    }

    onBackAndroid() {
        //  Actions.pop();
    }

    moveInputLabelUp(id, value) {
        this.setState({ ['field' + id]: { display: value === '' ? 'none' : 'flex' }, selectedName: value });
    }

    onPickdate() {
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal })
        } else {
            try {
                let currDate = new Date();
                if (this.props.navigation.state.params.edit) {
                    currDate = new Date(this.state.date);
                }
                const { action, year, month, day } = DatePickerAndroid.open({
                    date: new Date(),
                    //minDate: currDate.setDate(currDate.getDate() + 2),
                    minDate: currDate,
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        this.setState({ date: date, passdate: month + "/" + response.day + "/" + response.year });
                        this.moveInputLabelUp(0, date)

                    }
                }).catch((error) => {
                    console.log(error);
                });
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    onAccept() {
        if (this.state.date === '') {
            alert('Select a date');
        } else {
            this.setState({ showModal: false })
        }
    }

    onDecline() {
        this.setState({ field0: { bottom: 10 }, showModal: false, date: '' });

    }

    onSubmitTripDetails() {
        console.log('hi=====>', this.state.selectedVehicleId, this.state.selectedDriverId, this.state.tripPartyId, this.state.selectedlaneId);
        if (this.state.date.includes('/')) {
            if (!this.state.selectedVehicleId.includes("Select Vehicle")) {
                if (!this.state.selectedDriverId.includes("Select Driver")) {
                    if (this.state.tripPartyId.length > 0) {
                        if (this.state.selectedlaneId.length > 0) {
                            if (this.state.rate.length > 0) {
                                if (this.state.tonnage.length > 0) {
                                    if (this.state.famount.length > 0) {

                                        var lane = this.state.lanesList.filter(lane => lane.name === this.state.selectedlaneId);
                                        var date = new Date(this.state.passdate);
                                        var postData = {
                                            'date': date.toISOString(),
                                            'driverId': this.state.selectedDriverId,
                                            'partyId': this.state.tripPartyId,
                                            'registrationNo': this.state.selectedVehicleId,
                                            'freightAmount': Number(this.state.famount),
                                            'tripLane': lane[0],
                                            'tonnage': Number(this.state.tonnage),
                                            'rate': Number(this.state.rate),
                                            'remarks': this.state.remark,
                                            'share': this.state.share,
                                            'vechicleNo': this.state.vehicleNum,
                                            'driverName': this.state.driverName
                                        };

                                        console.log('postdata', postData);
                                        
                                        NetInfo.isConnected.fetch().then(isConnected => {
                                            console.log('isConnected',isConnected);
                                            if (isConnected) {
                                                this.setState({netFlaf:false});
                                                this.callAddTripAPI(postData);
                                            } else {
                                            return this.setState({netFlaf:true});
                                        }
                                    });
                                    } else {
                                        Utils.ShowMessage('Please Enter Frieght Amount');
                                    }
                                } else {
                                    Utils.ShowMessage('Please Enter Tonnage');
                                }
                            } else {
                                Utils.ShowMessage('Please Enter Rate');
                            }
                        } else {
                            Utils.ShowMessage('Please Select Lane ');
                        }
                    } else {
                        Utils.ShowMessage('Please Select Party Name');
                    }
                } else {
                    Utils.ShowMessage('Please Select Driver');
                }
            } else {
                Utils.ShowMessage('Please Select Vehicle');
            }
        } else {
            Utils.ShowMessage('Please  Select Date');
        }
    }

    spinnerLoad() {
        if (this.state.spinnerBool)
            return <CSpinner />;
        return false;
    }

    renderTrucksList() {
        return this.state.trucks.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.registrationNo}
                value={truckItem._id+"###"+truckItem.registrationNo}
            />
        );
    }

    renderDriverList() {
        return this.state.drivers.map((driverItem, i) =>
            <Picker.Item
                key={i}
                label={driverItem.fullName}
                value={driverItem._id+"###"+driverItem.fullName}
            />
        );
    }

    renderPartyList() {
        return this.state.partyList.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.name}
                value={truckItem._id+"###"+truckItem.name}
            />
        );
    }


    renderLaneList() {
        return this.state.lanesList.map((truckItem, i) =>
            <Picker.Item
                key={i}
                label={truckItem.name}
                value={truckItem.name+"###"+truckItem.name}
            />
        );
    }

    updateLaneList(itemValue) {
        const self = this;
//selectedlaneId

        if (itemValue.length <= 1) {
            return;
        }
        else {
            self.state.lanesList = [{ name: 'Select Lane' }];
            self.setState({ lanesList: self.state.lanesList });
            for (let i = 0; i < self.state.partyList.length; i++) {
                console.log('=====>>>>>>updateLaneList',self.state.partyList[i]._id,"===", itemValue);
                if (self.state.partyList[i]._id === itemValue) {
                    var lanearr = self.state.partyList[i].tripLanes;
                    console.log('<<<<<=====>>>>>>updateLaneList',self.state.partyList[i].tripLanes);
                    self.setState({ laneText: self.state.partyList[i].tripLanes[0].name });
                    for (let j = 0; j < lanearr.length; j++) {
                        var laneObj = lanearr[j];
                        if (laneObj.hasOwnProperty("name")) {
                            self.state.lanesList.push(laneObj);
                        }
                    }
                    self.setState({ lanesList: self.state.lanesList }, () => {
                        console.log('lanesList', self.state.lanesList);
                    });
                    break;
                }
            }

            if (self.props.navigation.state.params.edit) {

                setTimeout(function () {
                    self.setState({ tripPartyId: self.state.temptripPartyId, selectedlaneId: self.state.tempLaneID })
                }, 1000);
            }
        }

    }

    getDriverName(itemValue) {
        if (itemValue === 'Select Driver') {
            return '';
        }
        else {
            //console.log(this.state.drivers[index].fullName,' <--->driver name');
            //this.setState({driverName : this.state.drivers[index].fullName})
            for (let i = 0; i < this.state.drivers.length; i++) {
                if (this.state.drivers[i]._id === itemValue) {
                    this.setState({ driverName: this.state.drivers[i].fullName }, () => {
                        console.log('driverName', this.state.driverName);
                    })
                    break;
                }
            };
        }
    }
    getTruckNum(itemValue) {
        if (itemValue === 'Select Vehicle') {
            return '';
        }
        else {
            //console.log(this.state.trucks[index].registrationNo,' <--->registrationNo');
            //this.setState({vehicleNum : this.state.trucks[index].registrationNo})
            for (let i = 0; i < this.state.trucks.length; i++) {
                if (this.state.trucks[i]._id === itemValue) {
                    this.setState({ vehicleNum: this.state.trucks[i].registrationNo }, () => {
                        console.log('vehicleNum', this.state.vehicleNum);
                    })
                    break;
                }
            };
        }
    }



    updateFrieght() {
        var rateAmount = 0;
        var tonnageAmount = 0;
        if (this.state.rate.trim().length > 0) {
            rateAmount = this.state.rate.trim();
        }
        if (this.state.tonnage.trim().length > 0) {
            tonnageAmount = this.state.tonnage.trim();
        }
        if (rateAmount != 0 && tonnageAmount != 0) {
            var tempAmount = rateAmount * tonnageAmount;
            this.setState({ famount: '' + tempAmount });
            this.moveInputLabelUp(4, '' + tempAmount)
        }

    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 5, backgroundColor: '#1e4495', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Image
                            style={{ width: 20, marginLeft: 20 }}
                            resizeMode='contain'
                            source={require('../images/backButtonIcon.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: '#fff', paddingLeft: 20, fontFamily: 'Gotham-Light' }}>
                        ADD TRIP
                        </Text>
                </View>
                <View>
                    <ScrollView>
                        <View style={{ backgroundColor: '#ffffff', margin: 10, marginBottom: 40 }}>
                            {this.spinnerLoad()}
                            <TouchableOpacity
                                onPress={() => { this.onPickdate() }}
                            >
                                <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 5 }}>
                                            <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field0]}> Trip Date</CustomText>
                                            <CustomEditText underlineColorAndroid='transparent'
                                                editable={false}
                                                placeholder={'Trip Date'}
                                                inputTextStyle={{ marginHorizontal: 16 }}
                                                value={this.state.date} />

                                        </View>

                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../images/calanderLogo.png')} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}>Vehicle Number*</CustomText>
                                
                                <CPicker
                                    placeholder="Select  Vehicles"
                                    cStyle={{ marginLeft: 20, marginRight: 20, marginVertical: 7, width: 200, height: 150 }}
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.truckText}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ truckText: itemValue.split("###")[1], selectedVehicleId: itemValue.split("###")[0] /* selectedDriverId: itemValue */ })}>
                                     <Picker.Item label="Select Vehicle" value="Select Vehicle" />
                                    {this.renderTrucksList()}
                                </CPicker>
                               {/*  <Picker
                                    style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.selectedVehicleId}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.getTruckNum(itemValue);
                                        this.setState({ selectedVehicleId: itemValue })
                                    }}>
                                    <Picker.Item label="Select Vehicle" value="Select Vehicle" />
                                    {this.renderTrucksList()}

                                </Picker> */}
                            </View>

                            <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}>Driver Name*</CustomText>
                                
                                <CPicker
                                    placeholder="Select  Driver"
                                    cStyle={{ marginLeft: 20, marginRight: 20, marginVertical: 7, width: 200, height: 150 }}
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.driverText}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ driverText: itemValue.split("###")[1], selectedDriverId: itemValue.split("###")[0] /* selectedDriverId: itemValue */ })}>
                                    <Picker.Item label="Select Driver" value="Select Driver" />
                                    {this.renderDriverList()}

                                </CPicker>

                               {/*  <Picker
                                    style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.selectedDriverId}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.getDriverName(itemValue);
                                        this.setState({ selectedDriverId: itemValue })
                                    }}>
                                    <Picker.Item label="Select Driver" value="Select Driver" />
                                    {this.renderDriverList()}

                                </Picker> */}
                            </View>

                            <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}>Party Name*</CustomText>
                                <CPicker
                                    // placeholder="Select  Party"
                                    cStyle={{ marginLeft: 20, marginRight: 20, marginVertical: 7, width: 200, height: 150 }}
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.partiesText}
                                    onValueChange={(itemValue, itemIndex) => {this.updateLaneList(itemValue); this.setState({ partiesText: itemValue.split("###")[1], tripPartyId: itemValue.split("###")[0] /* selectedDriverId: itemValue */ })}}>
                                    <Picker.Item label="Select Party" value="Select Party" />
                                    
                                    {this.renderPartyList()}

                                </CPicker>
                               {/*  <Picker
                                    style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.tripPartyId}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.updateLaneList(itemValue);
                                        this.setState({ tripPartyId: itemValue })
                                    }}>

                                    {this.renderPartyList()}
                                </Picker> */}
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 15, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, bottom: 40, color: '#525252' }, this.state.field1]}> Lane*</CustomText>
                                <CPicker
                                    placeholder="Select  Lane"
                                    cStyle={{ marginLeft: 20, marginRight: 20, marginVertical: 7, width: 200, height: 150 }}
                                    // style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.laneText}
                                    onValueChange={(itemValue, itemIndex) => { this.setState({ laneText: itemValue.split("###")[1], selectedlaneId: itemValue.split("###")[0] /* selectedDriverId: itemValue */ })}}>
                                    {/* <Picker.Item label="Select Driver" value="Select Driver" /> */}
                                    
                                    {this.renderLaneList()}

                                </CPicker>
                                
                                {/* <Picker
                                    style={{ marginLeft: 12, marginRight: 20, marginVertical: 7 }}
                                    selectedValue={this.state.selectedlaneId}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectedlaneId: itemValue })
                                    }}>
                                    {this.renderLaneList()}
                                </Picker> */}
                            </View>
                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field2]}>Rate </CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    placeholder={'Rate'}
                                    keyboardType='numeric'
                                    inputTextStyle={{ marginHorizontal: 16 }} value={this.state.rate}
                                    onChangeText={(rate) => { this.moveInputLabelUp(2, rate); this.setState({ rate: rate.trim() }); this.updateFrieght() }} />
                            </View>

                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field3]}>Tonnage </CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    placeholder={'Tonnage'}
                                    keyboardType='numeric'
                                    inputTextStyle={{ marginHorizontal: 16 }} value={this.state.tonnage}
                                    onChangeText={(tonnage) => { this.moveInputLabelUp(3, tonnage); this.setState({ tonnage: tonnage.trim() }); this.updateFrieght() }} />
                            </View>

                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field4]}>Frieght Amount </CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    placeholder={'Frieght Amount'}
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    value={this.state.famount}
                                    onChangeText={(famount) => { this.moveInputLabelUp(4, famount), this.setState({ famount: famount.trim() }) }} />
                            </View>

                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>

                                <CustomText customTextStyle={[{ position: 'absolute', left: 20, top: 2, display: 'none', color: '#525252' }, this.state.field5]}>Description</CustomText>
                                <CustomEditText underlineColorAndroid='transparent'
                                    placeholder={'Description'}
                                    inputTextStyle={{ marginHorizontal: 16 }}
                                    value={this.state.remark}
                                    onChangeText={(remark) => { this.moveInputLabelUp(5, remark), this.setState({ remark: remark }) }} />
                            </View>

                            <View style={{ backgroundColor: '#ffffff', marginTop: 5, marginBottom: 5, marginHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ marginLeft: 15 }}>
                                    <CheckBox
                                        checkboxStyle={{ width: 15, height: 15 }}

                                        label='Share'
                                        color={'#000000'}
                                        checked={this.state.share}
                                        onChange={() => this.setState({ share: !this.state.share })}
                                    />
                                </View>

                            </View>



                        </View>
                    </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', bottom: 0, position: 'absolute', zIndex: 1 }}>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#dfdfdf", alignSelf: 'stretch' }}
                        onPress={() => { this.props.navigation.goBack() }}
                    >
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={{ padding: 15, alignSelf: 'center' }}>
                                CANCEL
                        </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#1e4495", alignSelf: 'stretch' }}
                        onPress={() => { this.onSubmitTripDetails() }}>
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={{ color: '#fff', padding: 15, alignSelf: 'center' }}>
                                SUBMIT
                        </Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <Confirm visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                    sayNo="CANCEL"
                    sayYes="CONFIRM"
                >
                    <View style={{ flex: 1, padding: 20 }}>
                        <DatePickerIOS
                            date={new Date()}
                            onDateChange={(pickedDate) => {
                                var month = pickedDate.getMonth() + 1
                                let date = pickedDate.getDate() + "/" + month + "/" + pickedDate.getFullYear();
                                this.setState({ date: date, passdate: month + "/" + pickedDate.getDate() + "/" + pickedDate.getFullYear() });
                                this.moveInputLabelUp(0, date)
                            }}
                            mode="date"
                        />
                    </View>
                </Confirm>
                <NoInternetModal visible={this.state.netFlaf} 
                                            onAccept={() => {this.setState({ netFlaf: false }) }}/>
            </View>

        );
    }
}