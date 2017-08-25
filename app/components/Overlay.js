import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import configs from '../config/configs';
import {normalize, normalizeFont, getOverlayMargin} from '../config/pixelRatio';
var {width, height} = require('Dimensions').get('window');


class Overlay extends Component {
    handlePress(e) {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }
    render() {
        return (
            <View style={styles.overlay} onStartShouldSetResponder={ this.handlePress.bind(this)} >
                <TouchableOpacity
                    onPress={ this.handlePress.bind(this) }
                    style={ styles.container } >
                    <View>
                        <Image style={[ styles.image, {marginLeft: getOverlayMargin(this.props.margin)}]} source={require('../images/overlaygraphic.png')} />
                        <View style={[styles.text_container, {marginLeft: getOverlayMargin(this.props.margin)}]}>
                            <Text style={ styles.text }>{ this.props.text }</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    overlay:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    outerContainer: {
        width: width,
        height: height,
        backgroundColor: 'transparent'
    },
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: normalize(height*.06),
        right: 10,
        width: width,
        height: normalize(height*.3),
    },
    image: {
        width: normalize(height*.4),
        height: normalize(height*.3),
    },
    text_container: {
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-start',
        top: normalize(height*.11),
        left: normalize(height*.03),
        width: normalize(height*.3),
        height: normalize(height*.12),
        marginRight: 20
    },
    text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
        color: '#000000',
        lineHeight: 30
    }
});
export default Overlay;