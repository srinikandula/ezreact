import React from 'react';
import { Text, View, Modal } from 'react-native';
import { CustomButton, CustomText,CustomEditText } from './index';

const TrackVehicleBox = ({  visible, onAccept, onDecline, Submit, cancel,mailID,onchange }) => {
    const { containerStyle, textStyle, cardSectionStyle, viewContainerStyle } = styles;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => {}}
        >
            <View style={containerStyle}>
            
                <View style={[viewContainerStyle,cardSectionStyle,{backgroundColor:'#ffffff'}]}>
                    <CustomText customTextStyle={{color: '#595959',textAlign: 'center'} }>
                                Share Details To Mail</CustomText>
                    <CustomEditText underlineColorAndroid='transparent' 
                                    inputTextStyle={{ marginHorizontal: 16,borderWidth:1,borderColor:'#3085d6' }} 
                                    value={mailID}
                                    onChangeText={onchange} />
                </View>
                <View style={[viewContainerStyle,{ flexDirection:'row'}]}>
                    <CustomButton
                        customButtonStyle={{backgroundColor: '#3085d6', margin: 10}}
                        onPress={onAccept}>
                        <CustomText
                        customTextStyle={{ color: '#ffffff' }}
                        >{Submit}</CustomText>
                    </CustomButton>
                    <CustomButton
                        customButtonStyle={{backgroundColor: '#aaaaaa',margin: 10}}
                        onPress={onDecline}>
                        <CustomText
                        customTextStyle={{color: '#ffffff' }}
                        >{cancel}</CustomText>
                    </CustomButton>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    cardSectionStyle: {
        justifyContent: 'center',
        flexDirection:'column'
    },
    textStyle: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 35
    },
    containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    viewContainerStyle: {
        padding: 5,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-end',
        flexDirection: 'column',

        position: 'relative'
    }
};

export { TrackVehicleBox };
