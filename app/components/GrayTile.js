import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');

class GrayTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      opacity: this.props.opac
    };
  }


    render() {
        return (
                <View style={[tile_styles.draggable, { opacity: this.state.opacity }]}>
                    <Text style={tile_styles.text}>{this.state.text}</Text>
                </View>
        );
    }
}

const tile_styles = StyleSheet.create({
  draggable: {
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 2,
    height: height/20,
    width: height/6,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999999',
    borderWidth: 1,
    borderColor: '#000000'
  },
  text: {
    fontSize: normalizeFont(configs.LETTER_SIZE*0.1),
    color: '#000000'
  }
});

export default GrayTile;