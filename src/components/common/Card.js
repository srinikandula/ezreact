import React from 'react';
import {View} from 'react-native';



const Card  = (props) =>{
	return (
			<View style={style.containerStyle}>
				{props.children}
			</View>
		);
};


const style = {
	containerStyle:{
		borderWidth:2,
		borderRadius:2,
		borderColor:'#e0e0e0',
		borderBottomWidth:0,
		shadow:'#000',
		shadowOpacity:0.1,
		shadowRadius:2,
		marginLeft:5,
		marginRight:2,
		marginTop:6,
		alignSelf: 'stretch'
	}
}


export {Card};