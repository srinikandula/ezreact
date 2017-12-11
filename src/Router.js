import React, {Component} from 'react';
import {AsyncStorage,Icon, ToastAndroid, StatusBar,
  Text,Image,
  View,
  StyleSheet,
  PixelRatio} from 'react-native';
import {Router, Stack, Scene} from 'react-native-router-flux';
import Login from './components/Login';
import ForgotPin from './components/ForgotPin';
import OtpVerification from './components/OtpVerification';
import Profile from './components/Profile';

import ResetPassword from './components/ResetPassword';
import GpsSetting from './components/GpsSetting';
import SplashScreen from 'react-native-splash-screen';



class TabIcon extends Component {
	  render() {
	    var color = this.props.selected ? 'red' : 'black';

	    return (
	      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
	        <Image 
	        	cosource={require('./images/logo_icon.png')} style= {{resizeMode: 'contain'}}/>
						<Text> {this.props.title}</Text>
	      </View>
	    );
	  }
	}




export default class Navigation extends Component{


	componentWillMount() {
        SplashScreen.hide();
    };

    

	render(){

		return(
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
	                           initial= {true}   
	                    />


											<Scene key='root' tabs={true}   tabBarStyle={styles.tabBar} default="tab3" 
																tabBarPosition='bottom' swipeEnabled={false}>
												<Scene key='tab1' activeTintColor='red'  showIcon={true} hideNavBar title='Home' 
																																	component={Login} icon={TabIcon} />
											
													<Scene key='tab2' tabs={true}   tabBarStyle={styles.tabGPSBar} default="gps" 
																													tabBarPosition='top' swipeEnabled={true}>
														<Scene key='gps'  activeTintColor='red'  hideNavBar title='Setting' titleStyle={{color:'blue'}}
																						component={GpsSetting} icon={TabIcon}/>
														<Scene key='reports' activeTintColor='red'  hideNavBar title='Profile' titleStyle={{color:'blue'}}
																					component={Login} icon={TabIcon}/>
													</Scene>

													<Scene key='tab3' activeTintColor='cyan'  hideNavBar title='Profile' 
																					component={Profile} icon={TabIcon}/>
												<Scene key='tab4' activeTintColor='cyan'  hideNavBar title='Notifications' component={Login} icon={TabIcon}/>
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
    color:'white',
	},
	tabGPSBar: {
    borderTopColor: 'red',
    borderTopWidth: 1 / PixelRatio.get(),
    backgroundColor: 'ghostwhite',
    opacity: 0.98
  },


});