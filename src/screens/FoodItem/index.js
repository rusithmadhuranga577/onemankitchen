import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Counter from "react-native-counters";
import { Colors, Languages } from '@common';
import { useNavigation } from '@react-navigation/native';
import { RadioButton, CartButton, CustomAlert, CustomAlertButton } from '@components';
import styles from './styles';
import CheckBox from '@react-native-community/checkbox';
import SetCartPrice from './Addtocart/setcartprice';
import SetCartQty from './Addtocart/setcartqty';
import AddItemsToCart from './Addtocart/additemstocart';
import { showMessage } from "react-native-flash-message";
import LinearGradient from 'react-native-linear-gradient';

const App = ({route}) => {

    const navigation = useNavigation();

    const { restaurant_id } = route.params;
    const { restaurantdata } = route.params;
    const { image } = route.params;
    const { name } = route.params;
    const { price } = route.params;
    const { original_price } = route.params;
    const { id } = route.params;
    const { foodtypes } = route.params;
    const { addons } = route.params;
    const { secondline } = route.params;

    const [addonslist, setaddonslist] = useState([]);
    const [loginpopup, setloginpopup] = useState(false);

    const [addonsarray, setaddonsarray] = useState([]);
    const [addsontotal, setaddsontotal] = useState(0);
    const [qty, setQty] = useState(Number(1));
    const [selctedype, setType] = useState(0);
    const [selctedypeName, setTypeName] = useState(0);
    const [selctedypePrice, setTypePrice] = useState(0);
    const [preparationNote, setpreparationNote]= useState('');
    const [total, settotal] = useState(0);
    const [disablebutton, setdisablebutton] = useState(false);

    const types = [];

    for( i=0; i < foodtypes.length; i++){
        types.push({typeid: foodtypes[i].id, lableName: foodtypes[i].type_name, label:  foodtypes[i].type_name, price: foodtypes[i].type_price} );
    }

    useEffect(()=>{
      if(addons != null){
        setaddonslist(addons);
      }
      if(foodtypes.length > 0){
        setType(types[0].food_item_type_id);
      }else{
        showMessage({
          message: "Item is not available",
          type: "warning",
          icon : 'warning',
          duration : 2500
        });
      }
    },[])

    const gettotal = ({typeprice, addontotal, qty}) => {
        const tp = Number(typeprice);
        const ap = Number(addontotal);
        var total = 0;
        total = (tp + ap)*qty
        const finaltotal = Number(total)
        settotal(finaltotal)
        return finaltotal;
    }

    const addonlist = (index) => {
      const foods = addonslist;
      foods[index].checked = !foods[index].checked;
      var items = addonslist;
      var itemcount = addonslist.length;
      var selectedlist = [];
      var pricelist = [];
      var arraytotal = 0;
  
      for (let i = 0; i < itemcount; i++){
        if(addonslist[i].checked == true){
          selectedlist.push({id :  (Number(addonslist[i].food_item_addon_id)), name: addonslist[i].addon_name, price: addonslist[i].addon_price, qty: qty });
          pricelist.push(Number(addonslist[i].addon_price));
        }
      }
      var newlist = [];
      newlist.push(id,selectedlist)
      setaddonsarray(selectedlist);
      for (let i = 0; i < pricelist.length; i++){ arraytotal += pricelist[i] }
      setaddsontotal(Number(arraytotal));
      gettotal({typeprice : selctedypePrice, addontotal : arraytotal, qty : qty})
    }

    const SetSelectedType = (type_data) => {
      if(foodtypes.length > 0){
        setType(type_data.typeid)
        setTypePrice(type_data.price)
        setTypeName(type_data.lableName)
        gettotal({typeprice : type_data.price, addontotal : addsontotal, qty : qty})
      }
    }

    const OnQtyChange = ({number}) => {
        const q = number;
        setQty(q);
        gettotal({typeprice : selctedypePrice, addontotal : addsontotal, qty : q})
    }

    const AddToCart = () => {
      AsyncStorage.getItem('userid', (err, userid)=>{
        if(userid == '0'){
          openLoginPopup();
        }else{
          // setdisablebutton(true);
          const itemsArray = [
                {
                    food_item_type_id : selctedype,
                    restaurant_id : restaurant_id,
                    restaurant_name : restaurantdata.name,
                    item_name : name,
                    item_image : image,
                    food_items_id : id,
                    item_type_id : selctedype,
                    item_type_name : selctedypeName,
                    item_type_price: Number(selctedypePrice) ,
                    item_total: (Number(total)),
                    item_addon_price: Number(addsontotal),
                    item_qty : qty,
                    item_prepare_note: preparationNote,
                    addons : addonsarray,
                }
              ]
              AsyncStorage.setItem('cart_merchant_type', restaurantdata.restaurant_type+'');
              AddItemsToCart(itemsArray);
              SetCartPrice(total);
              SetCartQty(qty);
              showMessage({
                message: "Item added to cart !",
                type: "success",
                icon : 'success',
                duration : 2500
              });
              setTimeout(() => {
                navigation.goBack();
              }, 500);
            }
          })
    }

    const closeLoginPopup = () => {
      setloginpopup(false);
    }

    const openLoginPopup = () => {
      setloginpopup(true);
    }

    const LogoutFunction = () => {
      AsyncStorage.clear();
      navigation.replace('LoginMethods');
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

    const getPercentage = (price, original_price) => {
      const price1 = price;
      const price2 = original_price;
      var percentage = 0;
  
      percentage = ((price2 - price1) / price2 *100).toFixed(0);
      if(price2 == null){
        return <></>;
      }else if (price1 < price2){
        return (
          <View style={[styles.populerbadge]}>
            <Text style={[styles.populerbadgetext]}>Save {percentage}%</Text>
          </View>  
        );
      }else{
        return <></>;
      }
    }

    const renderNavBar = () => (
      <View style={styles.navContainer}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.iconLeftholder}>
            <Icon name={'chevron-left'} size={15} color={Colors.black}/>
          </TouchableOpacity>
        </View>
      </View>
    );
      
    const TitleHolder = ({title}) => {
      return (
          <View style={[styles.titleholder]}>
              <Text style={[styles.titleholdertext]}>{title}</Text>
          </View>
      );
    };

      const renderContent = () => {
        return (
          <View>
            <View style={styles.body}>
                <View style={{flexDirection : 'row', justifyContent : 'space-between', width : '100%', alignItems : 'center'}}>
                  <View style={{width : '45%'}}>
                    <Text style={[styles.about]}>Description</Text>
                    <Text numberOfLines={3} style={[styles.secondlinestyle]}>{secondline}</Text>
                  </View>
                  {price > original_price ? 
                  <View>
                    <Text style={[styles.originalprice, {fontSize : 18, marginRight : 10}]}>{Languages.currency}{Number(price).toFixed(2)}</Text>
                  </View>:null}

                  {price < original_price ? 
                  <View style={{alignSelf : 'flex-end', marginRight : 10}}>
                    <View style={{width : '100%', marginTop : 10}}>
                    {getPercentage(price, original_price)} 
                    </View>
                    {price < original_price ? 
                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                      <Text style={[styles.originalprice, {textDecorationLine: 'line-through', color : 'red', fontSize : 15}]}>{Languages.currency}{Number(original_price).toFixed(2)}</Text>
                      <Text style={[styles.originalprice, {fontSize : 18}]}>{Languages.currency}{Number(price).toFixed(2)}</Text>
                    </View>:null}
                  </View>:null}
                </View>

                <TitleHolder title={Languages.Select}></TitleHolder>
                <RadioButton
                    data={types}
                    initial={1}
                    box = {false}
                    selectedBtn={(e) => {SetSelectedType(e)}}            
                    animationTypes= {['pulse', 'shake', 'rotate']}
                />

                {addonslist.length == 0 ? null :
                <>
                <TitleHolder title={Languages.Suggetions}></TitleHolder>
                {addonslist.map((addon, index ) => {
                  return (
                      <View style={[styles.addonitemrow]}>
                        <View style={[styles.addonrowleftitem]}>
                        <View style={{marginRight: 15}}>
                            <CheckBox
                                boxType={'circle'}
                                title={addon.addon_name}
                                onCheckColor = {Colors.white}
                                onValueChange={() => addonlist(index)}
                                value={addon?.checked}
                                size={20}
                                style={{ height: 20, width: 20 }}
                                lineWidth={3}
                                animationDuration={0.2}
                                hideBox={true}
                            />
                          </View>
                        <Text>{addon.addon_name}</Text>
                        </View>
                        <Text>{addon.addon_price == 0 ? null : '+ '+ Languages.currency +Number(addon.addon_price).toFixed(2)}</Text>
                    </View>
                  )
                })}
                </>}

                <TextInput 
                  value={preparationNote}
                  placeholder={Languages.PreparationNote}
                  onChangeText={text => setpreparationNote(text)}
                  style={[styles.textinput]}
                  placeholderTextColor={'rgba(0,0,0,0.4)'}
                />
                {foodtypes.length > 0 ? 
                <>
                <View style={{marginTop: 20, marginBottom: 20, alignItems: 'center'}}>
                    <Counter 
                        start={1}
                        max={1000}
                        min	={1}
                        buttonStyle ={styles.counterbtn}
                        buttonTextStyle = {styles.counterbuttontextstyle}
                        countTextStyle = {styles.countertext}
                        onChange={(count)=> OnQtyChange({number : count})} />
                </View>
                {disablebutton ? null : 
                <View style={{padding : 10}}>
                    <CartButton total={total} action={AddToCart}/>
                </View>}
                </>:null}
            </View>
          </View>
        );
      };
      
      const title = () => {
        return (
          <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,1)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1.8}} style={styles.imageoverlay}>
              <Text style={[styles.titlestyle]} numberOfLines={2}>{name}</Text>
          </LinearGradient>
        );
      };      

  return (
    <>
      <ReactNativeParallaxHeader
        headerMinHeight={10}
        headerMaxHeight={image == null ? 120 : 250}
        extraScrollHeight={20}
        navbarColor={image == null ? Colors.black : Colors.white}
        titleStyle={styles.titleStyle}
        title={title()}
        backgroundImage={{uri : image}}
        backgroundImageScale={1.5}
        renderNavBar={renderNavBar}
        renderContent={()=>renderContent()}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        innerContainerStyle={styles.container}
      />
      {renderAlerts()}
    </>
  );
};

export default App;