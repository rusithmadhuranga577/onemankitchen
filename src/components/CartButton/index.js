/** @format */

import React, { useEffect } from 'react';
import { connect } from "react-redux";
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';
import styles from './styles';
import { Images, Languages } from '@common';

const Button =({total, action}) => {

  useEffect(() => {
  
  })

  return(
    <TouchableOpacity onPress={action} style={[styles.buttoncontainer]}>
        <Text style={[styles.title]}>{Languages.Rs}{total ? Number(total).toFixed(2) : '0.00'}</Text>
        <Text style={[styles.title]}>{Languages.AddToCart}</Text>
    </TouchableOpacity>
  );
}
export default Button;