/** @format */

import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import {
  Linking,
  ScrollView,
  BackHandler,
  Text,
  Animated,
  View,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import AddressBar from './addressbar';
import NameBar from './namebar';
import CategoriesList from './CategoriesLists/index';
import Categories from "./Categories";
import GuestUserContainer from './GuestUserContainer';
import LocationPermissionContainer from './LocationPermissionContainer';
import { Languages, Url } from '@common';
import { CustomAlert, CustomAlertButton } from '@components';
import { useIsFocused } from '@react-navigation/native';
import { Banner } from '@components';
import FloatinCartButton from './FloatingCartButton';
import OffersBanner from './OffersBanner';
import axios from 'axios';

const QueryString = require('query-string');

const Home =() => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const addressbarheight = useRef(new Animated.Value(0)).current;
  const ongoingcontaineropacity = useRef(new Animated.Value(0.5)).current;
  const [exitalert, setexitalert] = useState(false);
  const [showongoingcontainer, setshowongoingcontainer] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        setexitalert(true)
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    AsyncStorage.getItem('userid', (err, userid) => {
      const uid = Number(userid);
      axios.post(Url.getuserongoingordersurl, 
      QueryString.stringify({
          customerid : userid
      }),
      {
        headers: {"Content-Type": "application/x-www-form-urlencoded",}
      })
      .then(response => {
        console.log('Ongoing orders', response.data)
        const data = response.data.order;
        console.log(data.length)
        if(data.length > 0){
          setshowongoingcontainer(true);
          OngoingOrderContainerAnimation();
        }else{
          setshowongoingcontainer(false);
          Animated.timing(ongoingcontaineropacity, {
            toValue: 0, 
            duration: 2000,
          });
        }
      }).catch(error => {
          console.log(error);
      })
    })
    return () => backHandler.remove();
  }, [])

  const OngoingOrderContainerAnimation = () => {
    Animated.loop(
        Animated.sequence([
          Animated.timing(ongoingcontaineropacity, {
              toValue: 1, 
              duration: 200,
              useNativeDriver: true
          }),
          Animated.timing(ongoingcontaineropacity, {
            toValue: 1, 
            duration: 2500,
            useNativeDriver: true
          }),
          Animated.timing(ongoingcontaineropacity, {
            toValue: 0, 
            duration: 1000,
            useNativeDriver: true
          }),
        ]),
    ).start();
  }

  const OngoingOrderContainer = () => {
    return(
      <Animated.View style={[styles.ongoingordercontainer, {opacity : ongoingcontaineropacity}]}>
      <TouchableOpacity onPress={()=>navigation.push('OrdersPage')}>
        <Text style={[styles.ongoingordertext]}>{Languages.YouHaveOngoing}</Text>
      </TouchableOpacity>
      </Animated.View>
    );
  }

  const AnimeateIn = () => {Animated.timing(addressbarheight,{toValue: -60,duration: 150, useNativeDriver: true}).start()}
  const Animeateout = () => {Animated.timing(addressbarheight,{toValue: 0,duration: 150, useNativeDriver: true}).start()}

  const onScroll = (e) => {
    const position = e.nativeEvent.contentOffset.y;
    if(position < 100){
      Animeateout();
    }else if(position > 60){
      AnimeateIn();
    }
  }

  return(
    <View style={[styles.container]}>
      <Animated.View style={{width : '100%', height : 60, transform : [{translateY : addressbarheight}], position : 'absolute', zIndex : 99}}>
        <AddressBar/>
      </Animated.View>
      <ScrollView
       onScroll={(e)=>onScroll(e)}
       showsVerticalScrollIndicator={false}
      >
        <LocationPermissionContainer/>
        <GuestUserContainer/>
        <NameBar/>
        <Banner url={Url.bannerurl}/>
        <View>
          <Text style={[styles.latestoffertext, {marginTop : 15, marginLeft : 10, fontSize : 18}]}>{Languages.WhatWouldYouLike}</Text>
        </View>
        <Categories/>
        <CategoriesList/>
        <View>
          <Text style={[styles.latestoffertext, {marginBottom : 10, marginTop : 30}]}>{Languages.BestOffers}</Text>
        </View>
        <OffersBanner url={Url.getalloffersurl}/>
        <View style={{marginBottom : 150}}/>
      </ScrollView>

      <FloatinCartButton/>

      {/*Exit Alert*/}
      <CustomAlert
        displayMode={'alert'}
        displayMsg={Languages.YouWantToExitApp}
        displaymsgtitle={Languages.AreYouSure}
        visibility={exitalert}
        dismissAlert={setexitalert}
        cancellable={true}
        buttons={(
          <>
            <CustomAlertButton buttontitle={Languages.Yes} theme={'alert'} buttonaction={()=>BackHandler.exitApp()}/>
            <CustomAlertButton buttontitle={Languages.No} theme={'inverse'} buttonaction={()=>setexitalert(false)}/>
          </>
        )}
      />
      {showongoingcontainer ?
      <OngoingOrderContainer/>:null}
    </View>
  );
}
export default Home;