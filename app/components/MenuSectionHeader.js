//section header for SideMenu:

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont }  from '../config/pixelRatio';
var {width, height} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    paddingLeft: 12,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.blue_bg
  },
  text: {
    fontSize: normalizeFont(configs.LETTER_SIZE * 0.09),
    color: colors.light_blue,
  },
});

const SectionHeader = (props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{props.sectionTitle}</Text>
  </View>
);

export default SectionHeader;