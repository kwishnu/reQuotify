import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Alert, BackHandler, Platform, AsyncStorage, NetInfo } from 'react-native';
import Meteor from 'react-native-meteor';
import Button from '../components/Button';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont }  from '../config/pixelRatio';
const InAppBilling = require('react-native-billing');
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const KEY_MyHints = 'myHintsKey';
const KEY_Premium = 'premiumOrNot';

module.exports = class HintStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'hints',
            currentHints: ''
        };
        this.goSomewhere = this.goSomewhere.bind(this);
    }
    componentDidMount(){
        Meteor.reconnect();
        AsyncStorage.getItem(KEY_MyHints).then((hintStr) => {
            this.setState({currentHints: hintStr});
        });
        BackHandler.addEventListener('hardwareBackPress', this.goSomewhere);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.goSomewhere);
    }
    goSomewhere() {
        try {
            this.props.navigator.pop({});
        }
        catch(err) {
            window.alert(err.message);
        }
        return true;
    }
    startPurchase(hintPackage){
        if (this.state.currentHints == 'infinite'){
            Alert.alert('Thanks, but...', 'You already have unlimited hints!');
            return;
        }
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected && Meteor.status().status == 'connected'){
//rv.hint.package.100, 500, 1000
// == unlimited
                InAppBilling.close()//docs recommend making sure IAB is closed first
                .then(() => InAppBilling.open())
                .then(() => InAppBilling.purchase(hintPackage))
                .then((details) => {
                    if (details.purchaseState == 'PurchasedSuccessfully'){
                        let packArray = hintPackage.split('.');
                        let strHowMany = '';
                        if (packArray[3] == '0'){
                            strHowMany = 'infinite';
                        }else{
                            let numBuying = parseInt(packArray[3], 10);
                            let numOwned = (this.state.currentHints == '-1')?0:parseInt(this.state.currentHints, 10);
                            let total = numBuying + numOwned;
                            strHowMany = String(total);
                        }
                        try {
                            AsyncStorage.setItem(KEY_Premium, 'true');
                            AsyncStorage.setItem(KEY_MyHints, strHowMany);
                        } catch (error) {
                            window.alert('AsyncStorage error: ' + error.message);
                        }
                        try {
                            this.props.navigator.pop({});
                            this.props.navigator.replace({
                                id: 'home',
                                passProps: {
                                    destination: this.props.fromWhere,
                                    homeData: this.props.homeData,
                                    isPremium: 'true'
                                }
                            });
                        } catch(err)  {
                            window.alert(err.message)
                            return true;
                        }
                        console.log("You purchased: ", details);
                    }else{
                        console.log('Purchase Error: ', details)
                        Alert.alert('Purchase Error', 'Sorry, your purchase did not succeed, please try again later!');
                    }
                    if (hintPackage != 'rv.hint.package.0'){
                        InAppBilling.consumePurchase(hintPackage).then((consumed)=>{
                            console.log("Purchase consumed: ", consumed);
                            return InAppBilling.close();
                        });
                    }else{
                        return InAppBilling.close();
                    }
                }).catch((err) => {
                    console.log(err);
                    return InAppBilling.close()
                });
            }else{
                Alert.alert('Not Connected', `Sorry, we can't reach our servers right now. Please try again later!`);
            }
        });
    }

    render() {
        return (
            <View style={hints_styles.container}>
                <View style={ hints_styles.header }>
                    <Button style={hints_styles.button} onPress={ () => this.goSomewhere() }>
                        <Image source={ require('../images/arrowback.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                    </Button>
                    <Text style={styles.header_text} >Hint Packages</Text>
                    <Button style={hints_styles.button}>
                        <Image source={ require('../images/noimage.png') } style={ { width: normalize(height*0.07), height: normalize(height*0.07) } } />
                    </Button>
                </View>
                <View style={ hints_styles.store_container }>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>100 reQuotify Hints{'\n'}$0.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.100')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>500 reQuotify Hints{'\n'}$1.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.500')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>1000 reQuotify Hints{'\n'}$2.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.1000')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ hints_styles.purchase_row }>
                        <View style={ hints_styles.purchase_text_container }>
                            <Text style={ hints_styles.text }>Unlimited Hints{'\n'}$3.99</Text>
                        </View>
                        <View style={ hints_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase('rv.hint.package.0')}}>
                            <View style={hints_styles.buy_button} >
                                <Text style={hints_styles.buy_text}>Purchase</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}



const hints_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.pale_green,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        backgroundColor: colors.blue_bg,
        marginBottom: 20
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    store_container: {
        flex: 15,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    purchase_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width*.95,
        height: height*.16,
        padding: 4,
        margin: 4

    },
    purchase_button_container: {
        flex: 2,
        height: height*.16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        margin: 4
    },
    purchase_text_container: {
        flex: 3,
        height: height*.16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        padding: 4,
        margin: 4

    },
    buy_button: {
        height: height/15,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#058805',
        borderRadius: height*.2,
        borderWidth: 1,
        borderColor: '#f9f003',
        marginLeft: height*.03
    },
    buy_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.094),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    text: {
        color: '#333333',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.09),
        textAlign: 'center',
        lineHeight: height*.05

    }
});
