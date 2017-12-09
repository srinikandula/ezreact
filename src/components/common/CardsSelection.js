import React from 'react';
import {View} from 'react-native';



const CardsSelection  = (props)=>{

	return (
			<View style={style.containerStyle}>
				{props.children}
			</View>
		);
};


const style = {
	containerStyle:{
		backgroundColor:'#fff',		
		borderColor:'#fff',
		borderBottomWidth:0,
		padding:2,
		alignSelf: 'stretch',
		justifyContent:'flex-start',
		flexDirection:'row',
		position:'relative'

	}
}


export default CardsSelection;