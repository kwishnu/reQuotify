import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Alert, BackHandler, Platform, AsyncStorage, Linking, AppState, NetInfo } from 'react-native';
import Button from '../components/Button';
import configs from '../config/configs';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
import moment from 'moment';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const KEY_ratedTheApp = 'ratedApp';
const KEY_PlayFirst = 'playFirstKey';
const KEY_Premium = 'premiumOrNot';
let year = moment().year();

module.exports = class Mission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'mission',
            ratedApp: false,
            ratingText: `Ratings are important - they not only give us valuable feedback about our app, they promote awareness of the app to the wider world as well...please help us by rating us in the app store via the button below, and we'll thank you with a special Game setting!`
        };
        this.goSomewhere = this.goSomewhere.bind(this);
    }
    componentDidMount(){
        AsyncStorage.getItem(KEY_Premium).then((premium) => {
            if (premium == 'true'){
                this.setState({ratingText: `Ratings are important - they not only give us valuable feedback about our app, they promote awareness of the app to the wider world as well...please help us by rating us in the app store via the button below. Thanks!`});
            }
        });
        BackHandler.addEventListener('hardwareBackPress', this.goSomewhere);
        AppState.addEventListener('change', this.handleAppStateChange);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.goSomewhere);
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleAppStateChange=(appState)=>{//for coming back from rating app
        if(appState == 'active'){
            this.props.navigator.replace({
                id: 'splash',
                passProps: {
                    motive: 'initialize'
                }
            });
        }
    }
    goSomewhere() {
        try {
            this.props.navigator.pop({
                passProps: {
                    homeData: this.props.homeData,
                }
            });
        }
        catch(err) {
            window.alert(err.message);
        }
        return true;
    }
    rateApp(){
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected){
                let storeUrl = Platform.OS === 'ios' ?
                    'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=' + configs.appStoreID + '&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8' :
                    'market://details?id=' + configs.appStoreID;
                try {
                    AsyncStorage.setItem(KEY_ratedTheApp, 'true')
                    .then(()=>{
                        return AsyncStorage.setItem(KEY_PlayFirst, 'true');
                    }).then(()=>{
                        Linking.openURL(storeUrl);
                    })
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }else{
                Alert.alert('No Connection', 'Sorry, no internet available right now. Please try again later!');
            }
        });
    }

    render() {
        return (
            <View style={about_styles.container}>
                <View style={ about_styles.header }>
                    <Button style={[about_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.goSomewhere() }>
                        <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                    </Button>
                    <Text style={styles.header_text} >Our Mission</Text>
                    <Button style={[about_styles.button, {marginRight: getArrowMargin()}]}>
                        <Image source={ require('../images/noimage.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                    </Button>
                </View>
                <View style={ about_styles.about_container }>
                    <View style={about_styles.mission_container}>
                        <Text style={about_styles.mission_text}>
                            `The goal of reVersify is to promote the enjoyment of The Bible by providing a unique way of interacting with the Scriptures - both for people who already do so and, especially, for those who otherwise might not. A portion of the proceeds raised by the app will be donated to the WEB project of World Outreach Ministries.`
                        </Text>
                    </View>
                        <View style={about_styles.divider}/>
                    <Text style={about_styles.mediumPrint}>{this.state.ratingText}</Text>
                    <Button style={about_styles.rate_button} onPress={() => this.rateApp()}>
                        <Text style={about_styles.sure}>Sure!</Text>
                    </Button>
                </View>
            </View>
        );
    }
}



const about_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B0B30',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        backgroundColor: '#000000',
    },
    mission_container: {
        height: height*.4,
        width: height*.5,
        borderWidth: 2,
        borderColor: '#bca613',
        backgroundColor: '#cfe7c2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: height*.04
    },
    mission_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.09),
        color: '#000000',
        fontFamily: 'Book Antiqua',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    about_container: {
        flex: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.073),
        marginBottom: 10
    },
    mediumPrint: {
        color: '#bbbbbb',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
        marginLeft: 32,
        marginRight: 32,
        marginTop: 6,
        marginBottom:6,
        textAlign: 'center',
    },
    sure: {
        color: '#111111',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.08),
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        width: width * 0.75,
        backgroundColor: '#333333',
        margin: 20,
    },
    rate_button: {
        height: height*.08,
        width: height * 0.18,
        backgroundColor: '#4aeeb2',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 3
    }
});
