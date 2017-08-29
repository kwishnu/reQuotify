import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { View } from 'react-native-animatable';
const {width, height} = require('Dimensions').get('window');

const styles = StyleSheet.create({
  cell: {
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 10
  },
  name: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default class AnimationCell extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  };

  ref = null;
  handleRef = (ref) => {
    this.ref = ref;
  }

  handlePress = () => {
    if (this.ref && this.props.onPress) {
      this.props.onPress(this.ref);
    }
  };

  render() {
    return (
          <Animatable.View
              style={[{ backgroundColor: this.props.color }, styles.cell]}
              animation={ this.props.animationType }
              duration={ this.props.duration }
              >
            <TouchableWithoutFeedback onPress={this.handlePress} style={[{ backgroundColor: this.props.color }, styles.cell]}>
                <View
                  ref={this.handleRef}
                >
                  <Text style={styles.name}>{this.props.quoteGuess}</Text>
                </View>
            </TouchableWithoutFeedback>
          </Animatable.View>
    );
  }
}