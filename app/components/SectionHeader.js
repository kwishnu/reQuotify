//section header for Contents:

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import configs from '../config/configs';
import { normalize }  from '../config/pixelRatio';
var {width, height} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: height/90,
    paddingLeft: height/30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#222222',
    borderBottomWidth: 2,
    borderBottomColor: '#111111'
  },
  text: {
    fontSize: configs.LETTER_SIZE * 0.7,
    color: '#ffffff',
  },
});

const SectionHeader = (props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{props.sectionTitle}</Text>
    {!props.hasConnection && props.sectionTitle == 'Daily Quotations' &&
        <Image  source={ require('../images/sync.png') }
                style={{width: normalize(height*.04),
                        height: normalize(height*.04),
                        marginLeft: normalize(height*.02)
                }}
                onStartShouldSetResponder={() => {
                    props.nav.replace({
                        id: 'splash',
                        passProps: {motive: 'initialize'}
                    });
                }}
        />
    }
  </View>
);

export default SectionHeader;