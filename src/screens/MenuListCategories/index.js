/** @format */

import React, { useEffect, useState, useRef } from 'react';
import {
  Image,
  Text,
  Animated,
  View,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SectionList from 'react-native-tabs-section-list';
import { useNavigation } from '@react-navigation/native';
import { Colors, Url, Languages } from '@common';
import { LoadingComponent } from '@components';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import NavBar from './navbar';
import styles from './styles';
import MenuSearchPage from './MenuSearchPage';

const QueryString = require('query-string');

const MenuListCategories =({route}) => {

  const { resid } = route.params;
  const { restaurantdata } = route.params;
  const { cat_id } = route.params;
  const popupanimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [menulist, setmenulist] = useState([]);

  const [cartprice, setcartprice] = useState([]);
  const [cartqty, setcartqty] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchpage, setsearchpage] = useState(false);
  const [popup, setpopup] = useState(false);

  useEffect(()=>{
    Getcartdata();
    FetchMenuList();
    console.log(restaurantdata)
  }, [isFocused])

  const FetchMenuList=()=>{
    setloading(true);
    axios.post(Url.listbycategoryurl,  //listbycategoryurl
    QueryString.stringify({
      cat_id : cat_id,
      restaurant_id : 0,
    }), 
    {
        headers: {"Content-Type": "application/x-www-form-urlencoded",}
    }).then(response => {
      setmenulist(response.data);
      setloading(false);
    })
  }

  const animatein = () => {
    Animated.timing(popupanimation, {
      toValue: 70,
      duration: 500,
    }).start();
  };

  const animateout = () => {
    Animated.timing(popupanimation, {
      toValue: 0,
      duration: 600,
    }).start();
  };

  const NavigateToCartPage = () => {
    AsyncStorage.getItem('cart_merchant_type', (err, type) => {
      if(type != 'fashion'){
          navigation.push('CartPage');
      }else{
          navigation.push('FashionItemsCart');
      }
    });
  }

  const Getcartdata = () => {
    AsyncStorage.multiGet(['cartprice', 'cartqty'], (err, cartdata) =>{
      if(cartdata[0][1] == null && cartdata[1][1] == null){
          animateout();
          setpopup(false);
      }else{
        setpopup(true);
        animatein();
        setcartprice(cartdata[0][1]);
        setcartqty(cartdata[1][1]);
      }
    });
  }

  const getPercentage = (price, original_price) => {
    const price1 = price;
    const price2 = original_price;
    var percentage = 0;

    percentage = ((price2 - price1) / price2 *100).toFixed(0);
    if(price2 == null){
      return <></>;
    }else if (price1 < price2){
      return (
        <View style={[styles.populerbadge, {backgroundColor : '#FF5617'}]}>
          <Text style={[styles.populerbadgetext]}>Save {percentage}%</Text>
        </View>  
      );
    }else{
      return <></>;
    }
  }

  const nav = (item) => {
    navigation.push('FoodItem' , {name: item.food_name, price: item.price, image: item.image_large, id: item.id , foodtypes : item.foodtype, secondline: item.second_line,  addons: item.addons.length == 0? null : item.addons[0].addonitems, restaurant_id : restaurantdata.id, restaurantdata : restaurantdata, original_price : item.original_price });
  }

  var i = 0;
  const RenderItem = (item) => {
    return(
      <>
        {item.id != 0 ?
        <View style={{flexDirection : 'column'}}>
        <TouchableOpacity onPress={()=>item.available == 0 ? null : nav(item)} style={[styles.itemcontainer, {opacity : item.available == 0  || item.available == 2 ? 0.5 : 1}]}>
          <View style={{width : '70%'}}>
              <Text numberOfLines={2} style={[styles.foodname]}>{item.food_name}</Text>
              {item.second_line == '' || item.second_line == null ? null : <Text numberOfLines={2} style={[styles.foodsecondline]}>{item.second_line}</Text>}
              <Text style={[styles.price]}>{Languages.Rs} {Number(item.price).toFixed(2)}</Text>
            <View style={{ flexDirection : 'row' ,alignItems : 'center', marginTop : 5}}>
              {getPercentage(item.price, item.original_price)} 
              {item.popularitem == 0 ? null : <View style={[styles.populerbadge]}><Text style={[styles.populerbadgetext]}>🔥Popular</Text></View>}
            </View>
          </View> 
          {item.image_thumb == null ? null : <Image style={styles.image} source={{uri: item.image_thumb}} ></Image>}                   
          
        </TouchableOpacity>
        {item.available == 0 ?
        <View style={[styles.itemoverlay]}>
          <Text style={[styles.notavailabletext]}>{Languages.ItemNotAvailable}</Text>
        </View>
        :null}
        {item.available == 2 ?
        <View style={[styles.itemoverlay]}>
          <Text style={[styles.notavailabletext]}>{Languages.ItemNotAvailableUntilTomorrow}</Text>
        </View>
        :null}
        </View>
        : 
        <>
        {item.open != 1 ?
        <View style={[styles.restaurantstatuscontainer, {backgroundColor : item.open == 0 ? Colors.alertred : item.open == 2 ? Colors.alertyellow : item.open == 3 ? Colors.alertyellow : null}]}>
          <Text style={[styles.restaurantstatustext]}>{item.opendetails}</Text>
        </View>
        :null}
        </>
        }
      </>
    );
  }

  const HeaderItem = (section) => {
    return(
      <>
      {section.index == 0 ? null : 
      <View style={styles.headercontainer}>
        <View style={{width : '120%', height : 8, backgroundColor : Colors.gray, marginBottom : 10, marginTop : 10}}/>
        <Text style={[styles.headertitle]}>{section.title}</Text>
      </View>}
      </>
    );
  }

  const CartPopup = () => {
    return(
      <>
        {popup ?
        <TouchableOpacity onPress={NavigateToCartPage}>
            <Animated.View style={[styles.cartpopupcontainer, {height : popupanimation}]}>
              <View style={{alignSelf : 'center', marginLeft : 25}}>
                <Text onPress={NavigateToCartPage} style={[styles.cartpricetext]}>{Languages.Rs}{Number(cartprice).toFixed(2)}</Text>
                <Text onPress={NavigateToCartPage} style={[styles.cartqtytext]}>{cartqty} {Languages.ItemsinCart}</Text>
              </View>
              <Icon onPress={NavigateToCartPage} name={'cart'} size={35} style={[styles.cartpopupicon]} color={Colors.white}/>
            </Animated.View>
        </TouchableOpacity>
        : null}
      </>
    );
  }

  const TabItem = (title, isActive) => {
    return(
      <View style={[styles.tabbarcontainer, {backgroundColor : isActive ? Colors.primary : Colors.white, marginTop : 50}]}>
        {restaurantdata.restaurant_type == 'fashion' ? 
        <View style={[styles.tabcontainer]}>
          {title == 'Overview' ? 
          <Icon name={'shirt-outline'} size={20} color={isActive ? Colors.white : Colors.black}/> 
          :
          <Text style={[styles.tabbartitle, {color : isActive ? Colors.white : Colors.black}]}>
              {title}
          </Text>}
        </View>
        :
        <View style={[styles.tabcontainer]}>
          {title == 'Overview' ? 
          <Icon name={'fast-food'} size={20} color={isActive ? Colors.white : Colors.black}/> 
          :
          <Text style={[styles.tabbartitle, {color : isActive ? Colors.white : Colors.black}]}>
              {title}
          </Text>}
        </View>}
      </View>
    );
  }

  const MainView = () => {
    return(
      <View style={{width : '100%', height : '100%', backgroundColor : '#fff'}}>
      <LoadingComponent visibility={loading}/>
      {menulist.length == 0 ? null :
        <SectionList
          sections={menulist}
          keyExtractor={item => item.id}
          stickySectionHeadersEnabled={false}
          scrollToLocationOffset={50}
          tabBarStyle={styles.tabBar}
          renderSectionHeader={({ section}) => HeaderItem(section)}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderTab={({ title, isActive }) => TabItem(title, isActive)}
          renderItem={({ item, index }) => RenderItem(item, index)}
        />}
      </View>
    );
  }

  return (
    <>
      {MainView()}
      {searchpage ?  <MenuSearchPage visibility={searchpage} navigation={navigation} closeModel={()=>setsearchpage(false)} id={resid}/> : null}
      <NavBar title={restaurantdata.name} navigation={navigation} onpress={()=>setsearchpage(true)}/>
      <CartPopup/>
    </>
  );
}

export default MenuListCategories;