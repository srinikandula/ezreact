import React from 'react';
import { Text, View, Modal } from 'react-native';
import { CustomButton, CustomText } from './index';

const Confirm = ({ children, visible, onAccept, onDecline, sayNo, sayYes }) => {
    const { containerStyle, textStyle, cardSectionStyle, viewContainerStyle } = styles;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => {}}
        >
            <View style={containerStyle}>
                <View style={[viewContainerStyle,cardSectionStyle]}>
                        {children}
                </View>
                <View style={viewContainerStyle}>
                    <CustomButton
                        customButtonStyle={{backgroundColor: '#1e4495', margin: 10}}
                        onPress={onDecline}>
                        <CustomText
                        customTextStyle={{ color: '#fff' }}
                        >{sayNo}</CustomText>
                    </CustomButton>
                    <CustomButton
                        customButtonStyle={{backgroundColor: '#1e4495',margin: 10}}
                        onPress={onAccept}>
                        <CustomText
                        customTextStyle={{color: '#fff' }}
                        >{sayYes}</CustomText>
                    </CustomButton>

                </View>
            </View>
        </Modal>
    );
};

const styles = {
    cardSectionStyle: {
        justifyContent: 'center'
    },
    textStyle: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 35
    },
    containerStyle: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    viewContainerStyle: {
        padding: 5,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-end',
        flexDirection: 'row',

        position: 'relative'
    }
};

export { Confirm };
