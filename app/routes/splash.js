import React, {Component} from 'react';
import { View, Image, StyleSheet, NetInfo, AsyncStorage, ActivityIndicator, StatusBar, Text } from 'react-native';
import Meteor from 'react-native-meteor';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
//const InAppBilling = require('react-native-billing');
const seedData = require('../config/data');
const nowISO = 0;
const tonightMidnight = 0;
const KEY_MyHints = 'myHintsKey';
const KEY_Premium = 'premiumOrNot';
const KEY_PlayFirst = 'playFirstKey';
const KEY_Verses = 'versesKey';
const KEY_SeenStart = 'seenStartKey';
const KEY_Notifs = 'notifsKey';
const KEY_NotifTime = 'notifTimeKey';
const KEY_ratedTheApp = 'ratedApp';
const {width, height} = require('Dimensions').get('window');
import { normalize }  from '../config/pixelRatio';
//'ws://52.52.205.96:80/websocket'; <= Publications...publication AllData, collections dataA...dataZ; MeteorApp
//'ws://10.0.0.207:3000/websocket'; <= localhost
var METEOR_URL = 'ws://52.52.205.96:80/websocket';


class SplashScreen extends Component {
    constructor(props) {
        super(props);
        Text.defaultProps.allowFontScaling = false; // Disallow dynamic type on iOS
        this.state = {
            id: 'splash',
            seenStart: 'false',
            notif_time: '',
            isPremium: false,
            connectionBool: true,
            getPurchased: false,
            nextBonus: '0',
            totalScore: '0',
            pData: []
        };
    }
    componentDidMount() {
        StatusBar.setHidden(true);
        Meteor.connect(METEOR_URL);
        var homeData = [];
        nowISO = moment().valueOf();//determine offset # of days for daily quotes...
        tonightMidnight = moment().endOf('day').valueOf();
        var launchDay = moment('2017 08', 'YYYY-MM');//July 1, 2017
        var dayDiff = -launchDay.diff(nowISO, 'days');//# of days since 7/1/2017
        var startNum = dayDiff - 28;
        if(this.props.motive == 'initialize'){
            var ownedPacks = [];
            var getPurchasedBool = true;
            var premiumBool = false;
//            InAppBilling.close()//docs recommend making sure IAB is closed first
//            .then(() => InAppBilling.open())
//            .then(() => InAppBilling.listOwnedProducts())//get array of purchased items from the store
//            .then((owned) => {
//                for (let check=0; check<owned.length; check++){
//                    if (owned[check] == 'rv.hint.package.0'){
//                        try {
//                            AsyncStorage.setItem(KEY_MyHints, 'infinite');
//                        } catch (error) {
//                            window.alert('AsyncStorage error: ' + error.message);
//                        }
//                        continue;
//                    }
//                    if (owned[check].split('.').length > 3){
//                        premiumBool = true;
//                        this.setState({isPremium: true});
//                        continue;
//                    }
//                }
//                for (let checkForHints=0; checkForHints<owned.length; checkForHints++){
//                  if (owned[checkForHints].indexOf('.hint.') < 0){
//                    ownedPacks.push(owned[checkForHints]);
//                  }
//                }
//                return InAppBilling.close();
//            }).then(()=> {
//                return AsyncStorage.getItem(KEY_Verses);
                AsyncStorage.getItem(KEY_Verses).then((quotes)=> {
                if (quotes !== null) {//get current data:
                    homeData = JSON.parse(quotes);
                }else{//store seed data, as this is the first time using the app:
                    homeData = seedData;
                    try {
                        AsyncStorage.setItem(KEY_Verses, JSON.stringify(seedData));
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                if (homeData.length > 22){//screen for bonus packs vs. purchased packs
                    for (let chk=22; chk<homeData.length; chk++){
                        if (typeof homeData[chk].product_id != 'undefined' && homeData[chk].product_id.indexOf('bonus') < 0){
                            homeData[14].show = 'false';//purchased something, gets access to last 30 daily quotes rather than last 3 days
                            homeData[15].show = 'true';
                            premiumBool = true;
                            getPurchasedBool = false;//a purchased pack is here, we don't need to retrieve them which would erase progress stats
                            continue;
                        }
                    }
                }
                if (this.state.isPremium){
                    homeData[14].show = 'false';//purchased something
                    homeData[15].show = 'true';
                    premiumBool = true;
                }
                this.setState({ isPremium: premiumBool,
                                getPurchased: getPurchasedBool,
                                pData: homeData
                });
                return AsyncStorage.getItem(KEY_Notifs);
            }).then((notifHour) => {//notification hour, zero if no notifications (from Settings)
                if (notifHour !== null) {
                    this.setNotifications(notifHour);
                }else{
                    this.setState({notif_time: '7'});
                    try {
                        AsyncStorage.setItem(KEY_Notifs, '7');
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                return AsyncStorage.getItem(KEY_SeenStart);
            }).then((seenIntro) => {
                if (seenIntro !== null) {//has already seen app intro
                    this.setState({seenStart: seenIntro});
                }else{    //hasn't seen app intro...
                    this.setState({seenStart: 'false'});
                    try {
                        AsyncStorage.setItem(KEY_SeenStart, 'true');
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                    return NetInfo.isConnected.fetch();
            }).then((isConnected) => {//if has internet connection, get daily quotes and current app object
                if(Meteor.status().status == 'connected'){//isConnected && ...
                    return this.getData(this.state.pData, startNum);//load daily puzzles
                }else{//still let have access to 30 days already on device even if no internet connection
                    AsyncStorage.getItem(KEY_Premium).then((prem) => {
                        premiumBool = false;
                        if(prem == 'true'){
                            homeData[14].show = 'false';
                            homeData[15].show = 'true';
                            premiumBool = true;
                        }
                        this.setState({ connectionBool: false,
                                        isPremium: premiumBool,
                                        pData: homeData
                        })
                        return false;
                    });
                }
            }).then((verseArray) => {
                if(verseArray){
                    verseArray[16].num_solved = homeData[16].num_solved;//set 'Worth Repeating' to its current state
                    verseArray[16].type = homeData[16].type;
                    verseArray[16].solved = homeData[16].solved;
                    verseArray[16].show = homeData[16].show;
                    this.setState({ pData: verseArray });
                    return true;
                }else{
                    return false;
                }
            }).then((isConnected) => {//retrieve purchased packs here, if not already on device
                var promises = [];
                if(isConnected && this.state.getPurchased && Meteor.status().status == 'connected'){
                    var packsOnDevice = [];
                    for (var k=0; k<this.state.pData.length; k++){
                        if (this.state.pData[k].type == 'mypack'){
                            if(this.state.pData[k].product_id != ''){
                                packsOnDevice.push(this.state.pData[k].product_id);
                            }
                        }
                    }
                    for (var goThroughOwned=0; goThroughOwned<ownedPacks.length; goThroughOwned++){
                        if (packsOnDevice.indexOf(ownedPacks[goThroughOwned]) < 0){
                            var idArray = ownedPacks[goThroughOwned].split('.');
                            var packTitle = '';
                            if (idArray && idArray.length < 4){//e.g. android.test.purchased
                                continue;
                            }else if (idArray && idArray.length == 4){//single pack
                                packTitle = this.makeTitle(idArray[3]);
                                promises.push(this.getCollection(packTitle, ownedPacks[goThroughOwned], this.state.pData));
                            }else if (idArray && idArray.length > 4){//combo pack
                                var assembledID = '';
                                var keepGoing = true;
                                for (var goThroughTitles=0; goThroughTitles<idArray.length; goThroughTitles++){//b = Book, c = Collection, h = Hints
                                    if (idArray[goThroughTitles].length > 1)continue;
                                    packTitle = this.makeTitle(idArray[goThroughTitles + 1]);
                                    switch (idArray[goThroughTitles]){
                                        case 'b':
                                            assembledID = 'rv.verse.book.' + idArray[goThroughTitles + 1];
                                            break;
                                        case 'c':
                                            assembledID = 'rv.verse.collection.' + idArray[goThroughTitles + 1];
                                            break;
                                        case 'h':
                                            keepGoing = false;
                                            break;
                                        default:
                                            if (goThroughTitles == idArray.length - 1)keepGoing = false;
                                    }
                                    if (!keepGoing)break;
                                    promises.push(this.getCollection(packTitle, assembledID, this.state.pData));
                                }
                            }else{
                                console.log('Unknown Product: ', ownedPacks[goThroughOwned]);
                            }
                        }
                    }
                    return Promise.all(promises);
                }else{
                  return false;
                }
            }).catch((error) => {
              console.log('line 217: ' + JSON.stringify(error))
              return false;
            }).then((collectionArray) => {
                if (collectionArray){
                    var appDataArray = this.state.pData;
                    var indexNum = this.state.pData.length;
                    for (var collectionIndex = 0; collectionIndex < collectionArray.length; collectionIndex++){
                        for (var packIndex = 0; packIndex < collectionArray[collectionIndex].length; packIndex++){
                            collectionArray[collectionIndex][packIndex].index = String(indexNum);
                            appDataArray.push(collectionArray[collectionIndex][packIndex]);
                            indexNum++;
                        }
                    }
                    this.setState({pData: appDataArray});
                }
              return true;
            }).catch((error) => {
              console.log('line 232: ' + JSON.stringify(error))
              return false;
            }).then(() => {
              let whereToGo = (this.state.seenStart == 'true')?'home':'swiper';
              setTimeout(() => {this.gotoScene(whereToGo, this.state.pData)}, 500);//Hate to do this, but avoids warning of setting state on mounted component
            }).catch((error) => {
              let whereToGo = (this.state.seenStart == 'true')?'home':'swiper';
              console.log('line 239: ' + JSON.stringify(error))
              setTimeout(() => {this.gotoScene(whereToGo, this.state.pData)}, 500);
            });
        }else{//purchased verse pack...
            this.setState({isPremium: true});
            try {
                AsyncStorage.setItem(KEY_Premium, 'true');
                AsyncStorage.setItem(KEY_PlayFirst, 'true');
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
            AsyncStorage.getItem(KEY_Verses).then((quotes) => {
                homeData = JSON.parse(quotes);
                homeData[14].show = 'false';
                homeData[15].show = 'true';
                this.setState({isPremium: true, pData: homeData});
                return homeData;
            }).then((theData) => {
                var pTitle = '';
                var promiseArray = [];
                var idSplit = this.props.productID.split('.');
                if (idSplit.length == 4){//single pack
                    pTitle = this.makeTitle(idSplit[3]);
                    promiseArray.push(this.getCollection(pTitle, this.props.productID, theData));
                }else{//combo pack
                    var packID = '';
                    var flag = true;
                    for (var gg=0; gg<idSplit.length; gg++){//b = Book, c = Collection, h = Hints
                        if (idSplit[gg].length > 1)continue;
                        pTitle = this.makeTitle(idSplit[gg + 1]);
                        switch (idSplit[gg]){
                            case 'b':
                                packID = 'rq.quotes.book.' + idSplit[gg + 1];
                                break;
                            case 'c':
                                packID = 'rq.quotes.collection.' + idSplit[gg + 1];
                                break;
                            case 'h':
                                flag = false;
                                break;
                            default:
                                if (gg == idSplit.length - 1)flag = false;
                        }
                        if (!flag)break;
                        promiseArray.push(this.getCollection(pTitle, packID, theData));
                    }
                }
                return Promise.all(promiseArray);
            }).catch((error) => {
                console.log('line 268: ' + JSON.stringify(error))
                return false;
            }).then((collectionArray) => {
                if (collectionArray){
                    var appDataArray = this.state.pData;
                    var indexNum = this.state.pData.length;
                    for (var collectionIndex = 0; collectionIndex < collectionArray.length; collectionIndex++){
                        for (var packIndex = 0; packIndex < collectionArray[collectionIndex].length; packIndex++){
                            collectionArray[collectionIndex][packIndex].index = String(indexNum);
                            appDataArray.push(collectionArray[collectionIndex][packIndex]);
                            indexNum++;
                        }
                    }
                    this.setState({pData: appDataArray});
                    return true;
                }else{
                    return false;
                }
            }).catch((error) => {
                console.log('line 277: ' + JSON.stringify(error))
                return false;
            }).then(() => {
              this.gotoScene('home', this.state.pData);
            }).catch(function(error) {
                window.alert('339: ' + error.message);
            });
        }
	}
    getData(dataArray, sNum){//retrieve server data here, sNum is offset number for daily quotes;
        return new Promise(
            function (resolve, reject) {
                const handle = Meteor.subscribe('AllData', {
                    onReady: function () {
                        const d_quotes = Meteor.collection('dataQ').find({"qnum":{$gt:-1}});//dataQ => daily quotes and homeData object
                        var qData = [];
                        var quoteStringArray = [];
                        d_quotes.forEach(function (row) {
                            if(parseInt(row.qnum, 10) == 0){//get homeData object here
                                qData = row.data;
                            }
                            if((parseInt(row.qnum, 10) >= sNum) && (parseInt(row.qnum, 10) < (sNum + 31))){//daily quotes here
                                quoteStringArray.unshift(row.quote);
                            }
                        });
                        qData.length = 22;//truncate extra elements, which shouldn't be necessary but is...
                        qData[13].quotes[0] = quoteStringArray[0];//load today's verse
                        quoteStringArray.shift();
                        for(var jj=0; jj<quoteStringArray.length; jj++){
                            qData[15].quotes[jj] = quoteStringArray[jj];//load last 30 days
                            if(jj < 3){qData[14].quotes[jj] = quoteStringArray[jj];}//load last 3 days
                        }
                        for (let addExtra=22; addExtra<dataArray.length; addExtra++){//add any extra packs onto data array
                            qData.push(dataArray[addExtra]);
                        }
                        qData[17].num_quotes = dataArray[17].num_quotes;//update Favorites and premium status...
                        qData[17].show = dataArray[17].show;
                        qData[17].quotes = dataArray[17].quotes;
                        qData[14].show = dataArray[14].show;
                        qData[15].show = dataArray[15].show;
                        resolve(qData);
                    },
                    onStop: function () {
                        window.alert('Sorry, can\'t connect to our server right now');
                        reject(error.reason);
                    }
                });
        });
    }
    getCollection(name, ID, theData){//retrieve from server set(s) of quotes...combo pack if name is string array, single if string, bonus if number
        return new Promise(
            function (resolve, reject) {
                var returnArray = [];
                var title = '';
                var index = '';
                var num_quotes = '';
                var solved = [];
                var bg_color = '';
                var quotes = [];
                var chapters = [];
                for (var k = 0; k < theData.length; k++){
                var obj = theData[k];
                    for (var el in obj) {
                        if (el == 'data'){
                            for(var j=0; j<obj[el].length; j++){
                                if(theData[k].data[j].name == name){
                                    title = theData[k].data[j].name;
                                    num_quotes = theData[k].data[j].num_quotes;
                                    bg_color = theData[k].data[j].color;
                                    continue;
                                }
                            }
                        }
                    }
                }
                var arr = new Array(parseInt(num_quotes)).fill(0);
                const subs = Meteor.subscribe('AllData', {
                    onReady: function () {
                        const d_quotes = Meteor.collection('dataQ').find({pack: name});
                        for (var key in d_quotes) {
                            var obj = d_quotes[key];
                            for (var prop in obj) {
                                if(prop=='quote'){
                                    quotes.push(obj[prop]);
                                }
                                if(prop=='chapter'){
                                    chapters.push(obj[prop]);
                                }
                            }
                        }
                        returnArray.push({
                            title: title,
                            index: theData.length.toString(),
                            type: 'mypack',
                            show: 'true',
                            num_quotes: num_quotes,
                            num_solved: '0',
                            solved: arr,
                            product_id: ID,
                            bg_color: bg_color,
                            quotes: quotes,
                            chapters: chapters,
                            on_chapter: '0'
                        });
                        resolve(returnArray);
                    },
                    onStop: function () {
                        window.alert('Sorry, can\'t connect to our server right now');
                        reject(false);
                    }
                });
        });
    }
    gotoScene(whichScene, appData){
        var myPackArray = [];
        var str = '';
        for (var key in appData){
            if (appData[key].type == 'mypack'){
                myPackArray.push(appData[key].title);
            }
        }
        var levels = [5, 5, 6, 6];
        var taken = -1;
        for(var i=0; i<4; i++){
            var titleIndex = -1;
            var rnd = Array.from(new Array(appData[levels[i]].data.length), (x,i) => i);
            rnd = shuffleArray(rnd);
            for (var r=0; r<rnd.length; r++){
                if (myPackArray.indexOf(appData[levels[i]].data[rnd[r]].name) < 0 && rnd[r] != taken){
                    titleIndex = rnd[r];
                    taken = rnd[r];
                    myPackArray.push(appData[r].title);
                    break;
                }
            }
            if (titleIndex > -1){
                appData[18 + i].title = '*' + appData[levels[i]].data[titleIndex].name;
                appData[18 + i].product_id = appData[levels[i]].data[titleIndex].product_id;
                appData[18 + i].bg_color = appData[levels[i]].data[titleIndex].color;
            }else{
                appData[18 + i].show = 'false';
            }
        }
        let connected = this.state.connectionBool;
        this.props.navigator.replace({
            id: whichScene,
            passProps: {
                homeData: appData,
                isPremium: this.state.isPremium,
                seenIntro: this.state.seenStart,
                connectionBool: connected,
                destination: 'home'
                },
       });
    }
    setNotifications(time){
        if (time == '0'){return}
        var date = new Date(Date.now() + (10 * 1000));
        var tomorrowAM = new Date(Date.now() + (moment(tonightMidnight).add(parseInt(time, 10), 'hours').valueOf()) - nowISO);

        PushNotification.localNotificationSchedule({
            message: 'Your Quote of the Day is here...',
            vibrate: true,
            largeIcon: "ic_notification",//default: "ic_launcher"
            smallIcon: "ic_notification",
            soundName: 'plink.mp3',
            //repeatType: 'day',//can be 'time', if so use following:
            repeatTime: 86400000,//daily
            date: tomorrowAM,
            id: '777',
        });
    }
    makeTitle(sentName){
        var pT = '';
        var packNameArray = sentName.split('_');
        switch (packNameArray.length){
            case 1:
                pT = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1);
                break;
            case 2:
                pT = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1) + ' ' + packNameArray[1].charAt(0).toUpperCase() + packNameArray[1].slice(1);
                break;
            case 3://_and_ in product ID, ' & ' in title
                pT = packNameArray[0].charAt(0).toUpperCase() + packNameArray[0].slice(1) + ' & ' + packNameArray[2].charAt(0).toUpperCase() + packNameArray[2].slice(1);
        }
        return pT;
    }

    render() {
		return(
			<View style={ splash_styles.container }>
				<Image style={ splash_styles.image } source={require('../images/logo.png')} />
				<ActivityIndicator style={splash_styles.spinner} animating={true} size={'large'}/>
			</View>
		)
    }
}

const splash_styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    spinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    image: {
        width: normalize(height*.35),
        height: normalize(height*.17),
        marginBottom: 20
    }
});

module.exports = SplashScreen;