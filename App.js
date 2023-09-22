import React, {useEffect, useState} from 'react';
import {
  LogBox,
  SafeAreaView,
  PermissionsAndroid
} from 'react-native';
import Router from './src/router/Router';
import FlashMessage from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import Geolocation from 'react-native-geolocation-service';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const App= () => {

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      if(state.isConnected == false){
        alert('No network connection')
      }
    });
    if(Platform.OS === "ios"){
      Geolocation.requestAuthorization('whenInUse')
    }else{
      requestAndroidPermission();
    }
    unsubscribe();
    LogBox.ignoreAllLogs();

    console.log('component did mount')
    PushNotificationIOS.addEventListener('register', token => {
      console.log(token)
      console.log(token)
    })

    PushNotificationIOS.addEventListener('registrationError', registrationError => {
      console.log(registrationError, '--')
    })

    PushNotificationIOS.addEventListener('notification', function(notification) {
      if (!notification) {
        return
      }
      const data = notification.getData()
      console.log(JSON.stringify({ data, source: 'CollapsedApp' }))
    })

    // PushNotificationIOS.getInitialNotification().then(notification => {
    //   if (!notification) {
    //     return
    //   }
    //   const data = notification.getData()
    //   console.log(JSON.stringify({ data, source: 'ClosedApp' }))
    // })
    // PushNotificationIOS.requestPermissions()
  })

  const requestAndroidPermission = async () => {
    console.log("----------------------------------------");
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Gamigedara Restaurant',
          'message': 'Gamigedara Restaurant need access to your location '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("location permission denied")
        alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      <Router/>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

export default App;