import { StyleSheet } from "react-native"
import { Colors, Constants } from '@common';

const styles = StyleSheet.create({
    buttoncontainer : {
        width: '100%', 
        height: 45,
        backgroundColor: Colors.primary,
        alignItems : 'center',
        justifyContent : 'center',
        alignSelf : 'center',
        borderRadius : 5,
        flexDirection : 'row',
        justifyContent : 'space-between',
        paddingRight : 20,
        paddingLeft : 20
    },
    title : {
        fontSize : 18,
        color : Colors.white,
        fontFamily : Constants.fontFamilybold
    }
})

export default styles;