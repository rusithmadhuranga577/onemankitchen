/** @format */

import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { CustomAlert, CustomAlertButton } from '@components';
import styles from './styles';
import { Languages } from '@common';

const AddressBar =() => {

  const [loginpopup, setloginpopup] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [address, setaddress] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('address', (err, address) => {
      setaddress(address);
    });
  }, [isFocused])

  const onPressFunction = () => {
    AsyncStorage.getItem('userid', (err, userid) => {
      if(userid == '0'){
        openLoginPopup();
      }else{
        navigation.navigate('LocationSettings', {logged : 1, cart : 0})
      }
    });
  }

  const closeLoginPopup = () => {
    setloginpopup(false);
  }
  
  const openLoginPopup = () => {
    setloginpopup(true);
  }

  const LogoutFunction = () => {
    closeLoginPopup(false);
    AsyncStorage.clear();
    navigation.replace('LoginMethods')
  }

  const renderAlerts = () => {
    return(
      <>
      <CustomAlert
        displayMode={'login'}
        displayMsg={Languages.LoginOrCreateAnAccountForContinue}
        displaymsgtitle={Languages.PleaseLogin}
        visibility={loginpopup}
        dismissAlert={closeLoginPopup}
        cancellable={false}
        buttons={(
          <>
            <CustomAlertButton buttontitle={Languages.LoginSignIn} theme={'success'} buttonaction={LogoutFunction}/>
            <CustomAlertButton buttontitle={Languages.Cancel} theme={'alert'} buttonaction={closeLoginPopup}/>
          </>
        )}
      />   
      </>
    );
  }

  return(
    <TouchableOpacity onPress={onPressFunction} style={[styles.addressbar]}>
        <View>
            <View style={{alignSelf :'center'}}>
                <Text style={[styles.addressbartitle]}>{Languages.DeliveringFood}</Text>
            </View>
            <Text style={[styles.addresstext]} numberOfLines={1}>{address}</Text>
        </View>
        {renderAlerts()}
    </TouchableOpacity>
  );
}
export default AddressBar;