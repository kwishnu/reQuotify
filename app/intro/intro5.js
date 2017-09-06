import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Animated,
  Easing,
  BackHandler
} from 'react-native';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const {width, height} = require('Dimensions').get('window');

class Intro5 extends Component {
    constructor(props) {
        super(props);
        this.offsetX = new Animated.Value(0);
        this.moveValue = new Animated.Value(0);
        this.grow = new Animated.Value(0);
        this.opac = new Animated.Value(0);
        this.grow2 = new Animated.Value(0);
        this.opac2 = new Animated.Value(0);
        this.state = {
            id: 'intro',
            arrowImage: require('../images/arrowforward.png'),
            showSocialText: false,
            showFavorites: false,
            showBible: false,
            showText: false
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        this.props.navigator.pop({});
        return true;
    }
    start(){
        this.animate_image_delay();
        setTimeout(()=> {this.setState({showSocialText: true})}, 1000);
        setTimeout(()=> {this.showFavoritesImage()}, 3200);
        setTimeout(()=> {this.showBibleImage()}, 5300);
        setTimeout(()=> {this.setState({showText: true})}, 8500);
    }
    reset(){
        setTimeout(()=>{
            this.setState({ showSocialText: false,
                            showFavorites: false,
                            showBible: false,
                            showText: false
            });
        }, 500);
    }
    done(){
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
//    footerBorder(color) {
//        let bgC = colors.pale_bg;
//        let darkerColor = (bgC == colors.pale_bg)?shadeColor(colors.blue_bg, 5):shadeColor(color, -40);
//        return {borderColor: darkerColor};
//    }
//    headerBorder(color) {
//        let bgC = colors.pale_bg;
//        let darkerColor = (bgC == colors.pale_bg)?shadeColor(colors.blue_bg, 5):shadeColor(color, -40);
//        return {borderColor: darkerColor};
//    }
//    headerFooterColor(color) {
//        let bgC = colors.pale_bg;
//        let darkerColor = (bgC == colors.pale_bg)? colors.blue_bg:shadeColor(color, -40);
//        return {backgroundColor: darkerColor};
//    }
    animate_image_delay(){
        this.moveValue.setValue(0);
        Animated.sequence([
            Animated.delay(500),
            Animated.spring(
            this.moveValue,
                {
                    toValue: 1,
                    friction: 4,
                    Easing: Easing.back,
                    useNativeDriver: true
                }
            )
        ]).start()
    }
    showFavoritesImage(){
        this.grow.setValue(0);
        this.opac.setValue(0);
        this.setState({showFavorites: true});
        Animated.parallel([
            Animated.timing(this.opac, {
                toValue: 1,
                duration: 200
            }),
            Animated.timing(this.grow, {
                    toValue: 1.1
            })
        ]).start(()=>{
            Animated.spring(
                this.grow,
                { toValue: 1, friction: 3 }
            ).start()
        });
    }
    showBibleImage(){
        this.grow2.setValue(0);
        this.opac2.setValue(0);
        this.setState({showBible: true});
        Animated.parallel([
            Animated.timing(this.opac2, {
                toValue: 1,
                duration: 200
            }),
            Animated.timing(this.grow2, {
                    toValue: 1.1
            })
        ]).start(()=>{
            Animated.spring(
                this.grow2,
                { toValue: 1, friction: 3 }
            ).start()
        });
    }

    render() {
        let move = this.moveValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -height*.36]
        });
        let scale = this.grow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        let buttonsStyle = {opacity: this.opac.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                  }), transform: [{scale}]};
        let bibleStyle = {opacity: this.opac2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                  }), transform: [{scale}]};
        return (
			<View style={ styles.container } >
                <View style={{flexDirection: 'row'}}>
                    <Animated.Image style={[styles.image, {transform: [{translateY: move}]}] } source={require('../images/fblogo.png')} />
                    <Animated.Image style={[styles.image, {transform: [{translateY: move}]}] } source={require('../images/twitterlogo.png')} />
                </View>
                { this.state.showSocialText &&
                <View style={styles.social_text}>
                    <Text style={styles.text}>When you have completed the quote you can share it on Social Media,</Text>
                </View>
                }
                { this.state.showFavorites &&
                <View style={styles.favorites}>
                    <Animated.Image style={buttonsStyle} source={require('../images/favorites.png')}/>
                    <Text style={[styles.text, {marginTop: 15}]}>save it to your Favorites,</Text>
                </View>
                }
                { this.state.showBible &&
                <View style={styles.bible}>
                    <Animated.Image style={bibleStyle} source={require('../images/bible.png')}/>
                    <Text style={styles.text}>or, if the quote was from an Author Collection, see it in context in the Reader...</Text>
                </View>
                }
                { this.state.showText &&
                <View style={styles.thatsit}>
                    <Text style={styles.large_text}>That's it - enjoy reQuotify!</Text>
                </View>
                }
                { this.state.showText &&
                <View style={styles.done} onStartShouldSetResponder={()=>this.done()}>
                    <Text style={styles.done_text}>Done</Text>
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
        backgroundColor: colors.pale_bg
    },
    image: {
        width: 60,
        height: 60,
        margin: 3
    },
    social_text: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*.8,
        height: height*.16,
        top: height*.185
    },
    text1_container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*.8,
        height: height*.2,
        top: height*.5
    },
    favorites: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height*.18,
        top: height*.35
    },
    bible: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*.8,
        height: height*.25,
        top: height*.55
    },
    thatsit: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*.8,
        height: height*.25,
        top: height*.715
    },
    done: {
        position: 'absolute',
        top: height*.92,
        right: width*.05,
        padding: height*.015
    },
    text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.10),
        color: '#333333',
        textAlign: 'center'
    },
    large_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.13),
        color: '#333333',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    done_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.14),
        fontWeight: 'bold',
        color: '#486bdd'
    }
});

module.exports = Intro5;