import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Dimensions,
  AsyncStorage,
  Animated,
  Easing,
  BackHandler
} from 'react-native';
import configs from '../config/configs';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const {width, height} = require('Dimensions').get('window');

class Intro extends Component {
    constructor(props) {
        super(props);
        this.offsetX = new Animated.Value(0);
        this.moveValue = new Animated.Value(0);
        this.grow = new Animated.Value(0);
        this.opac = new Animated.Value(0);
        this.state = {
            id: 'intro',
            arrowImage: require('../images/arrowforward.png'),
            showNextArrow: false,
            showWelcome: false,
            showSkip: false,
            showText: false
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        setTimeout(()=>{
        this.animate_image_delay();
        }, 500);
        setTimeout(()=> {this.showArrowImage()}, 1800);
        setTimeout(()=> {this.setState({showWelcome: true})}, 1500);
        setTimeout(()=> {this.setState({showText: true})}, 1500);
        setTimeout(()=> {this.setState({showSkip: true})}, 3200);
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton=() => {
        this.goSomewhere();
    }
    goSomewhere(){
        if (this.props.seenIntro != 'true'){
            this.props.navigator.replace({
                id: 'home',
                passProps: {
                    homeData: this.props.homeData,
                    isPremium: this.props.isPremium,
                    seenIntro: this.props.seenIntro,
                    connectionBool: this.props.connectionBool,
                    destination: this.props.destination
                },
           });
        }else{
            this.props.navigator.pop({});
        }
    }
    animate_image_delay(){
        this.moveValue.setValue(0);
//        Animated.sequence([
//            Animated.delay(1000),
            Animated.spring(
            this.moveValue,
                {
                    toValue: 1,
                    friction: 4,
                    Easing: Easing.back,
                    useNativeDriver: true
                }
            ).start()
//        ]).start()
    }
    showArrowImage(){
        this.grow.setValue(0);
        this.opac.setValue(0);
        this.setState({showNextArrow: true});

        Animated.parallel([
            Animated.timing(this.opac, {
                toValue: 1,
                duration: 200,
                delay: 100
            }),
            Animated.timing(this.grow, {
                    toValue: 1.1,
                    delay: 100
            })
        ]).start(()=>{
            Animated.spring(
                this.grow,
                { toValue: 1, friction: 3 }
            ).start()
        });
    }
    intro1(){
        this.props.navigator.push({
            id: 'intro1',
            passProps: {
                destination: 'game',
                }
        });
    }

  render() {
            const move = this.moveValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -200]
        });
        const scale = this.grow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const arrowStyle = {opacity: this.opac.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                  }), transform: [{scale}]};
        return (
			<View style={ styles.container }>
                <View>
                    <Animated.Image style={[styles.image, {transform: [{translateY: move}]}] } source={require('../images/logo.png')} />
                </View>
                { this.state.showText &&
                <View style={styles.text_container}>
                    <Text style={styles.text}>Learn to Play</Text>
                </View>
                }
                { this.state.showNextArrow &&
                <View style={styles.next_arrow}>
                    <Animated.Image style={arrowStyle} source={this.state.arrowImage}/>
                </View>
                }
                { this.state.showSkip &&
                <View style={styles.skip} onStartShouldSetResponder={()=>this.handleHardwareBackButton()}>
                    <Text style={styles.skip_text}>Skip</Text>
                </View>
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000'
    },
    image: {
        width: normalize(height*.35),
        height: normalize(height*.17),
        marginBottom: 20
    },
    welcome_container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*.65,
        height: height*.18,
        top: height*.4
    },
    text_container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*.65,
        height: height*.18,
        top: height*.5
    },
    next_arrow: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height*.18,
        top: height*.65
    },
    skip: {
        position: 'absolute',
        top: height*.92,
        left: width*.05,
        padding: height*.015
    },
    text_welcome: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.14),
        color: '#ffffff',
        textAlign: 'center'
    },
    text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.14),
        color: '#486bdd',
        textAlign: 'center'
    },
    skip_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.14),
        fontWeight: 'bold',
        color: '#777777'
    }
});

module.exports = Intro;