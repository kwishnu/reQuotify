import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, ListView, BackHandler, AsyncStorage, NetInfo, ActivityIndicator, Alert } from 'react-native';
import Meteor from 'react-native-meteor';
import Button from '../components/Button';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
const InAppBilling = require('react-native-billing');
const styles = require('../styles/styles');
const { width, height } = require('Dimensions').get('window');
const CELL_WIDTH = width;
const CELL_HEIGHT = CELL_WIDTH * .5;
const CELL_PADDING = Math.floor(CELL_WIDTH * .08);
const TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2);
const TILE_HEIGHT = CELL_HEIGHT - CELL_PADDING * 2;
const BORDER_RADIUS = CELL_PADDING * .3;
const KEY_expandInfo = 'expandInfoKey';
const KEY_MyHints = 'myHintsKey';
invertColor=(hex, bw)=> {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#333333'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    r = (r.length == 1)?(r + '0'):r;
    g = (255 - g).toString(16);
    g = (g.length == 1)?(g + '0'):g;
    b = (255 - b).toString(16);
    b = (b.length == 1)?(b + '0'):b;

    // pad each with zeros and return
    return  "#" + r + g + b;
//     padZero(r) + padZero(g) + padZero(b);
}


module.exports = class Store extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            id: 'store',
            dataSource: this.props.availableList,
            currentHints: '',
            expand: true,
            isLoading: true,
            questionOpacity: 1,
            questionImage: require('../images/infoquestion.png'),
            infoText: `All Bible Books are priced $0.99USD and may be read in their entirety in the app. A portion of the proceeds raised by the app will be donated to the WEB project of World Outreach Ministries.`
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount(){
        Meteor.reconnect();
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AsyncStorage.getItem(KEY_expandInfo).then((strExpand) => {
            if(strExpand){
                let expandArr = strExpand.split('.');
                let tf = false;
                switch(this.props.dataIndex){
                    case '5'://Verse Collections
                        tf = (expandArr[0] == '1')?true:false;
                        this.setState({expand: tf});
                        break;
                    case '6': case '7'://Old and New Testaments
                        tf = (expandArr[1] == '1')?true:false;
                        this.setState({expand: tf});
                        break;
                }
            }
            return AsyncStorage.getItem(KEY_MyHints);
        }).then((hintStr) => {

            this.setState({currentHints: hintStr});
        });
        setTimeout(()=>{this.setState({isLoading: false})}, 700);
        if (!this.props.showInfoBox){
            this.setState({expand: false, questionOpacity: 0, questionImage: require('../images/noimage.png')})
            return;
        }
        if (this.props.dataIndex == 5){
            this.setState({ infoText: `All Verse Collections contain 50 Verse Puzzles and are priced $0.99USD. A portion of the proceeds raised by the app will be donated to the WEB project of World Outreach Ministries.` });
        }
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        try {
            this.props.navigator.pop({
                id: 'home',
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
    toggleInfoBox(bool){
        if (this.state.questionOpacity == 0)return;
        this.setState({expand: !bool, infoText: this.state.infoText});
        AsyncStorage.getItem(KEY_expandInfo).then((strExpand) => {
            let expArr = strExpand.split('.');
            let ind = 0;
            switch(this.props.dataIndex){
                case '5':
                    ind = 0;
                    break;
                case '6': case '7':
                    ind = 1;
                    break;
            }
            if(expArr[ind] == '1'){
                expArr[ind] = '0';
                let reglue = expArr.join('.');
                try {
                    AsyncStorage.setItem(KEY_expandInfo, reglue);//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }

        });
    }
    renderStoreRow = (data) => {
        let productIDArray = data.product_id.split('.');
        if (productIDArray[0] == 'rv'){
            return (//single Collection or Book
                <View style={ store_styles.purchase_row }>
                    <View style={[store_styles.purchase_text_container, {backgroundColor: data.color}]}>
                        <Text style={[store_styles.launcher_text, {color: invertColor(data.color, true)}]}>{data.name}</Text>
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>{data.num_quotes + ' Verse Puzzles'}</Text>
                        {productIDArray[2] == 'book' &&
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>Complete Text</Text>
                        }
                    </View>
                    <View style={ store_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase(data.product_id)}}>
                        <View style={store_styles.buy_button} >
                            <Text style={store_styles.buy_text}>Purchase</Text>
                        </View>
                    </View>
                </View>
            )
        }else{
            return (//combo
                <View style={ store_styles.purchase_row }>
                    <View style={[store_styles.purchase_text_container, {backgroundColor: data.color}]}>
                        <Text style={[store_styles.launcher_text, {color: invertColor(data.color, true)}]}>{data.name[0]}</Text>
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>{data.num_quotes[0] + ' Verse Puzzles'}</Text>
                        {productIDArray[0] == 'b' &&
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>Complete Text</Text>
                        }
                            <View style={store_styles.divider}/>
                        <Text style={[store_styles.launcher_text, {color: invertColor(data.color, true)}]}>{data.name[1]}</Text>
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>{data.num_quotes[1] + ' Verse Puzzles'}</Text>
                        {productIDArray[2] == 'b' &&
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>Complete Text</Text>
                        }
                            <View style={store_styles.divider}/>
                        <Text style={[store_styles.launcher_text, {color: invertColor(data.color, true)}]}>{data.name[2]}</Text>
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>{this.getRowThreeText(data.product_id, data.num_quotes[2])}</Text>
                        {productIDArray[4] == 'b' &&
                        <Text style={[store_styles.launcher_text_small, {color: invertColor(data.color, true)}]}>Complete Text</Text>
                        }
                            <View style={store_styles.spacer}/>
                        <Text style={[store_styles.launcher_text, {color: invertColor(data.color, true)}]}>{data.price}</Text>
                    </View>
                    <View style={ store_styles.purchase_button_container } onStartShouldSetResponder={ ()=> {this.startPurchase(data.product_id)}}>
                        <View style={store_styles.buy_button} >
                            <Text style={store_styles.buy_text}>Purchase</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }
    getRowThreeText(id, numQuotes){
        let splitID = id.split('.');
        console.log(id);
        let returnText = (splitID[4] == 'h')?'reQuotify Hints':numQuotes + ' Quote Puzzles';
        return returnText;
    }
    startPurchase(itemID){
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected && Meteor.status().status == 'connected'){
                InAppBilling.open()
                .then(() => InAppBilling.purchase(itemID))
                .then((details) => {
                    if (details.purchaseState == 'PurchasedSuccessfully'){
                        console.log('You purchased: ', details)

                        let idArray = itemID.split('.');
                        let lastItem = idArray[idArray.length - 1];
                        if (lastItem.indexOf('0') > -1){// == '100' || lastItem == '500' || lastItem == '1000'){//hints
                            let numBuying = parseInt(lastItem, 10);
                            let numOwned = (this.state.currentHints == '-1')?0:parseInt(this.state.currentHints, 10);
                            let total = numBuying + numOwned;
                            strHowMany = String(total);
                            try {
                                AsyncStorage.setItem(KEY_MyHints, strHowMany);
                            } catch (error) {
                                window.alert('AsyncStorage error: ' + error.message);
                            }
                        }
                        setTimeout(()=> {
                            this.props.navigator.replace({
                                id: 'splash',
                                passProps: {
                                    motive: 'purchase',
                                    productID: itemID
                                }
                            });
                        }, 800);
                        this.props.navigator.pop({});
                    }else{
                        console.log('Purchase Error: ', details)
                        Alert.alert('Purchase Error', 'Sorry, your purchase did not succeed, please try again later!');
                    }
                    return InAppBilling.close();
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
        const rows = this.dataSource.cloneWithRows(this.props.availableList);
        if(this.state.isLoading == true){
            return(
                <View style={store_styles.loading}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            )
        }else{
            if(this.state.expand){
                return (
                    <View style={store_styles.container}>
                        <View style={ store_styles.header }>
                            <Button style={[store_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                                <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                            <Text style={styles.header_text} >{this.props.title}
                            </Text>
                            <Button style={[store_styles.button, {marginRight: getArrowMargin()}]}>
                                <Image source={ require('../images/noimage.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                        </View>
                        <View style={store_styles.listview_container}>
                            <View style={[ store_styles.infoBox, {flex: 5} ]}>
                                <View style={ store_styles.text_container }>
                                    <Text style={store_styles.info_text} >{this.state.infoText}</Text>
                                </View>
                                <View style={ store_styles.button_container }>
                                    <Button style={ store_styles.gotit_button } onPress={ () => this.toggleInfoBox(this.state.expand) }>
                                            <Text style={[store_styles.button_text, {color: 'red'}]}> X   </Text>
                                            <Text style={[store_styles.button_text, {color: '#ffffff'}]} > Got it!</Text>
                                    </Button>
                                </View>
                            </View>
                            <View style={{flex: 8}}>
                                <ListView  showsVerticalScrollIndicator ={false}
                                        contentContainerStyle={ store_styles.listview }
                                        enableEmptySections ={true}
                                        dataSource={rows}
                                        renderRow={this.renderStoreRow}
                                />
                            </View>
                        </View>
                    </View>
                );
            }else{
                return (
                    <View style={store_styles.container}>
                        <View style={ store_styles.header }>
                            <Button style={[store_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                                <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                            <Text style={styles.header_text} >{this.props.title}</Text>
                            <Button style={[store_styles.button, {marginRight: getArrowMargin(), opacity: this.state.questionOpacity}]} onPress={ () => this.toggleInfoBox() }>
                                <Image source={this.state.questionImage} style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                        </View>
                        <View style={store_styles.listview_container}>
                            <View style={{flex: 12}}>
                                <ListView  showsVerticalScrollIndicator ={false}
                                        contentContainerStyle={ store_styles.listview }
                                        enableEmptySections ={true}
                                        dataSource={rows}
                                        renderRow={this.renderStoreRow}
                                />
                            </View>
                        </View>
                    </View>
                );
            }
        }
    }
};

const store_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.pale_bg,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blue_bg
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: window.width,
        backgroundColor: colors.blue_bg,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    gotit_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666666',
        width: height*.18,
        height: height*.06,
    },
    button_text: {
        fontSize: configs.LETTER_SIZE * .6,
        fontWeight: 'bold',
    },
    listview_container: {
        flex: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: height * .02,
        paddingRight: height * .02,
    },
    infoBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        width: width * .9,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#333333',
        marginTop: 16
    },
    text_container: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.7,
        backgroundColor: 'transparent',
    },
    button_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: width * 0.75,
        backgroundColor: 'transparent',
    },
    listview: {
        marginTop: height * .02,
        paddingBottom: height * .04,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_small: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .07),
        marginHorizontal: height * .02
    },
    launcher_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .11),
    },
    launcher_text_small: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .08),
    },
    info_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .085),
        color: '#111111'
    },
    purchase_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width*.95
    },
    purchase_button_container: {
        flex: 2,
        height: height*.16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,

    },
    purchase_text_container: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        borderRadius: height*.009,
        paddingVertical: height*.02,
        paddingHorizontal: height*.01,
        margin: 4,
    },
    buy_button: {
        height: height*.067,
        width: height*.165,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#058805',
        borderRadius: height*.2,
        borderWidth: 1,
        borderColor: '#f9f003',
        marginLeft: height*.015
    },
    buy_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.094),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        width: height * 0.1,
        backgroundColor: '#dddddd',
        marginVertical: height*.01,
    },
    spacer: {
        height: height*.02
    }
});