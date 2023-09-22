/** @format */

import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  Text,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import styles from './styles';
import { Images, Url, Languages, Colors } from '@common';
import axios from 'axios';
import GetLocation from 'react-native-get-location'
import NetInfo from "@react-native-community/netinfo";
import Geocoder from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/Ionicons';
import RNRestart from 'react-native-restart';
import {request, PERMISSIONS} from 'react-native-permissions';

const QueryString = require('query-string');
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const Splash =() => {

  const slideanimation = useRef(new Animated.Value(0)).current;
  const bordernimation = useRef(new Animated.Value(0)).current;
  const imageheight = useRef(new Animated.Value(ScreenHeight)).current;
  const imagewidth = useRef(new Animated.Value(ScreenWidth)).current;

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showretryicon, setshowretryicon] = useState(false);
  const [nonetworktext, setnonetworktext] = useState(false);
  const [nolocationtext, setnolocationtext] = useState(false);

  useEffect(() => {
    initMethod();
  }, []);

  const initMethod = () => {
    animatein(),
    borderin(),
    animatebg();
    checkNetworkSettings();
  }

  const checkNetworkSettings = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if(state.isConnected == false){
        setshowretryicon(true);
        setnonetworktext(true);
      }else{
        AsyncStorage.getItem('logged', (err, logged)=>{
          if(logged == null){
            setTimeout(() => {
              navigation.replace('LoginMethods');
            }, 1000);
          }else{
            requestLocationPermission();
          }
        });
      }
    });
    return unsubscribe();
  }

  const requestLocationPermission = async () => {
    if(Platform.OS === "ios"){
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        console.warn(result)
        if(result == 'granted'){
          getCurrentLocation();
        } else {
          getCustomerOrderDetails();
          showMessage({
            message: 'Location update failed, please update it mannually from Location Settings',
            type: "danger",
            icon : 'danger',
            duration : 2000
          });
        }
      });
    } else {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        console.warn(result)
        if(result == 'granted'){
          getCurrentLocation();
        } else {
          getCustomerOrderDetails();
          showMessage({
            message: 'Location update failed, please update it mannually from Location Settings',
            type: "danger",
            icon : 'danger',
            duration : 2000
          });
        }
      });
    }
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    }).then(location => {
      Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        AsyncStorage.setItem('address', addressComponent);
        AsyncStorage.setItem('latitude', location.latitude+'');
        AsyncStorage.setItem('longitude', location.longitude + '');
        getCustomerOrderDetails();
    })
    }).catch(error => {
      setshowretryicon(true);
      setnolocationtext(true);
    });
  }

  const getCustomerOrderDetails = () => {
    AsyncStorage.getItem('userid', (err, uid)=>{
      axios.post(Url.getcustomerordersdetailurl, 
      QueryString.stringify({
          customerid : uid
      }),
      {
        headers: {"Content-Type": "application/x-www-form-urlencoded",}
      })
      .then(response => {
        const l = response.data.order.length;
        if(l != 0){
          const data = response.data.order;
          const selectedorder = data[0];
          const orderid = selectedorder.id;
          navigation.replace('RateOrder', {orderid : orderid});
        }else{
          setTimeout(() => {
              navigation.replace('HomeTabNavigator');
          }, 1000);
        }
      }).catch(error => {
          alert(error);
      })
    })
  }

  const animatein = () => {
    Animated.timing(slideanimation, {
      toValue: ScreenHeight/1.7,
      duration: 700
    }).start();
  };

  const animatebg = () => {
    Animated.timing(imageheight, {
      toValue: ScreenHeight+80,
      duration: 2000
  }).start();

    Animated.timing(imagewidth, {
      toValue: ScreenWidth+80,
      duration: 2000
    }).start();
  };

  const borderin = () => {
    Animated.timing(bordernimation, {
      toValue: 15,
      duration: 1500
    }).start();
  };

  return(
    <>
    <View style={[styles.container]}>
      <Animated.View style={[styles.halfround, {height : slideanimation, borderWidth : bordernimation, zIndex : 90}]}>
        <View style={[styles.imagecontainer]}>
          <Image source={Images.Logo} style={[styles.logo, {zIndex : 92}]}/>
        </View>
      </Animated.View>
      <Animated.Image source={Images.SplashBg} style={[styles.image]}></Animated.Image>
      <View style={{position : 'absolute', width : '100%', bottom : -30, backgroundColor : 'transparent', zIndex : 999, height : 50, padding : 0}}>
        <ProgressBarAndroid styleAttr="Horizontal" color={Colors.primary} height={40} margin={0}/>
      </View> 
      <View style={{position : 'absolute', width : '100%', bottom : -10, backgroundColor : '#000', zIndex : 998, height : 15, padding : 0}}>
      </View>

      {showretryicon ? 
      <View style={[styles.retrybuttonholder]}>
        <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', width : '100%'}}>
          <View style={{width : '90%'}}>
            {nonetworktext ? 
            <Text numberOfLines={2} style={[styles.retrytext, {width : '100%'}]}>{Languages.NoNetworkConnection}</Text>
            :null}
            {nolocationtext ?
            <Text numberOfLines={2} style={[styles.retrytext, {width : '100%'}]}>{Languages.LocationServiceDisabled}</Text>
            : null}
          </View>
          <TouchableOpacity onPress={()=>RNRestart.Restart()}>
            <Icon name={'refresh-outline'} size={25}/>
          </TouchableOpacity>
        </View>
      </View>:null}

    </View>
    </>
  );
}
export default Splash;