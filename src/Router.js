import React, { Component } from 'react';
import {
	AsyncStorage,
	Icon,
	ToastAndroid,
	StatusBar,
	Text, Image,
	View,
	StyleSheet,
	PixelRatio
} from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Login from './components/Login';
import ForgotPin from './components/ForgotPin';
import OtpVerification from './components/OtpVerification';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import GpsSetting from './components/GpsSetting';
import SplashScreen from 'react-native-splash-screen';
import HomeScreen from './components/HomeScreen';
import Trucks from './components/Trucks';
import ErpHome from './components/ErpHome';
import ERPCategory from './components/ERPCategory';
import ERPSubCategory from './components/ERPSubCategory';
import ExpiryDate from './components/ExpiryDate';
import DriverList from './components/DriverList';
import PartyList from './components/PartyList';
import TruckList from './components/TruckList';
import PaymentList from './components/PaymentList';

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
	state = { logged: false, loading: true, value: {} };

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
			if (value !== null) {
				console.log('riyaz', value);
			} else {
				console.log('value', value);
			}
			callback(value);
		}
		catch (e) {
			console.log('riyaz');
			console.log('caught error', e);
			// Handle exceptions
		}
	}



	render() {
		if (this.state.loading) {
			return null;
		}
		return (
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

						<Scene key='tab3' activeTintColor='cyan' hideNavBar title='Profile'
							component={Profile} icon={TabIcon} />
						<Scene key='tab4' activeTintColor='cyan' hideNavBar title='Notifications' component={Login} icon={TabIcon} />
					</Scene>
					<Scene key='erp' headerMode="float" wrap={false} tabs={true} default="trucks"
						tabBarPosition="top"  swipeEnabled={true} initial={this.state.logged}>
						<Scene key='ErpHome' title='ErpHome' headerMode="float" component={ErpHome} />
						<Scene key='Trucks' title='Trucks' headerMode="float" component={TruckList}
						/>
						<Scene key='Drivers' title='Drivers' headerMode="float" component={DriverList}
							screenProps={this.state.value} />
						<Scene key='Partys' title='Partys' headerMode="float" component={PartyList} />
						<Scene key='Payments' title='Payments' headerMode="float" component={PaymentList} />
						<Scene key='Loads' title='Loads' headerMode="float" component={Trucks} />
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
		tintColor: 'blue',
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