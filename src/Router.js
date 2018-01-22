import React, { Component } from 'react';
import {
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
import ReportsSetting from './components/ReportsSetting';
import AddGroup from './components/AddGroup';
import DriverSelectionList from './components/DriverSelectionList';
import GroupsList from './components/GroupsList';

class TabIcon extends Component {
	render() {
		var color = this.props.selected ? 'red' : 'black';
		return (
			<View style={{ flex: 1 }}>

				{/* <Text> {this.props.title}</Text> */}
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

					<Scene key="AddGroup"
						component={AddGroup}
						title="Add Group"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>
					<Scene key="SelectDriver"
						component={DriverSelectionList}
						title="Add Group"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>

					<Scene key="GroupList"
						component={GroupsList}
						title="Add Group"
						navigationBarStyle={{backgroundColor: "#1e4495"}}
					/>


					<Scene key='tab3' activeTintColor='cyan' hideNavBar title='Profile'
							component={Profile} />
						<Scene key='tab4' activeTintColor='cyan' hideNavBar title='Notifications' component={Notifications} />
					
					{/* <Scene key='root' tabs={true} tabBarStyle={styles.tabBar} default="tab3"
						tabBarPosition='bottom' swipeEnabled={false}>
						<Scene key='tab1' activeTintColor='red' showIcon={true} hideNavBar title='Home'
							component={Login} icon={TabIcon} /> */}

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
								title='GPS'
								component={ReportsSetting} />
							<Scene key='reports' headerMode="float" duration={1}
								hideNavBar title='set Reports'
								component={ReportsSetting} />
						</Scene>

						
					{/* </Scene> */}
					<Scene key='erp' headerMode="float" wrap={false} tabs={true} default="Trips"
						tabBarPosition="top" scrollEnabled={true}
						swipeEnabled={true}  initial={this.state.logged}>
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
});