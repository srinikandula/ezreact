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
	state = {logged: false,loading: true};

	componentWillMount() {
		this.getCredentailsData();
        SplashScreen.hide();
		};

		async getCredentailsData() {
			/*var value = await this.getCache('credientails');
			if (value !== null){
				this.setState({logged: true});
			}else{
				console.log('0000','5465000');
			}*/

			this.getCache((value) => {
						if (value !== null) {
								this.setState({logged: true,loading: false});
						} else {
								this.setState({loading: false})
						}
				}
		);


		 }
		
		async getCache(callback){
			try{
					var value = await AsyncStorage.getItem('credientails');
					console.log('credientails',value);
					if (value !== null){
						 console.log('riyaz',value);
						} else {
							console.log('value',value);
						}
						callback(value);
			}
			catch(e){
					console.log('riyaz');
					console.log('caught error', e);
					// Handle exceptions
			}
	
	}
	

    

	render(){
		if (this.state.loading) {
			return null;
	}
		return(
				 <Router >
	                <Stack key="root">
	                    <Scene key="Login"
	                           component={Login}
	                           hideNavBar={true}
														 initial={!this.state.logged}
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


											<Scene key='root' tabs={true}   tabBarStyle={styles.tabBar} default="tab3" 
																tabBarPosition='bottom' swipeEnabled={false} initial={this.state.logged}>
												<Scene key='tab1' activeTintColor='red'  showIcon={true} hideNavBar title='Home' 
																																	component={Login} icon={TabIcon} />
											
													<Scene key='tab2' tabs={true} title='Setting'  tabBarStyle={styles.settingtabBar} 
																												titleStyle={styles.titleStyle} default="gps" 
																													tabBarPosition='top' swipeEnabled={true}>
														<Scene key='gps'title='Setting'  component={GpsSetting} />
														<Scene key='reports'   hideNavBar title='Reports' 
																									component={Login} />
													</Scene>

													<Scene key='tab3' activeTintColor='cyan'  hideNavBar title='Profile' 
																					component={Profile} icon={TabIcon}/>
												<Scene key='tab4' activeTintColor='cyan'  hideNavBar title='Notifications' component={Login} icon={TabIcon}/>
											</Scene>
	                </Stack>
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
    backgroundColor: 'red',
	},
	
  navigationBarTitleStyle: {
    color:'white',
	},
	navBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red', // changing navbar color
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