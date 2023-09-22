import { StyleSheet } from "react-native"
import { Colors, Constants } from '@common';
import { Dimensions } from "react-native";//94373164997

const screenwidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    hometabtitle : {
        fontFamily : Constants.fontFamilybold,
        fontSize : 13,
        color : Colors.white,
        marginBottom : 10,
        marginTop : 5
    },
    tabBarStyle : {
        height : 65,
        paddingTop : 10,
        backgroundColor : Colors.primary,
        width : '90%',
        alignSelf : 'center',
        bottom : 20,
        borderRadius : 20,
        position : 'absolute',
        left : '5%',
        right : '5%',
        elevation : 10
    },
    tabbarimage : {
        width : 25,
        height : 25
    },
})

export default styles;