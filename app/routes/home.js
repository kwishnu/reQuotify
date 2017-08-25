import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, TouchableOpacity, ListView, BackHandler, AsyncStorage, ActivityIndicator, Alert, Vibration, AppState } from 'react-native';
import moment from 'moment';
//import PushNotification from 'react-native-push-notification';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Dialog from '../components/Dialog';
import Meteor from 'react-native-meteor';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
invertColor = (hex,bw)  => {
    if (hex.indexOf('#') == 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length == 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length != 6) {
        throw new Error('Invalid HEX color.');
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#222222'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return '#'+RR+GG+BB;
}
formatData = (data) => {
    const headings = 'Daily Quotations*My Quotations*Available Collections*Completed'.split('*');
    const keys = 'daily*mypack*forsale*solved'.split('*');
    const dataBlob = {};
    const sectionIds = [];
    const rowIds = [];
    for (let sectionId = 0; sectionId < headings.length; sectionId++) {
        const currentHead = headings[sectionId];
        const currentKey = keys[sectionId];
        const packs = data.filter((theData) => theData.type == currentKey && theData.show == 'true');
        if (packs.length > 0) {
            sectionIds.push(sectionId);
            dataBlob[sectionId] = { sectionTitle: currentHead };
            rowIds.push([]);
            for (let i = 0; i < packs.length; i++) {
                const rowId = `${sectionId}:${i}`;
                rowIds[rowIds.length - 1].push(rowId);
                dataBlob[rowId] = packs[i];
            }
        }
    }
    return { dataBlob, sectionIds, rowIds };
}
//let InAppBilling = require("react-native-billing");
let Orientation = require('react-native-orientation');
let SideMenu = require('react-native-side-menu');
let Menu = require('../nav/menu');
let styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const CELL_WIDTH = Math.floor(width); // one tile's fraction of the screen width
const CELL_PADDING = Math.floor(CELL_WIDTH * .08); // 5% of the cell width...+
const TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2);
const BORDER_RADIUS = CELL_PADDING * .2;
const KEY_daily_solved_array = 'solved_array';
const KEY_show_score = 'showScoreKey';
const KEY_Score = 'scoreKey';
const KEY_NextBonus = 'bonusKey';
const KEY_Color = 'colorKey';
const KEY_midnight = 'midnight';
const KEY_Verses = 'versesKey';
const KEY_Time = 'timeKey';
const KEY_solvedTP = 'solvedTP';
const KEY_ratedTheApp = 'ratedApp';
const KEY_reverse = 'reverseFragments';
const KEY_ThankRated = 'thankRatedApp';
const KEY_ThankPremium = 'thankPremium';
const KEY_Solved = 'numSolvedKey';
const KEY_Notifs = 'notifsKey';
let homeData = [];
let dsArray = [];
let solvedTodayOrNot = false;


//  {/* A JSX comment */}

class Home extends Component{
    constructor(props) {
        super(props);
        var getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        var getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
        var ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
          getSectionData,
          getRowData
        });
        var { dataBlob, sectionIds, rowIds } = formatData(this.props.homeData);
        this.state = {
            id: 'home',
            isLoading: true,
            isOpen: false,
            shouldShowDialog: false,
            showFullDialog: true,
            moveToCompleted: 'true',
            strWhereToSend: '',
            strOpenAll: '',
            openClose: true,
            indexSelected: 0,
            todayFull: null,
            isPremium: this.props.isPremium,
            hasRated: false,
            thankedRating: false,
            thankedPremium: false,
            menuImage: require('../images/menu.png'),
            solved: 0,
            solved_opacity: 1,
            nextBonus: 0,
            reverse: true,
            homeData: this.props.homeData,
            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.addEventListener('change', this.handleAppStateChange);
        let nowISO = moment().valueOf();
        let tonightMidnight = moment().endOf('day').valueOf();
        try {
            AsyncStorage.setItem(KEY_Verses, JSON.stringify(this.props.homeData));
            AsyncStorage.setItem(KEY_Time, JSON.stringify(nowISO));
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
        homeData = this.state.homeData;
        var todayfull = moment().format('MMMM D, YYYY');
        this.setState({todayFull: todayfull});
        AsyncStorage.getItem(KEY_ThankRated).then((thanked) => {
            let thankedForRating = (thanked == 'true')?true:false;
            this.setState({thankedRating: thankedForRating});
            return AsyncStorage.getItem(KEY_ratedTheApp);
        }).then((rated) => {
            let ratedOrNot = (rated == 'true')?true:false;
            this.setState({hasRated: ratedOrNot});
            return AsyncStorage.getItem(KEY_ThankPremium);
        }).then((have_thanked) => {
            let thankedOrNot = (have_thanked == 'true')?true:false;
            this.setState({thankedPremium: thankedOrNot});
            return AsyncStorage.getItem(KEY_reverse);
        }).then((revBool) => {
            let reverseBool = (revBool == 'true')?true:false;
            this.setState({reverse: reverseBool});
            return AsyncStorage.getItem(KEY_Solved);
        }).then((numSolved) => {
            this.setState({solved: numSolved})
            return AsyncStorage.getItem(KEY_solvedTP);
        }).then((solvedTodays) => {
            if (solvedTodays !== null) {
                solvedTodayOrNot = (solvedTodays == 'true')?true:false;
            }else{
                solvedTodayOrNot = false;
                try {
                    AsyncStorage.setItem(KEY_solvedTP, 'false');
                } catch (error) {
                    window.alert('AsyncStorage error: 188' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_show_score);
        }).then((showScore) => {
            if (showScore !== null) {
                this.setState({solved_opacity: parseInt(showScore, 10)});
            }else{
                try {
                    AsyncStorage.setItem(KEY_show_score, '1');
                } catch (error) {
                    window.alert('AsyncStorage error: 199' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_daily_solved_array);
        }).then((theArray) => {
            if (theArray !== null) {
              dsArray = JSON.parse(theArray);
            } else {
                var solvedArray = new Array(31).fill('0');
                dsArray = solvedArray;
                try {
                   AsyncStorage.setItem(KEY_daily_solved_array, JSON.stringify(solvedArray));
                } catch (error) {
                   window.alert('AsyncStorage error 212: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_midnight);
        }).then((value) => {
            if (value !== null) {
                var storedMidnight = parseInt(JSON.parse(value), 10);
                var milliSecsOver = nowISO - storedMidnight;
                if(milliSecsOver > 0){//at least the next day, update daily solved array
                    solvedTodayOrNot = false;
                    var numDays = Math.ceil(milliSecsOver/86400000);
                    numDays=(numDays>30)?30:numDays;
                    for (var shiftArray=0; shiftArray<numDays; shiftArray++){
                        dsArray.unshift('0');
                        dsArray.pop();
                    }
                    try {
                        AsyncStorage.setItem(KEY_daily_solved_array, JSON.stringify(dsArray));
                        AsyncStorage.setItem(KEY_midnight, JSON.stringify(tonightMidnight));
                        AsyncStorage.setItem(KEY_solvedTP, 'false');
                    } catch (error) {
                        window.alert('AsyncStorage error: 233' + error.message);
                    }
                }
                return true;
            } else {
                try {
                    AsyncStorage.setItem(KEY_midnight, JSON.stringify(tonightMidnight));
                } catch (error) {
                    window.alert('AsyncStorage error: 241' + error.message);
                }
                return true;
            }
        }).then((ready)=>{
            this.setState({isLoading: false});
            if (this.state.hasRated){
                if (!this.state.thankedRating){
                    try {
                        AsyncStorage.setItem(KEY_ThankRated, 'true');
                    } catch (error) {
                        window.alert('AsyncStorage error: 252' + error.message);
                    }
                    if (this.state.isPremium){
                        Alert.alert('Thanks', `Thank you for the feedback, we hope you are enjoying the app!`);
                    }else{
                        Alert.alert('Thank You!', `You now have a new feature--the first tile will already be played in each Verse. You can change this in 'Settings' if you wish`);
                    }
                    this.props.navigator.pop({});
                }
            }
            if (this.props.isPremium){
                if (!this.state.thankedPremium && !this.state.thankedRating){
                    try {
                        AsyncStorage.setItem(KEY_ThankPremium, 'true');
                    } catch (error) {
                        window.alert('AsyncStorage error: 252' + error.message);
                    }
                    Alert.alert('Thank You!', `You now have a new feature: the first tile will already be played in each Verse. You can change this in 'Settings' if you wish`);
                }
            }
        }).catch(function(error) {
            window.alert('home.js: ' + error.message);
        });
        if (this.props.connectionBool == false){
            Alert.alert('No Server Connection', 'Sorry, unable to load Daily Verses');
        }
        AsyncStorage.getItem(KEY_Notifs).then((notifs) => {//remove notification from notification center if launched by that...
            if (notifs !== null && notifs !== '0') {
                this.setNotifTime(notifs);
            }
        });
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleHardwareBackButton() {
        if (this.state.isOpen) {
            this.toggle();
            return true;
        }
        if(this.state.shouldShowDialog){
            this.setState({ shouldShowDialog: false });
            return true;
        }
    }
    handleAppStateChange=(appState)=>{
        if(appState == 'active'){
            var timeNow = moment().valueOf();
            AsyncStorage.getItem(KEY_Time).then((storedTime) => {
                var sT = JSON.parse(storedTime);
                var diff = (timeNow - sT)/1000;
                if(diff>7200){
                    try {
                        AsyncStorage.setItem(KEY_Time, JSON.stringify(timeNow));
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                    this.props.navigator.replace({
                        id: 'splash',
                        passProps: {motive: 'initialize'}
                    });
                }else{
                    try {
                        AsyncStorage.setItem(KEY_Time, JSON.stringify(timeNow));
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
            });
        }
    }
    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
        if (this.state.isOpen) {
            BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        } else {
            BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }
    }
    updateMenuState(isOpen) {
        this.setState({ isOpen: isOpen });
        if (isOpen) {
            this.setState({menuImage: require('../images/arrowback.png')});
            BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        } else {
            setTimeout(()=>{
                AsyncStorage.getItem(KEY_show_score).then((showScore) => {
                    this.setState({solved_opacity: parseInt(showScore, 10)});
                    return AsyncStorage.getItem(KEY_reverse);
                }).then((rev) => {
                    let reverseBool = (rev == 'true')?true:false;
                    this.setState({reverse: reverseBool});
                }).catch((error) => {
                    window.alert('splash 256: ' + error.message);
                });
            }, 800);
            this.setState({menuImage: require('../images/menu.png')});
            BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        }
    }
    onMenuItemSelected = (item) => {
            var index = parseInt(item.index, 10);
            var myPackArray = [];
            var keepInList = [];
            switch (item.link){
                case 'home':
                    this.toggle();
                    break;
                case 'intro':
                    this.props.navigator.push({
                        id: 'swiper',
                        passProps: {
                            destination: 'home',
                            homeData: this.state.homeData,
                            seenIntro: 'true'
                        }
                    });
                    break;
                case 'store':
                    if (item.title == 'Hint Packages'){
                        this.props.navigator.push({
                            id: 'hints',
                            passProps: {
                                destination: 'home',
                                homeData: this.state.homeData,
                            }
                        });
                        return;
                    }
                    let showInfoBox = (item.title == 'Value Combinations' || item.title == 'Popular')?false:true;
                    for (var j=0; j<this.state.homeData.length; j++){
                        if (this.state.homeData[j].type == 'mypack'){
                            myPackArray.push(this.state.homeData[j].title);
                        }
                    }
                    for (var i=this.state.homeData[index].data.length - 1; i>=0; i--){
                        if(myPackArray.indexOf(this.state.homeData[index].data[i].name) < 0){
                            keepInList.unshift(this.state.homeData[index].data[i]);
                        }
                    }
                    if (index == 5)keepInList = shuffleArray(keepInList);
                    this.props.navigator.push({
                        id: 'store',
                        passProps: {
                            dataIndex: String(index),
                            title: item.title,
                            availableList: keepInList,
                            showInfoBox: showInfoBox,
                            homeData: this.state.homeData,
                        }
                    });
                    break;
                case 'facebook':
                    this.props.navigator.push({
                        id: 'social',
                        passProps: {
                            which: 'FB',
                            color: '#3b5998',
                            homeData: this.state.homeData,
                        }
                    });
                    break;
                case 'twitter'://#1da1f2
                    this.props.navigator.push({
                        id: 'social',
                        passProps: {
                            which: 'TW',
                            color: '#1da1f2',
                            homeData: this.state.homeData,
                        }
                    });
                    break;
                case 'settings': case 'about': case 'mission':
                    this.props.navigator.push({
                        id: item.link,
                        passProps: {
                            homeData: this.state.homeData,
                        }
                    });
                    break;
            }
    }
    border(color) {
        return {
            borderColor: color,
            borderWidth: 2//StyleSheet.hairlineWidth,
        };
    }
    lightBorder(color, type) {
        var lighterColor = shadeColor(color, 40);
        var bordWidth = (type == 'daily')? 1:2;
            return {
                borderColor: lighterColor,
                borderWidth: bordWidth,
            };
    }
    bg(colorSent) {
        var strToReturn=colorSent.replace(/\"/g, "");
        return {
            backgroundColor: strToReturn
        };

    }
    getTextColor(bg, index){
        var strToReturn = invertColor(bg, true);
        if(index == '13' && solvedTodayOrNot){
            strToReturn = '#999';
            return {
                color: strToReturn,
                fontWeight: 'bold'
            };
        }
        return {
            color: strToReturn,
        };
    }
    getTitle(title){
//        let appendNum = (parseInt(index, 10) > 19)?'  ' + numVerses:'';
        let titleToReturn = (title.indexOf('*') > -1)?title.substring(1):title;
//        titleToReturn = titleToReturn + appendNum;
        return titleToReturn;
    }
    onSelect(index, title, bg, productID) {
        if (title.indexOf('*') > -1){
            let theName = title.substring(1);
            let myPackArray = [];
            let keepInList = [];
            let theIndex = '';
            let theTitle = '';
            let gotIt = false;
            let itemIndex = 0;
            for (var j=0; j<this.state.homeData.length; j++){
                if (this.state.homeData[j].type == 'mypack'){
                    myPackArray.push(this.state.homeData[j].title);
                }
                if (!gotIt && this.state.homeData[j].link == 'store'){
                    for (var k=0; k<this.state.homeData[j].data.length; k++){
                        if(this.state.homeData[j].data[k].name == theName){
                            theIndex = this.state.homeData[j].index;
                            gotIt = true;
                            continue;
                        }
                    }
                }
            }
            switch(theIndex){
                case '5':
                    theTitle = 'Verse Collections';
                    break;
                case '6':
                    theTitle = 'Old Testament';
                    break;
                case '7':
                    theTitle = 'New Testament';
                    break;
            }

            for (var i=this.state.homeData[parseInt(theIndex, 10)].data.length - 1; i>=0; i--){
                if(myPackArray.indexOf(this.state.homeData[parseInt(theIndex, 10)].data[i].name) < 0){
                    keepInList.unshift(this.state.homeData[parseInt(theIndex, 10)].data[i]);
                }
            }
            var putMeBack = null;
            for(var whatsLeft = 0; whatsLeft<keepInList.length; whatsLeft++){
                if(keepInList[whatsLeft].name == theName){
                    putMeBack = keepInList.splice(whatsLeft, 1);
                    continue;
                }
            }
            if (theTitle == 'Verse Collections')keepInList = shuffleArray(keepInList);
            keepInList.unshift(putMeBack[0]);
            this.props.navigator.push({
                id: 'store',
                passProps: {
                    dataIndex: theIndex,
                    title: theTitle,
                    availableList: keepInList,
                    showInfoBox: true,
                    homeData: this.state.homeData,
                }
            });
            this.toggle();
            return;
        }

        if (index == '17'){//favorites
            let verseArray = [];
            for (let v=0; v< this.state.homeData[17].verses.length; v++){
                verseArray.push(v + '**' + this.state.homeData[17].verses[v]);
            }
            this.props.navigator.replace({
                id: 'favorites',
                passProps: {
                    homeData: this.state.homeData,
                    daily_solvedArray: dsArray,
                    title: 'My Favorites',
                    reverse: this.state.reverse,
                    dataSource: verseArray,
                    dataElement: index,
                    isPremium: this.state.isPremium,
                    bgColor: colors.pale_bg
                },
            });
            return;
        }
        let pIDarr = productID.split('.');
        let theDestination = pIDarr[2];
        let gripeText = '';
        let useColors = '';
        let bgColorToSend = '';

        switch(title){
            case 'Quote of the Day':
                theDestination = 'game';
                this.props.navigator.replace({
                    id: theDestination,
                    passProps: {
                        homeData: this.state.homeData,
                        daily_solvedArray: dsArray,
                        title: this.state.todayFull,
                        index: '0',
                        bgColor: bg,
                        reverse: this.state.reverse,
                        fromWhere: 'home',
                        dataElement: index
                    },
                });
                return;
            case 'Last Three Days':
                gripeText = 'Purchase any item in the app and always have access here to the previous 30 Daily Verses!';
            case 'Last Thirty Days':  //fallthrough
                theDestination = 'daily';
                theTitle = 'Daily Verses';
                this.props.navigator.replace({
                    id: theDestination,
                    passProps: {
                        homeData: this.state.homeData,
                        daily_solvedArray: dsArray,
                        title: theTitle,
                        todayFull: this.state.todayFull,
                        gripeText: gripeText,
                        reverse: this.state.reverse,
                        dataElement: index,
                        isPremium: this.state.isPremium,
                        bgColor: colors.pale_bg//'#795959'
                    },
                });
                return;
        }
        AsyncStorage.getItem(KEY_Color).then((colors) => {//a verse collection or book launcher:
            if (colors !== null) {
                useColors = colors;
            }else{
                useColors = 'true';
                try {
                    AsyncStorage.setItem(KEY_Color, useColors);//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            bgColorToSend = (useColors == 'true')?bg:colors.pale_bg;
            this.props.navigator.replace({
                id: theDestination,
                passProps: {
                    homeData: this.state.homeData,
                    daily_solvedArray: dsArray,
                    title: title,
                    todayFull: this.state.todayFull,
                    reverse: this.state.reverse,
                    dataElement: index,
                    isPremium: this.state.isPremium,
                    bgColor: bgColorToSend
                },
            });
        });
    }
    showDialog(index, type, id){
        if(index < 16)return;
        if(index == 17){
            this.setState({item2Color: '#555555'});
        }else{
            this.setState({item2Color: '#ffffff'});
        }
        let idArray = id.split('.');
        if (idArray[2] == 'book')this.setState({item2Color: '#555555'});
        Vibration.vibrate(34);
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        if(type == 'mypack' || type == 'solved'){
            let strSolvedOrNot = (type == 'solved')?'Move to My Collections':'Move to Completed';
            let sendToCompleted = (type == 'solved')?'false':'true';
            let strOpenOrClose = (parseInt(this.state.homeData[index].num_solved, 10) < parseInt(this.state.homeData[index].num_verses, 10))?'Open all quotes':'Open first only';
            let openOrClose = (strOpenOrClose == 'Open all verses')? true:false;

            this.setState({ shouldShowDialog: true,
                            showFullDialog: true,
                            strWhereToSend: strSolvedOrNot,
                            moveToCompleted: sendToCompleted,
                            indexSelected: index,
                            strOpenAll: strOpenOrClose,
                            openClose: openOrClose
            });
        }else{
            this.setState({ shouldShowDialog: true,
                            showFullDialog: false
            });
        }
    }
    onDialogSelect(which){
        this.setState({ shouldShowDialog: false });
        var getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
        var getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
        var ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
          getSectionData,
          getRowData
        });
        switch(which){
            case 0://touch outside of dropdown, just close
                return;
            case 1://move to or from Completed
                let whatToCallIt = (this.state.moveToCompleted == 'true')?'solved':'mypack';
                this.state.homeData[this.state.indexSelected].type = whatToCallIt;
                break;
            case 2://open all or first only
                if(this.state.openClose){
                    this.state.homeData[this.state.indexSelected].num_solved = this.state.homeData[this.state.indexSelected].num_verses;
                }else{
                    this.state.homeData[this.state.indexSelected].num_solved = '0';
                }
                break;
            case 3://hide or show
                this.state.homeData[this.state.indexSelected].show = 'false';
                break;
            case 4://show hidden, if any
                for (let showVerses=16; showVerses<this.state.homeData.length; showVerses++){
                    this.state.homeData[showVerses].show = 'true';
                }
                break;
           }
            try {
                AsyncStorage.setItem(KEY_Verses, JSON.stringify(this.state.homeData));
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
            var { dataBlob, sectionIds, rowIds } = formatData(this.state.homeData);
            this.setState({ homeData: this.state.homeData,
                            dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)
            });
    }
    setNotifTime(key: value){
//        PushNotification.cancelLocalNotifications({id: '777'});
        this.startNotifications(key.selectedValue);
        this.setState({ notif_time: key.selectedValue });
        try {
            AsyncStorage.setItem(KEY_Notifs, key.selectedValue);
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }
    startNotifications(time) {
        const nowISO = moment().valueOf();
        const tonightMidnight = moment().endOf('day').valueOf();
        var tomorrowAM = new Date(Date.now() + (moment(tonightMidnight).add(parseInt(time, 10), 'hours').valueOf()) - nowISO);
//        PushNotification.localNotificationSchedule({
//            message: "A new Daily Verse is in!",
//            vibrate: true,
//            soundName: 'plink.mp3',
//            //repeatType: 'day',//can be 'time', if so use following:
//            repeatTime: 86400000,//daily
//            date: tomorrowAM,
//            id: '777',
//        });
    }


    render() {
        const menu = <Menu onItemSelected={this.onMenuItemSelected} data = {this.props.homeData} />;
        if(this.state.isLoading == true){
            return(
                <View style={container_styles.loading}>
                    <ActivityIndicator style={container_styles.spinner} animating={true} size={'large'}/>
                </View>
            )
        }else{
            return (
                <SideMenu menu={ menu } isOpen={ this.state.isOpen } onChange={ (isOpen) => this.updateMenuState(isOpen) }>
                    <View style={ [container_styles.container, this.border(colors.home_border)] }>
                        <View style={ container_styles.header }>
                            <Button style={[container_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.toggle() }>
                                <Image source={this.state.menuImage} style={ { width: getArrowSize(), height: getArrowSize() } } />
                            </Button>
                            <Image source={ require('../images/logo2.png') } style={ { width: normalize(height * .3), height: normalize(height * .07) } } />
                            <Button style={[container_styles.button, {marginRight: getArrowMargin()}]} >
                                <Image source={ require('../images/noimage.png') } style={ { width: getArrowSize(), height: getArrowSize() } } />
                            </Button>
                            <View style={ container_styles.solved }>
                                <Text style={[container_styles.total_text, {opacity: this.state.solved_opacity}]}>Solved:</Text>
                                <Text style={[container_styles.total_text, {opacity: this.state.solved_opacity}]}>{this.state.solved.toLocaleString()}</Text>
                            </View>
                        </View>
                        <View style={ container_styles.verses_container }>
                             <ListView  showsVerticalScrollIndicator ={false}
                                        contentContainerStyle={ container_styles.listview }
                                        dataSource={this.state.dataSource}
                                        renderRow={(rowData) =>
                                             <View>
                                                 <TouchableHighlight onPress={() => this.onSelect(rowData.index, rowData.title, rowData.bg_color, rowData.product_id)}
                                                                     onLongPress={()=> this.showDialog(rowData.index, rowData.type, rowData.product_id)}
                                                                     style={[container_styles.launcher, this.bg(rowData.bg_color), this.lightBorder(rowData.bg_color, rowData.type)]}
                                                                     underlayColor={rowData.bg_color} >
                                                     <Text style={[container_styles.launcher_text, this.getTextColor(rowData.bg_color, rowData.index)]}>{this.getTitle(rowData.title)}</Text>
                                                 </TouchableHighlight>
                                             </View>
                                         }
                                         renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
                             />
                        </View>
                        {this.state.shouldShowDialog &&
                                <Dialog item2Color={this.state.item2Color} showFull={this.state.showFullDialog} onPress={(num)=>{ this.onDialogSelect(num); }} item1={this.state.strWhereToSend} item2={this.state.strOpenAll} item3={'Hide from Contents'} item4={'Show hidden collections'} />
                        }
                     </View>
                </SideMenu>
            );
        }
    }
}


const container_styles = StyleSheet.create({
    container: {
        flex: 1
    },
    spinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222'
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40
    },
    header: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
        backgroundColor: '#000000'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    solved: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'flex-end',
        right: 10,
        top: 10,
        width: width/3,
        height: configs.LETTER_SIZE
    },
    total_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.054),
        color: '#ffffff'
    },
    verses_container: {
        flex: 48,
        backgroundColor: colors.blue_bg,
        justifyContent: 'center',
        alignItems: 'center'
    },
    launcher: {
        width: height*.21,
        height: height*.21,
        borderRadius: BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 1,
        marginHorizontal: 3,
        padding: width*.05
    },
    launcher_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.1),
        textAlign: 'center'
    }
});

module.exports = Home;
