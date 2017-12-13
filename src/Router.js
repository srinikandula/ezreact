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

class TabIcon extends Component {
	render() {
		var color = this.props.selected ? 'red' : 'black';
		return (
			<View style={{ flex: 1}}>
				
				{/* <Text> {this.props.title}</Text> */}
			</View>
		);
	}
}

export default class Navigation extends Component {

	componentWillMount() {
		SplashScreen.hide();
	};

	render() {
		return (
			<Router>
				<Scene key="root">
					<Scene key="Login"
						component={Login}
						hideNavBar={true}
						
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
						//initial={true}
					/>
					<Scene key='root' tabs={true} tabBarStyle={styles.tabBar} default="tab3"
						tabBarPosition='bottom' swipeEnabled={false} initial={true}>
						<Scene key='tab1' activeTintColor='red' showIcon={true} hideNavBar title='Home'
							component={HomeScreen} icon={TabIcon} />

						<Scene key='tab2' tabs={true} tabBarStyle={styles.tabGPSBar} default="gps" title='Setting'
							tabBarPosition='top' swipeEnabled={true}>
							<Scene key='gps' activeTintColor='red' hideNavBar title='Setting' titleStyle={{ color: 'blue' }}
								component={GpsSetting} icon={TabIcon} />
							<Scene key='reports' activeTintColor='red' hideNavBar title='Profile' titleStyle={{ color: 'blue' }}
								component={Login} icon={TabIcon} />
						</Scene>
						
						<Scene key='tab3' activeTintColor='cyan' hideNavBar title='Profile'
							component={Profile} icon={TabIcon} />
						<Scene key='tab4' activeTintColor='cyan' hideNavBar title='Notifications' component={Login} icon={TabIcon} />
					</Scene>
					
					<Scene key = 'root' headerMode="screen" wrap={false} tabs={true} default="trucks" tabBarPosition="top" swipeEnabled={true} >
						<Scene key='ErpHome' title='ErpHome' headerMode="screen" component={ErpHome}/>
						<Scene key='Drivers'title='Drivers' headerMode="screen" component={Trucks}/>
						<Scene key='Partys'title='Partys'  headerMode="screen" component={Trucks}/>
						<Scene key='Payments'title='Payments'  headerMode="screen" component={Trucks}/>
						<Scene key='Loads'title='Loads'  headerMode="screen" component={Trucks}/>
					
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
	navigationBarStyle: {
		backgroundColor: 'red',
	},
	navigationBarTitleStyle: {
		color: 'white',
	},
	tabGPSBar: {
		borderTopColor: 'red',
		borderTopWidth: 1 / PixelRatio.get(),
		backgroundColor: 'ghostwhite',
		opacity: 0.98
	},
});