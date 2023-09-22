import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';

import { Colors, Icons } from '@common'

import {Account} from '@screens';
import {Offers} from '@screens';
import {MulirestaurantHome} from '@screens';
import {OrdersScreen} from '@screens';
import { color } from 'react-native-elements/dist/helpers';

function HomeTabNavigator() {

    const [orderscount, setorderscount] = useState();
    const navigation = useNavigation();
    const [id, setid] = useState();

    useEffect(()=>{
        AsyncStorage.getItem('userid', (err, userid) => {
            setid(userid);
            const uid = Number(userid);
            firestore()
            .collection('orders')
            .where('status', '<', 6)
            .where('customer_id', '==', uid)
            .onSnapshot(documentSnapshot => {
                if(documentSnapshot != null){
                    if(documentSnapshot._docs.length != 0){
                        const count = documentSnapshot._docs.length;
                        setorderscount(count);
                    }else{
                        setorderscount(null);
                    }
                }
            }) 
        })
    },)

    const Tab = createBottomTabNavigator();
  
    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                tabBarStyle: [styles.tabBarStyle],
                unmountInactiveRoutes: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
            
                    if (route.name === 'Home') {
                    iconName = focused ? Icons.homefill : Icons.home;
                    color = focused ? null : Colors.white;
                    size = focused ? 26 : 20

                    }else if (route.name === 'Account') {
                    iconName = focused ? Icons.accountfill : Icons.account;
                    color = focused ? null : Colors.white;
                    size = focused ? 26 : 20

                    }else if (route.name === 'Offers') {
                    iconName = focused ? Icons.offersfill : Icons.offers;
                    color = focused ? null : Colors.white;
                    size = focused ? 26 : 20
                    
                    }else if (route.name === 'Orders') {
                    iconName = focused ? Icons.ordersfill : Icons.orders;
                    color = focused ? null : Colors.white;
                    size = focused ? 26 : 20
                    }
            
                    return <Image style={[styles.tabbarimage, {tintColor : color, width : size, height : size}]} source={iconName}/>;
                },
                })}
                tabBarOptions={{
                    labelStyle: [styles.hometabtitle],
                }}
                
            >
            <Tab.Screen name="Home" component={MulirestaurantHome} options={{headerShown : false}}/>
            <Tab.Screen name="Offers" component={Offers} options={{headerShown : false}}/>
            {id == '0' ?  
               null : <Tab.Screen name="Orders" component={OrdersScreen} options={{headerShown : false}}/> 
            }
            <Tab.Screen name="Account" component={Account} options={{headerShown : false}}/>
            </Tab.Navigator>
    );
}

export default HomeTabNavigator;