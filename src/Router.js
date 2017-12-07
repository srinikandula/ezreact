import React, {Component} from 'react';
import {AsyncStorage, ToastAndroid} from 'react-native';
import {Router, Stack, Scene} from 'react-native-router-flux';
import Login from './components/Login';
import ForgotPin from './components/ForgotPin';
import SplashScreen from 'react-native-splash-screen';



export default class Navigation extends Component{


	componentWillMount() {
        SplashScreen.hide();
    };

	render(){

		return(
				 <Router>
	                <Stack key="root">
	                    <Scene key="Login"
	                           component={Login}
	                           hideNavBar={true}
	                           initial= {true}
	                    />

	                    <Scene key="ForgotPin"
	                           component={ForgotPin}
	                           hideNavBar={true}
	                    />
	                </Stack>
                </Router>
			);
	}

}