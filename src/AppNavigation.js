import React, { Component } from 'react';
import { View, Image,Platform,Button, Text,ScrollView,TouchableOpacity } from 'react-native';
import { StackNavigator, TabNavigator ,TabView} from 'react-navigation';

//login related screens
import Login from './components/Login';
import ForgotPin from './components/ForgotPin';
import OtpVerification from './components/OtpVerification';

import modulesHome from './components/ModulesHome';

//erp module screens
import ErpHome from './components/ErpHome';
import DriverList from './components/DriverList';
import PartyList from './components/PartyList';
import TruckList from './components/TruckList';
import PaymentList from './components/PaymentList';
import ExpenseList from './components/ExpenseList';
import TripList from './components/TripList';
//BOTTOM navigation
import GpsSetting from './components/GpsSetting';
import ReportsSetting from './components/ReportsSetting';
import Profile from './components/Profile';
import Notifications from './components/Notifications';

//adding Element
import AddDriver from './components/AddDriver';
import AddParty from './components/AddParty';
import AddPayment from './components/AddPayment';
import AddTruck from './components/AddTruck';
import AddTrip from './components/AddTrip';
import AddExpense from './components/AddExpense';

import ERPCategory from './components/ERPCategory';
import ERPSubCategory from './components/ERPSubCategory';
import ExpiryDate from './components/ExpiryDate';
import ModulesHome from './components/ModulesHome';
import GPSTruckList from './components/GPSTruckList';
import GPSTruckMap from './components/GPSTruckMap';
import AddGroup from './components/AddGroup';
import DriverSelectionList from './components/DriverSelectionList';
import GroupsList from './components/GroupsList';
import GPSTrackLocation from './components/GPSTrackLocation';
import DistanceReport from './components/DistanceReport';

class FooterTabs extends Component {
	state ={changeState:true};
	render () {
		console.log('all props',this.props);
	  return (
		<View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', paddingVertical: 10 }}>
                    <ScrollView horizontal>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('GPS')}}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('./images/gpsIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Gps</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity /* navigation={this.props.navigation} */ onPress={() => this.props.navigation.navigate('SubModule')}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('./images/erpTruckIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Erp</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('./images/fuelCardIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Fuel Card</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('./images/tollCardIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Toll Card</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                <Image
                                    source={require('./images/loadsIcon.png')}
                                    resizeMode='contain'
                                    style={{ width: 40, height: 30 }}
                                />
                                <Text style={{ fontSize: 14, fontFamily: 'Gotham-Medium', color: '#4c69a9' }}>Loads</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                    <Text>
                        Landing Screen
                        </Text>
                    </View>
            </View>
	  )
	}
  }
let changeState= true;
//global navigator===> stack navigator
export default AppNavigation = (loginStatus) => StackNavigator({
	login: { screen: Login, navigationOptions: { header: null } },
	forgotpin: { screen: ForgotPin, navigationOptions: { header: null } },
	otpverification: { screen: OtpVerification, navigationOptions: { header: null } },
	AddDriver: {
		screen: AddDriver,
		navigationOptions: {
			headerTitle: 'Add Driver',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},
	AddTruck: {
		screen: AddTruck,
		navigationOptions: {
			headerTitle: 'Add Truck',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},
	AddExpense: {
		screen: AddExpense,
		navigationOptions: {
			headerTitle: 'Add Expense',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},
	AddParty: {
		screen: AddParty,
		navigationOptions: {
			headerTitle: 'Add Party',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},
	AddPayment: {
		screen: AddPayment,
		navigationOptions: {
			headerTitle: 'Add Payment',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},
	AddTrip: {
		screen: AddTrip,
		navigationOptions: {
			headerTitle: 'Add Trip',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},
	/*AddGroup: {
		screen: AddGroup,
		navigationOptions: {
			headerTitle: 'Add Group',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
},*/

	homepage: {
		screen: TabNavigator({
			Home: {
				screen: StackNavigator({
					MainModule: {
						screen: ModulesHome, navigationOptions: {
							headerLeft: null,
							headerTitle: (<Image
								source={require('./images/whiteLogo.png')}
								style={{ width: 95, alignSelf: 'center' }}
								resizeMode='contain'
							/>),
							headerStyle: { backgroundColor: '#1e4495' },
							tabBarIcon: (<Image
								source={require('./images/homeButton.png')}
								style={{ height: 30, width: 40 }}
								resizeMode='contain'

							/>),
						},
					},
					/* Erpcategory:{
						screen: ERPCategory,
						navigationOptions: {
						}
					}, */
					GPS:{
						screen: GPSTruckList,
						navigationOptions: {
							headerStyle:{backgroundColor:'red'}
						}
					},
					GPSMAp:{
						screen: GPSTruckMap,
						navigationOptions: {
							header:null
						}
					},
					GPSTrack:{
						screen:GPSTrackLocation,
						navigationOptions: {
							header:null
						}
					},
					GPSDistReport:{
						screen:DistanceReport,
						navigationOptions: {
							header:null
						}
					},
					SelectDriver:{
						screen:DriverSelectionList,
						navigationOptions: {
						}
					},
					GroupList:{
						screen:GroupsList,
						navigationOptions: {
						}
					},
					AddGroup: {
						screen: AddGroup,
						navigationOptions: {
							headerTitle: 'Add Group',
							headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
							headerStyle: { backgroundColor: '#1e4495' },
							headerTintColor: '#fff'
						}
					},
					SubModule: {
						screen: TabNavigator({
							Dashboard: {
								screen: StackNavigator({
									ErpHome: {
										screen: ErpHome, navigationOptions: {
											headerMode: 'none',
											headerTitle: 'DASHBOARD',
											headerTintColor: '#fff',
											
											headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },

											// /* for disabling back button */										headerLeft: null,
											headerStyle: { backgroundColor: '#1e4495' },
											tabBarIcon: (<Image
												source={require('./images/revenue.png')}
												style={{ height: 30, width: 40 }}
												resizeMode='contain'

											/>)
										}
									},
									Erpcategory: {
										screen: ERPCategory,
										navigationOptions: {

										}
									},
									Erpsubcategory: {
										screen: ERPSubCategory,
										navigationOptions: {

										}
									},
									ExpiryDate: {
										screen: ExpiryDate
									}

								}, {
										headerMode: 'none',

									})
							},
							Trucks: {
								screen: TruckList, navigationOptions: {
									headerTitle: 'TRUCKS',
									headerTintColor: '#fff',
									
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/tabTruckIcon.png')}
										style={{ height: 30, width: 40 }}
										resizeMode='contain'
									/>)
								}
							},
							Drivers: {
								screen: DriverList, navigationOptions: {
									headerTitle: 'DRIVERS',
									headerTintColor: '#fff',
									
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/tabDriverIcon.png')}
										style={{ height: 30, width: 40 }}
										resizeMode='contain'
									/>)
								}
							},
							Parties: {
								screen: PartyList, navigationOptions: {
									headerTitle: 'PARTYS',
									headerTintColor: '#fff',
									
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/tabPartyIcon.png')}
										style={{ height: 30, width: 40 }}
										resizeMode='contain'
									/>)
								}
							},
							Payments: {
								screen: PaymentList, navigationOptions: {
									headerTitle: 'PAYMENTS',
									headerTintColor: '#fff',
									
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/tabPaymentIcon.png')}
										style={{ height: 30, width: 40 }}
										resizeMode='contain'
									/>)
								}
							},
							Expenses: {
								screen: ExpenseList, navigationOptions: {
									headerTitle: 'EXPENSES',
									headerTintColor: '#fff',
									
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/tabExpenseIcon.png')}
										style={{ height: 30, width: 40 }}
										resizeMode='contain'
									/>)
								}
							},
							Trips: {
								screen: TripList, navigationOptions: {
									headerTitle: 'TRIPS',
									headerTintColor: '#fff',
									
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/tabTripIcon.png')}
										style={{ height: 30, width: 40 }}
										resizeMode='contain'
									/>)
								}
							},
						},
							{
								tabBarPosition: 'top',
								showIcon: true,
								animationEnabled: true,
								swipeEnabled: true,
								scrollEnabled: true,
								allowFontScaling: true,
								...TabNavigator.Presets.AndroidTopTabs,
								tabBarOptions: {
									showIcon: true,
									scrollEnabled: true,
									upperCaseLabel: false,
									style: {
										backgroundColor: '#ffffff',
									},
									labelStyle: {
										color: '#4c69a9',
										fontSize: 14,
										fontFamily: 'Gotham-Book',
										margin: 0
									},
									tabStyle: {
										margin: 0,
										
									},
									indicatorStyle: {
										backgroundColor: 'black',
										width: 105,
										marginLeft: 20
									},
									iconStyle: {
										width: 80, height: 40
									}
								}
							}
						), navigationOptions: {
							headerStyle: { backgroundColor: '#1e4495' },
							tabBarIcon: (<Image
								source={require('./images/homeButton.png')}
								style={{ height: 30, width: 30, resizeMode: 'contain' }}
							/>)
						}
					},
				}, {
						// headerMode: 'none'
					}
				), navigationOptions: {
					headerStyle: { backgroundColor: '#1e4495' },
					tabBarIcon: (<Image
						source={require('./images/homeButton.png')}
						style={{ height: 25, width: 25, resizeMode: 'contain' }}
					/>)
				},

			},
			Settings: {
				screen: StackNavigator({
					TwoModules:{
						screen: TabNavigator({
							GPS: {
								screen: GpsSetting, navigationOptions: {
									headerTitle: 'SETTINGS',
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/gpsGrayIcon.png')}
										style={{ height: 25, width: 25, resizeMode: 'contain' }}
									/>)
								}
							},
							SetReports: {
								screen: ReportsSetting, navigationOptions: {
									headerTitle: 'SETTINGS',
									headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
									
									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/gpsGrayIcon.png')}
										style={{ height: 25, width: 25, resizeMode: 'contain' }}
									/>)
								},
							},
						}, {
								tabBarPosition: 'top',
								// swipeEnabled: true,
								// scrollEnabled: false,
								// allowFontScaling: true,
								tabBarOptions: {
									showIcon: true,
									animationEnabled: false,
									swipeEnabled: false,
									scrollEnabled: true,
									upperCaseLabel: false,
									style: {
										backgroundColor: '#ffffff',
									},
									tabStyle: {
										flexDirection: 'row',
										justifyContent: 'center'
									},
									labelStyle: {
										marginLeft: 20,
										color: '#4c69a9',
										fontSize: 14,
										fontFamily: 'Gotham-Book',
									},
									indicatorStyle: {
										backgroundColor: 'black',
									},
								}
							}
						), navigationOptions: {
							tabBarIcon: ({ tintColor }) => (<Image
								source={require('./images/settingsButton.png')}
								style={[{ height: 25, width: 25, resizeMode: 'contain' }, { tintColor: tintColor }]}
		
							/>)
						}
					}
				})
			},
			Profile: {
				screen: Profile,
				navigationOptions: {
					header: null,
					tabBarIcon: ({ tintColor }) => (<Image
						source={require('./images/profileButton.png')}
						style={[{ height: 25, width: 25, resizeMode: 'contain' }, { tintColor: tintColor }]}

					/>)
				},
			},
			Notifications: {
				screen: Notifications,
				navigationOptions: {
					tabBarIcon: ({ tintColor }) => (<Image
						source={require('./images/notificationButton.png')}
						style={[{ height: 25, width: 25, resizeMode: 'contain' }, { tintColor: tintColor }]}

					/>)
				},
			}
		}, {
				tabBarPosition: 'bottom',
				showIcon: true,
				allowFontScaling: true,
				tabBarOptions: {
					activeTintColor: '#e83b13',
					inactiveTintColor: '#000',
					swipeEnabled: false,
					animationEnabled: false,
					showIcon: true,
					activeTintColor: '#e91e63',
					upperCaseLabel: false,
					style: {
						height: Platform.OS === 'ios'?70:null,
						borderTopColor: '#ddd',
						borderTopWidth: 1,
						backgroundColor: '#ffffff',
					},
					labelStyle: {
						fontSize: 13,
						fontFamily: 'Gotham-Book',
						margin: 0
					},
					indicatorStyle: {
						display: 'none',
					},
					iconStyle: {
						width: 60, height: 40
					},
					tabStyle: {
						padding: 0,
						paddingBottom: 5,
						margin: 0,
					},
				}
			}
		)
	}
}, {
		headerMode: 'none',
		initialRouteName: loginStatus ? 'homepage' : 'login'
	}
)


/* import {
	AsyncStorage,
	Icon,
	TouchableOpacity,
	ToastAndroid,
	StatusBar,
	Text, Image,
	View,
	StyleSheet,
	PixelRatio
} from 'react-native';
import { Actions,Router, Stack, Scene } from 'react-native-router-flux';
import Login from './components/Login';
import Notifications from './components/Notifications';
import ForgotPin from './components/ForgotPin';
import OtpVerification from './components/OtpVerification';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import GpsSetting from './components/GpsSetting';
import SplashScreen from 'react-native-splash-screen';
import HomeScreen from './components/HomeScreen';
import Trucks from './components/Trucks';
import ErpHome from './components/ErpHome';
import CustomStyles from './components/common/CustomStyles';
import ERPCategory from './components/ERPCategory';
import ERPSubCategory from './components/ERPSubCategory';
import ExpiryDate from './components/ExpiryDate';
import DriverList from './components/DriverList';
import PartyList from './components/PartyList';
import TruckList from './components/TruckList';
import AddDriver from './components/AddDriver';
import PaymentList from './components/PaymentList';
import ExpenseList from './components/ExpenseList';
import TripList from './components/TripList';
import AddParty from './components/AddParty';
import AddPayment from './components/AddPayment';
import AddTruck from './components/AddTruck';
import AddTrip from './components/AddTrip';
import AddExpense from './components/AddExpense';

class TabIcon extends Component {
	render() {
		var color = this.props.selected ? 'red' : 'black';
		return (
			<View style={{ flex: 1 }}>

				{/* <Text> {this.props.title}</Text> }
			</View>
		);
	}
}

export default class Navigation extends Component {
	state = { logged: false, loading: true, value: {},
	selectedTab: {
		noteTab: false,
		profTab: false,
		settTab: false,
		homeTab: false
	}
	, headerTitle: 'ErpHome', };

	componentWillMount() {
		this.getCredentailsData();
		SplashScreen.hide();
	};

	async getCredentailsData() {
		this.getCache((value) => {
			if (value !== null) {
				this.setState({ logged: true, loading: false, value: value });
			} else {
				this.setState({ loading: false })
			}
		}
		);
	}

	async getCache(callback) {
		try {
			var value = await AsyncStorage.getItem('credientails');
			callback(value);
		}
		catch (e) {
			console.log('riyaz');
			console.log('caught error', e);
			// Handle exceptions
		}
	}

	tabStatus(tab, headerTitle) {
		let selectedTab = this.state.selectedTab;
		for (key in selectedTab) {
			if (key === tab) {
				selectedTab[key] = true;
			} else {
				selectedTab[key] = false;
			}
		}
		console.log('selectedTab', selectedTab)
		this.setState({ selectedTab, headerTitle });
	}

	renderGlobalTabs() {
		return (
			<View style={CustomStyles.globalTabs}>
				<TouchableOpacity
					onPress={() => {
						this.tabStatus("homeTab", 'ErpHome');
						Actions.ErpHome();
					}}
				>
					<View style={CustomStyles.homeButtonContainer}>
						<Image
							resizeMode="contain"
							style={CustomStyles.globalTabsIcon}
							source={require('./images/homeButton.png')}
						/>
						<Text style={{ color: this.state.selectedTab.homeTab ? '#e6412e' : '#4a4a4a' }}>
							Home
				</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this.tabStatus("settTab", 'Settings');
						Actions.tab2();
					}}
				>
					<View style={CustomStyles.homeButtonContainer}>
						<Image
							resizeMode="contain"
							style={CustomStyles.globalTabsIcon}
							source={require('./images/settingsButton.png')}
						/>
						<Text style={{ color: this.state.selectedTab.settTab ? '#e6412e' : '#4a4a4a' }}>
							Settings
				</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this.tabStatus("profTab", 'Profile');
						Actions.tab3()
					}}
				>
					<View style={CustomStyles.homeButtonContainer}>
						<Image
							resizeMode="contain"
							style={CustomStyles.globalTabsIcon}
							source={require('./images/profileButton.png')}
						/>
						<Text style={{ color: this.state.selectedTab.profTab ? '#e6412e' : '#4a4a4a' }} >
							Profile
				</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						this.tabStatus("noteTab", "Notifications");
						Actions.tab4()
					}}
				>
					<View style={CustomStyles.homeButtonContainer}>
						<Image
							resizeMode="contain"
							style={CustomStyles.globalTabsIcon}
							source={require('./images/notificationButton.png')}
						/>
						<Text style={{ color: this.state.selectedTab.noteTab ? '#e6412e' : '#4a4a4a' }}>
							Notifications
				</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	render() {
		if (this.state.loading) {
			return null;
		}
		return (
			<View style={{ flex: 1 }}>
			<View style={{ display: this.state.headerTitle === 'ErpHome' ? 'none' : 'flex', height: 50, backgroundColor: '#1e4495', justifyContent: 'center' }}>
				<Text style={{ alignSelf: 'center', color: '#ffffff', fontSize: 18 }}>
					{this.state.headerTitle}
				</Text>
			</View>
			<Router >
				<Scene key="root">
					<Scene key="Login"
						component={Login}
						hideNavBar={true} initial={!this.state.logged}
					/>

					<Scene key="ForgotPin"
						component={ForgotPin}
						hideNavBar={true}
					/>
					<Scene key="OtpVerification"
						component={OtpVerification}
						hideNavBar={true}
					/>
					<Scene key="ResetPassword"
						component={ResetPassword}
						hideNavBar={true}

					/>

					<Scene key="AddTruck"
						component={AddTruck}
						title="Add Truck"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>
					<Scene key="AddDriver"
						component={AddDriver}
						title="Add Driver"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>



					<Scene key="AddParty"
						component={AddParty}
						title="Add Party"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>

					<Scene key="AddPayment"
						component={AddPayment}
						title="Add Payment"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>

					<Scene key="AddTrip"
						component={AddTrip}
						title="Add Trip"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>
					<Scene key="AddExpense"
						component={AddExpense}
						title="Add Expense"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>



					<Scene key='tab3' activeTintColor='cyan' hideNavBar title='Profile'
							component={Profile} />
						<Scene key='tab4' activeTintColor='cyan' hideNavBar title='Notifications' component={Notifications} />
					
					<Scene key='root' tabs={true} tabBarStyle={styles.tabBar} default="tab3"
						tabBarPosition='bottom' swipeEnabled={false}>
						<Scene key='tab1' activeTintColor='red' showIcon={true} hideNavBar title='Home'
							component={Login} icon={TabIcon} />

						<Scene key='tab2' headerMode="float" tabs={true} title='Setting'
							indicatorStyle={styles.indicatorStyle}
							tabBarStyle={styles.settingtabBar}
							titleStyle={styles.navTitle}
							default="gps"
							activeTintColor="#000000"
							inactiveTintColor="#000000"
							tabBarPosition='top'
							swipeEnabled={true}>
							<Scene key='gps' headerMode="float" duration={1}
								title='Setting'
								component={GpsSetting} />
							<Scene key='reports' headerMode="float" duration={1}
								hideNavBar title='Reports'
								component={Login} />
						</Scene>

						
					</Scene>
					<Scene key='erp' headerMode="float" wrap={false} tabs={true} default="Trips"
						tabBarPosition="top"  swipeEnabled={true}  initial={this.state.logged}>
						<Scene key='ErpHome' title='ErpHome' headerMode="float" component={ErpHome} />
						<Scene key='Trucks' title='Trucks' headerMode="float" component={TruckList}
						/>
						<Scene key='Drivers' title='Drivers' headerMode="float" component={DriverList}
							screenProps={this.state.value} />
						<Scene key='Partys' title='Partys' headerMode="float" component={PartyList} />
						<Scene key='Payments' title='Payments' headerMode="float" component={PaymentList} />
						<Scene key='Expenses' title='Expenses' headerMode="float" component={ExpenseList} />
						<Scene key='Trips' title='Trips' headerMode="float" component={TripList} />
					</Scene>
					<Scene key='erpcategory'>
						<Scene key='category' component={ERPCategory} hideNavBar={false} />
					</Scene>
					<Scene key='erpsubcategory'>
						<Scene key='subcategory' component={ERPSubCategory} hideNavBar={false} />
					</Scene>
					<Scene key='erpExpiryDate' >
						<Scene key='erpExpiryDate' component={ExpiryDate} hideNavBar={false} />
					</Scene>
				</Scene>
			</Router>
			<View style={{
				display: this.state.logged ? 'flex' : 'none',
				justifyContent: 'flex-end'
			}}>
				{this.renderGlobalTabs()}
			</View> 
			</View >
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tabBar: {
		borderTopColor: 'darkgrey',
		borderTopWidth: 1 / PixelRatio.get(),
		backgroundColor: 'ghostwhite',
		opacity: 0.98
	},
	settingtabBar: {
		borderTopColor: 'darkgrey',
		borderTopWidth: 1 / PixelRatio.get(),
		backgroundColor: 'ghostwhite',
		opacity: 0.98,
	},
	indicatorStyle: {
		backgroundColor: '#000000'
	},
	navigationBarTitleStyle: {
		color: 'white',
	},

	navigationBarStyle: {
		backgroundColor: 'red',
	},
	navTitle: {
		color: 'black', // changing navbar title color
	},
	tabGPSBar: {
		borderTopColor: 'red',
		borderTopWidth: 1 / PixelRatio.get(),
		backgroundColor: 'ghostwhite',
		opacity: 0.98
	},
}); */