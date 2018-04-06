import React, { Component } from 'react';
import { View, Image, Platform, Button, Text, ScrollView, TouchableOpacity,Dimensions } from 'react-native';
import { StackNavigator, TabNavigator, TabView } from 'react-navigation';
import CustomStyles from './components/common/CustomStyles';

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

let changeState = true;

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
	AddGroup: {
		screen: AddGroup,
		navigationOptions: {
			headerTitle: 'ADD GROUP',
			headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
			headerStyle: { backgroundColor: '#1e4495' },
			headerTintColor: '#fff'
		}
	},

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
					GPS: {
						screen: GPSTruckList,
						navigationOptions: {
							headerStyle: { backgroundColor: 'red' }
						}
					},
					GPSMAp: {
						screen: GPSTruckMap,
						navigationOptions: {
							header: null
						}
					},
					GPSTrack: {
						screen: GPSTrackLocation,
						navigationOptions: {
							header: null
						}
					},
					GPSDistReport: {
						screen: DistanceReport,
						navigationOptions: {
							header: null
						}
					},
					SelectDriver: {
						screen: DriverSelectionList,
						navigationOptions: {
						}
					},
					GroupList: {
						screen: GroupsList,
						navigationOptions: {
							headerTitle: 'GROUPS',
							headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
							headerStyle: { backgroundColor: '#1e4495' },
							headerTintColor: '#fff'
						}
					},
					/* AddGroup: {
						screen: AddGroup,
						navigationOptions: {
							headerTitle: 'Add Group',
							headerTitleStyle: { fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },
							headerStyle: { backgroundColor: '#1e4495' },
							headerTintColor: '#fff'
						}
					}, */
					SubModule: {
						screen: TabNavigator({
							Dashboard: {
								screen: StackNavigator({
									ErpHome: {
										screen: ErpHome, navigationOptions: {
											headerMode: 'none',
											headerTitle: 'ERP',
											headerTintColor: '#fff',

											headerTitleStyle: { /* alignSelf: 'center', */ fontWeight: 'bold', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },

											// /* for disabling back button */										headerLeft: null,
											headerStyle: { backgroundColor: '#1e4495' },
											tabBarIcon: (<Image
												source={require('./images/tabExpenseIcon.png')}
												style={{ height: 30, width: 40 }}
												resizeMode='contain'

											/>)
										}
									},
									Erpcategory: {
										screen: ERPCategory,
										navigationOptions: {
											tabBarIcon: (<Image
												source={require('./images/tabExpenseIcon.png')}
												style={{ height: 30, width: 40 }}
												resizeMode='contain'

											/>)
										}
										
									},
									Erpsubcategory: {
										screen: ERPSubCategory,
										navigationOptions: {

										}
									},
									ExpiryDate: {
										screen: ExpiryDate,
										navigationOptions: {
											tabBarIcon: (<Image
												source={require('./images/tabExpenseIcon.png')}
												style={{ height: 30, width: 40 }}
												resizeMode='contain'

											/>)
										}
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
									headerTitle: 'DRIVERS DETAILS',
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
									headerTitle: 'PAYMENT DETAILS',
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
								allowFontScaling: false,
								...TabNavigator.Presets.AndroidTopTabs,
								tabBarOptions: {
									showIcon: true,
									scrollEnabled: true,
									upperCaseLabel: false,
									style: {
										backgroundColor: '#ffffff',
										shadowColor: '#ddd',
										shadowOffset: { width: 2, height: 3 },
										shadowOpacity: 0.7,
										shadowRadius: 2,
										elevation: 1,
									},
									labelStyle: {
										color: '#13346e',
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
				), navigationOptions: ({ navigation }) => ({
					headerStyle: { backgroundColor: '#1e4495' },
					tabBarIcon: (<TouchableOpacity onPress={() => {
						navigation.navigate('homepage');
					}}><Image
							source={require('./images/homeButton.png')}
							style={{ height: 25, width: 25, resizeMode: 'contain' }}
						/></TouchableOpacity>)
				}),



			},
			Settings: {
				screen: StackNavigator({
					TwoModules: {
						screen: TabNavigator({
							GPS: {
								screen: GpsSetting, navigationOptions: {
									headerTitle: 'SETTINGS',
									headerTitleStyle: { marginLeft:Platform.OS === 'ios'?-40: 20, alignSelf: 'flex-start',  fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },

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
									headerTitleStyle: { marginLeft:Platform.OS === 'ios'?-40: 20, alignSelf: 'flex-start',  fontWeight: '300', fontSize: 14, color: '#fff', fontFamily: 'Gotham-Light' },

									headerStyle: { backgroundColor: '#1e4495' },
									tabBarIcon: (<Image
										source={require('./images/gpsGrayIcon.png')}
										style={{ height: 25, width: 25, resizeMode: 'contain' }}
									/>)
								},
							},
						}, {
							// ...TabNavigator.Presets.AndroidTopTabs,
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
									tabStyle: CustomStyles.settingsTabStyle,
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
						height: Platform.OS === 'ios' ? 70 : null,
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