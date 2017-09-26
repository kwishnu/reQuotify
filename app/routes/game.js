import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler, AsyncStorage, Animated, ActivityIndicator, Alert, Platform, Linking, AppState, NetInfo, TextInput, ToastAndroid } from 'react-native';
import moment from 'moment';
import FabricTwitterKit from 'react-native-fabric-twitterkit';
import Button from '../components/Button';
import Overlay from '../components/Overlay';
import * as Animatable from 'react-native-animatable';
import Tile from '../components/Tile';
import DropdownMenu from '../components/DropdownMenu';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
const UIManager = require('NativeModules').UIManager;
const deepCopy = require('../config/deepCopy.js');
const bonuses = require('../config/bonuses.js');
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const scrHeight = height;
const scrWidth = width;
const KEY_Sound = 'soundKey';
const KEY_Verses = 'versesKey';
const KEY_solvedTP = 'solvedTP';
const KEY_Solved = 'numSolvedKey';
const KEY_NextBonus = 'bonusKey';
const KEY_ratedTheApp = 'ratedApp';
const KEY_showFB = 'showFBKey';
const KEY_showTwitter = 'showTwitterKey';
const KEY_Favorites = 'numFavoritesKey';
const KEY_daily_solved_array = 'solved_array';
const KEY_Time = 'timeKey';
const KEY_ShowedGameOverlay = 'showedOverlay';
const KEY_MyHints = 'myHintsKey';
const KEY_Premium = 'premiumOrNot';
const KEY_PlayFirst = 'playFirstKey';
const KEY_HideVerse = 'hideVerseKey';
let dsArray = [];
let homeData = {};
let Sound = require('react-native-sound');
const click = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    window.alert('Sound file not found');
  }
});
const plink1 = new Sound('plink.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    window.alert('Sound file not found');
  }
});
const plink2 = new Sound('plink.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    window.alert('Sound file not found');
  }
});
const swish = new Sound('swish.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    window.alert('Sound file not found');
  }
});
const blat = new Sound('block.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    window.alert('Sound file not found');
  }
});
const fanfare = new Sound('gliss.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    window.alert('Sound file not found');
  }
});
hasAZero = (element, index, array) => {
  return element < 1;

}
cleanup = (sentence) => {
   return sentence.toLowerCase().replace(/[^a-zA-Z]+/g, "");

}
randomBetween = (min,max) => {
    return Math.floor(Math.random()*(max-min+1)+min);

}
reverse = (s) => {
    return s.split("").reverse().join("");

}
shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
shadeColor = (color, percent) => {
    percent = percent/100;
    let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
invertColor = (hex, bw) => {
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
}


class Game extends Component {
    constructor(props) {
        super(props);
        this.hintAnimation =
                setInterval(() => {
                    this.refs.hintbutton.tada(1500);
                }, 25000);

        this.flip = new Animated.Value(0);
        this.grow = new Animated.Value(0);
        this.opac = new Animated.Value(0);
        this.state = {
            id: 'game',
            title: this.props.title,
            index: this.props.index,
            homeData: this.props.homeData,
            daily_solvedArray: this.props.daily_solvedArray,
            dataElement: this.props.dataElement,
            shouldShowDropdown: false,
            isLoading: true,
            pan: new Animated.ValueXY(0),
            scale: new Animated.Value(1),
            bgColor: this.props.bgColor,
            panelBgColor: this.props.bgColor,
            panelBorderColor: invertColor(this.props.bgColor, true),
            showingVerse: false,
            rows2: true,
            rows3: true,
            rows4: true,
            rows5: true,
            rows6: true,
            rows7: true,
            rows8: true,
            numberOfRows: 1,
            frag0: '', frag1: '', frag2: '', frag3: '', frag4: '', frag5: '', frag6: '', frag7: '', frag8: '', frag9: '', frag10: '', frag11: '', frag12: '',
            frag13: '', frag14: '', frag15: '', frag16: '', frag17: '', frag18: '',frag19: '', frag20: '', frag21: '', frag22: '', frag23: '',
            panelText: '',
            line0Text: '',
            line1Text: '',
            line2Text: '',
            line3Text: '',
            line4Text: '',
            line5Text: '',
            line6Text: '',
            line7Text: '',
            nextFrag: '',
            onThisFragment: 0,
            fragmentOrder: [],
            wordsArray: [[], [], [], [], [], [], [], []],
            wordArrayPosition: [0, 0, 0],
            verseKey: '',
            quotedPerson: '',
            initialLetter: '',
            addSpace: false,
            showNextArrow: false,
            showButtons: false,
            showHintButton: true,
            showFB: true,
            showTwitter: true,
            showFavorites: true,
            showBook: false,
            chapterNum: 0,
            numFavorites: 0,
            letterImage: require('../images/letters/i.png'),
            arrowImage: require('../images/arrowforward.png'),
            scaleXY: new Animated.Value(0),
            soundString: 'Mute Sounds',
            useSounds: true,
            doneWithQuote: false,
            playedFirst: false,
            isPremium: false,
            numHints: 0,
            numSolved: 0,
            nextBonus: 0,
            hasRated: false,
            hasPaidForHints: false,
            hintNumOpacity: 1,
            hasInfiniteHints: false,
            entireQuote: '',
            openedAll: false,
            shouldShowOverlay: false,
            shouldShowGuesses: false,
            shouldShowGuessHeader: false,
            name1: '',
            name2: '',
            name3: '',
            bg1Color: colors.medium_gray,
            bg2Color: colors.medium_gray,
            bg3Color: colors.medium_gray,
            closeQuoteX: 0,
            closeQuoteY: 0,
            showCloseQuote: false,
            dummyText: '',
            numLines: 0,
            quoted: ''
        }
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        if (this.props.dataElement == 17)this.setState({showFavorites: false});
        let reverseTiles = this.props.reverse;
        this.setPanelColors();
//        let titleText=(this.props.fromWhere == 'book')?'':this.props.title;
//        this.setState({title: titleText});
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.addEventListener('change', this.handleAppStateChange);
        homeData = this.props.homeData;
        if (homeData[this.props.dataElement].num_solved == homeData[this.props.dataElement].num_quotes)this.setState({openedAll: true});
        let quoteArray = this.props.homeData[this.props.dataElement].quotes[this.props.index].split('**');
        dsArray = this.props.daily_solvedArray;
        let numHints = parseInt(quoteArray[0], 10);
        let quotedPerson = quoteArray[1];
        let quoteStr = quoteArray[2].replace(/  +/g, ' ');
        let saveQuote = quoteStr;
        let initial = quoteStr.substr(0, 1);
        quoteStr = quoteStr.substring(1);
        switch(initial){
            case 'A': case 'a':
                this.setState({ letterImage: require('../images/letters/a.png') });
                break;
            case 'B': case 'b':
                this.setState({ letterImage: require('../images/letters/b.png') });
                break;
            case 'C': case 'c':
                this.setState({ letterImage: require('../images/letters/c.png') });
                break;
            case 'D': case 'd':
                this.setState({ letterImage: require('../images/letters/d.png') });
                break;
            case 'E': case 'e':
                this.setState({ letterImage: require('../images/letters/e.png') });
                break;
            case 'F': case 'f':
                this.setState({ letterImage: require('../images/letters/f.png') });
                break;
            case 'G': case 'g':
                this.setState({ letterImage: require('../images/letters/g.png') });
                break;
            case 'H': case 'h':
                this.setState({ letterImage: require('../images/letters/h.png') });
                break;
            case 'I': case 'i':
                this.setState({ letterImage: require('../images/letters/i.png') });
                break;
            case 'J': case 'j':
                this.setState({ letterImage: require('../images/letters/j.png') });
                break;
            case 'K': case 'k':
                this.setState({ letterImage: require('../images/letters/k.png') });
                break;
            case 'L': case 'l':
                this.setState({ letterImage: require('../images/letters/l.png') });
                break;
            case 'M': case 'm':
                this.setState({ letterImage: require('../images/letters/m.png') });
                break;
            case 'N': case 'n':
                this.setState({ letterImage: require('../images/letters/n.png') });
                break;
            case 'O': case 'o':
                this.setState({ letterImage: require('../images/letters/o.png') });
                break;
            case 'P': case 'p':
                this.setState({ letterImage: require('../images/letters/p.png') });
                break;
            case 'Q': case 'q':
                this.setState({ letterImage: require('../images/letters/q.png') });
                break;
            case 'R': case 'r':
                this.setState({ letterImage: require('../images/letters/r.png') });
                break;
            case 'S': case 's':
                this.setState({ letterImage: require('../images/letters/s.png') });
                break;
            case 'T': case 't':
                this.setState({ letterImage: require('../images/letters/t.png') });
                break;
            case 'U': case 'u':
                this.setState({ letterImage: require('../images/letters/u.png') });
                break;
            case 'V': case 'v':
                this.setState({ letterImage: require('../images/letters/v.png') });
                break;
            case 'W': case 'w':
                this.setState({ letterImage: require('../images/letters/w.png') });
                break;
            case 'X': case 'x':
                this.setState({ letterImage: require('../images/letters/x.png') });
                break;
            case 'Y': case 'y':
                this.setState({ letterImage: require('../images/letters/y.png') });
                break;
            case 'Z': case 'z':
                this.setState({ letterImage: require('../images/letters/z.png') });
                break;
            default:
                this.setState({ letterImage: require('../images/letters/i.png') });
        }
        if (this.props.fromWhere == 'book'){
            var showBookOrNot = false;
            var chapIndex = 0;
            if (quoteArray[3] == 'show'){
                showBookOrNot = true;
                chapIndex = parseInt(quoteArray[4], 10);
            }
        }else{
            var rndNum = randomBetween(1, 3);
            var topName = '';
            var middleName = '';
            var bottomName = '';
            switch (rndNum){
                case 1:
                    topName = quoteArray[1];
                    middleName = quoteArray[3];
                    bottomName = quoteArray[4];
                    break;
                case 2:
                    topName = quoteArray[3];
                    middleName = quoteArray[1];
                    bottomName = quoteArray[4];
                    break;
                case 3:
                    topName = quoteArray[4];
                    middleName = quoteArray[3];
                    bottomName = quoteArray[1];
                    break;
                default:
                    topName = quoteArray[1];
                    middleName = quoteArray[3];
                    bottomName = quoteArray[4];
                    break;
            }
        }
        this.populateArrays(quoteStr, numHints, reverseTiles).then((values) => {
            if(values){
                this.setState({ numHints: values.hints, fragmentOrder: values.fragmentOrder, nextFrag: values.nextFrag, frag0: values.frag0, frag1: values.frag1, frag2: values.frag2, frag3: values.frag3, frag4: values.frag4, frag5: values.frag5, frag6: values.frag6, frag7: values.frag7, frag8: values.frag8, frag9: values.frag9, frag10: values.frag10,
                                frag11: values.frag11, frag12: values.frag12,  frag13: values.frag13, frag14: values.frag14, frag15: values.frag15, frag16: values.frag16, frag17: values.frag17, frag18: values.frag18, frag19: values.frag19, frag20: values.frag20, frag21: values.frag21, frag22: values.frag22, frag23: values.frag23,
                                quotedPerson: quotedPerson, entireQuote: saveQuote, quoted: quoteArray[1], name1: topName, name2: middleName, name3: bottomName, showBook: showBookOrNot, chapterNum: chapIndex
                })
                this.assignWordsToRows(quoteStr);
            }
            return this.getRowBools(values.length);
        }).then((bools) => {
            if(bools){
                this.setState({
                    rows2: bools[0][0], rows3: bools[0][1], rows4: bools[0][2], rows5: bools[0][3], rows6: bools[0][4], rows7: bools[0][5], rows8: bools[0][6], numberOfRows: bools[1]
                })
            }
            return AsyncStorage.getItem(KEY_Sound);
        }).then((sounds) => {
            if (sounds !== null) {
                var soundStr = (sounds == 'true')?'Mute Sounds':'Use Sounds';
                var soundBool = (sounds == 'true')?true:false;
                this.setState({soundString: soundStr, useSounds: soundBool});
            }else{
                try {
                    AsyncStorage.setItem(KEY_Sound, 'true');//
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_ShowedGameOverlay);
        }).then((showedOrNot) => {
            if (showedOrNot == 'false'){
                this.setState({shouldShowOverlay: true});
                try {
                    AsyncStorage.setItem(KEY_ShowedGameOverlay, 'true');
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_HideVerse);
        }).then((hide) => {
            if (hide == 'false'){
                this.setState({panelText:  quotedPerson,
                                           panelBgColor: '#555555',
                                           panelBorderColor: '#000000',
                                           showingVerse: true
                })
            }
            return AsyncStorage.getItem(KEY_Premium);
        }).then((premium) => {
            let hasPremium = (premium == 'true')?true:false;
            if (hasPremium){
                this.setState({isPremium: hasPremium, hintNumOpacity: 1});
            }else{
                this.setState({ hintNumOpacity: 0 });
            }
            return AsyncStorage.getItem(KEY_MyHints);
        }).then((numHintsStr) => {
            if (numHintsStr == 'infinite'){
                this.setState({hasInfiniteHints: true, hintNumOpacity: 0});
            }else{
                let num = parseInt(numHintsStr, 10);
                if (num > -1){
                    this.setState({hasPaidForHints: true, hintNumOpacity: 1});
                    if (num > 1)this.setState({numHints: num});
                }else{
                    this.setState({hasPaidForHints: false, hintNumOpacity: 0});
                }
            }
            return AsyncStorage.getItem(KEY_NextBonus);
        }).then((nb) => {
            if (nb !== null){
                this.setState({nextBonus: parseInt(nb, 10)});
            }else{
                this.setState({nextBonus: '10'});
                try {
                    AsyncStorage.setItem(KEY_NextBonus, '20');
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
            return AsyncStorage.getItem(KEY_Solved);
        }).then((solved) => {
            let ns = parseInt(solved, 10);
            this.setState({numSolved: ns});
            return AsyncStorage.getItem(KEY_ratedTheApp);
        }).then((rated) => {
            let ratedBool = (rated == 'true')?true:false;
            this.setState({hasRated: ratedBool});
            return AsyncStorage.getItem(KEY_showFB);
        }).then((fb) => {
            let showFB = (fb == 'true')?true:false;
            this.setState({showFB: showFB});
            return AsyncStorage.getItem(KEY_showTwitter);
        }).then((tw) => {
            let showTwitter = (tw == 'true')?true:false;
            this.setState({showTwitter: showTwitter});
            return AsyncStorage.getItem(KEY_Favorites);
        }).then((favs) => {
            let numFavs = parseInt(favs, 10);
            this.setState({numFavorites: numFavs});
            return AsyncStorage.getItem(KEY_PlayFirst);
        }).then((playFirst) => {
            if (playFirst == 'true'){
                this.playFirst();
            }else{
                this.setState({playedFirst: true});
            }
        }).then(() =>
            {
            setTimeout(()=>{
                this.setState({ isLoading: false });
//                if (this.props.fromWhere == 'book')this.flipPanel(true);
            }, 250);
            setTimeout(()=>{
                this.refs.openquote.rubberBand(2000);
            }, 500);
            })
    }
    componentWillUnmount () {
        clearInterval(this.hintAnimation);
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleHardwareBackButton() {
        if(this.state.shouldShowDropdown){
            this.setState({ shouldShowDropdown: false });
        }else{
            this.closeGame(this.props.fromWhere);
        }
        return true;
    }
    setPanelColors(){
        let darkerPanel = shadeColor(this.props.bgColor, -10);
        let darkerBorder = shadeColor(this.props.bgColor, -50);
        this.setState({panelBgColor: darkerPanel, panelBorderColor: darkerBorder});
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
                    setTimeout(()=>{
                        this.refs.openquote.rubberBand(2000);
                    }, 750);
                }
            });
        }
    }
    assignWordsToRows(verse){
        let layout = [[], [], [], [], [], [], [], []];
        let leadingSpace = (verse.substring(0, 1) == ' ')?true:false;
        let leadingApostrophe = (verse.substring(0, 1) == '\'' || verse.substring(0, 1) == '’')?'’':'';
        if (leadingSpace || leadingApostrophe)verse = verse.substring(1);
        let quoteArray = verse.split(' ');
        let whichRow = 0;
        let letterTotal = 0;
        let lineLength = 0;
        let rows = 0;
        for (let word=0; word<quoteArray.length; word++){
            letterTotal += (quoteArray[word].length + 1);
            lineLength = (whichRow < 2)?21:28;
            if (letterTotal > lineLength){
                layout[whichRow + 1].push(quoteArray[word]);
                letterTotal = quoteArray[word].length + 1;
                whichRow += 1;
            }else{
                layout[whichRow].push(quoteArray[word]);
            }
        }
        for (let check = 0; check < layout.length; check++){
            if (layout[check].length > 0)rows += 1;
        }
        let lastLine = layout[whichRow].join(' ');
        this.setState({wordsArray: layout, dummyText: lastLine, numLines: rows, line0Text: leadingApostrophe});
    }
    getRowBools(length){
        return new Promise(
            function (resolve, reject) {
                let showRowBools = [false, false, false, false, false, false, false];
                let rows = 1;
                switch(length){
                    case 6:
                        showRowBools[0] = true;
                        rows = 2;
                        break;
                    case 9:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        rows = 3;
                        break;
                    case 12:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        rows = 4;
                        break;
                    case 15:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        rows = 5;
                        break;
                    case 18:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        showRowBools[4] = true;
                        rows = 6;
                        break;
                    case 21:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        showRowBools[4] = true;
                        showRowBools[5] = true;
                        rows = 7;
                        break;
                    case 24:
                        showRowBools[0] = true;
                        showRowBools[1] = true;
                        showRowBools[2] = true;
                        showRowBools[3] = true;
                        showRowBools[4] = true;
                        showRowBools[5] = true;
                        showRowBools[6] = true;
                        rows = 8;
                        break;
                }
                if(showRowBools){
                    resolve([showRowBools, rows]);
                }else{
                    reject(false);
                }
        });
    }
    populateArrays(theQuote, num, reverseTiles){
        return new Promise(
            function (resolve, reject) {
                let verseKeyString = cleanup(theQuote);
                let fragments = [];
                let remainingStr = verseKeyString;
                let haveFinished = false;
                let rndLength = 0;
                while (!haveFinished){
                    let fragAssemble = '';
                    if (remainingStr.length > 15){
                        rndLength = randomBetween(4, 8);
                        for (let i=0; i<rndLength; i++){
                            fragAssemble += remainingStr.substr(i, 1);
                        }
                        remainingStr = remainingStr.substring(rndLength);
                        fragments.push(fragAssemble);
                    }else{
                        let twoNumbers = [];
                        switch(remainingStr.length){
                            case 8:
                                twoNumbers = [4, 4];
                                break;
                            case 9:
                                twoNumbers = [4, 5];
                                break;
                            case 10:
                                twoNumbers = [4, 6];
                                break;
                            case 11:
                                twoNumbers = [5, 6];
                                break;
                            case 12:
                                twoNumbers = [5, 7];
                                break;
                            case 13:
                                twoNumbers = [6, 7];
                                break;
                            case 14:
                                twoNumbers = [7, 7];
                                break;
                            case 15:
                                twoNumbers = [7, 8];
                                break;
                        }
                        for (let ii=0; ii<2; ii++){
                            for (let iii=0; iii<twoNumbers[ii]; iii++){
                                fragAssemble += remainingStr.substr(iii, 1);
                            }
                            remainingStr = remainingStr.substring(twoNumbers[0]);
                            fragments.push(fragAssemble);
                            fragAssemble = '';
                        }
                        if (fragments.length % 3 == 0 && fragments.length < 25){
                            const count = fragments =>
                                fragments.reduce((a, b) =>
                                    Object.assign(a, {[b]: (a[b] || 0) + 1}), {});//checking for duplicate fragments
                            const duplicates = dict =>
                                Object.keys(dict).filter((a) => dict[a] > 1);
                            let dup = false;
                            let nameObj = count(fragments);
                            for (var prop in nameObj) {
                                if (nameObj[prop] > 1)dup = true;
                            }
                            if(!dup)haveFinished = true;
                        }else{
                            fragments.length = 0;
                            remainingStr = verseKeyString;
                        }
                    }
                }
                let f2 = owl.deepCopy(fragments);
                if (reverseTiles){
                    for (let j=0; j<f2.length; j++){
                        let rnd = randomBetween(1, 10);
                        if (rnd < 5){
                            f2[j] = reverse(f2[j]);
                        }
                    }
                }
                f2 = shuffleArray(f2);
                let difference = 24 - f2.length;
                for (let jj=0; jj<difference; jj++){
                    f2.push('');
                }
                let returnObject={ hints: num, length: fragments.length, frag0: f2[0], frag1: f2[1], frag2: f2[2], frag3: f2[3], frag4: f2[4], frag5: f2[5], frag6: f2[6], frag7: f2[7], frag8: f2[8], frag9: f2[9], frag10: f2[10], frag11: f2[11], frag12: f2[12],
                                   frag13: f2[13], frag14: f2[14], frag15: f2[15], frag16: f2[16], frag17: f2[17], frag18: f2[18], frag19: f2[19], frag20: f2[20], frag21: f2[21], frag22: f2[22], frag23: f2[23],
                                   fragmentOrder: fragments, nextFrag: fragments[0]
                                 }
                if (haveFinished){
                    resolve(returnObject);
                }else{
                    reject(false);
                }
        });
    }
    getText(verse){
        let quoteArray = verse.split('**');
        let bookName = this.props.title.substring(0, this.props.title.indexOf(' ', -1));
        return quoteArray[1];

    }
    seeInReader(){
        this.props.navigator.push({
            id: 'reader',
            passProps: {
                fromWhere: 'game',
                homeData: this.props.homeData,
                dataElement: this.props.dataElement,
                chapterIndex: this.state.chapterNum,
                theQuote: this.state.entireQuote,
                reverse: this.props.reverse
            }
        });
    }
    nextGame(){
//        if(this.props.fromWhere == 'favorites'){
//            this.closeGame('favorites');
//            return;
//        }
        let newIndex = String(+this.state.index + +1);
        let onLastVerse = (this.props.fromWhere == 'home' || newIndex == this.props.homeData[this.props.dataElement].num_quotes)?true:false;
        if(onLastVerse){
            this.closeGame('home');
            return;
        }
        let nextTitle = '';
        if(this.props.fromWhere == 'daily'){
            let today = moment(this.props.title, 'MMMM D, YYYY');
            nextTitle = today.subtract(1, 'days').format('MMMM D, YYYY');
        }else if(this.props.fromWhere == 'book' || this.props.fromWhere == 'favorites'){
            nextTitle = this.getText(this.props.homeData[this.props.dataElement].quotes[newIndex]);
        }else{
            nextTitle = (parseInt(this.props.title, 10) + 1).toString();
        }
        this.props.navigator.replace({
            id: 'bounce',
            passProps: {
                sender: 'game',
                homeData: this.props.homeData,
                daily_solvedArray: this.state.daily_solvedArray,
                dataElement: this.props.dataElement,
                textColor: this.props.textColor,
                bgColor: this.props.bgColor,
                senderTitle: this.props.myTitle,
                fromWhere: this.props.fromWhere,
                title: nextTitle,
                index: newIndex,
                reverse: this.props.reverse
            }
       });
    }
    reset_scene(){
        this.props.navigator.replace({
            id: 'bounce',
            passProps: {
                sender: 'game',
                homeData: this.props.homeData,
                daily_solvedArray: this.state.daily_solvedArray,
                dataElement: this.props.dataElement,
                textColor: this.props.textColor,
                bgColor: this.props.bgColor,
                senderTitle: this.props.myTitle,
                fromWhere: this.props.fromWhere,
                title: this.props.title,
                index: this.props.index,
                reverse: this.props.reverse
            }
       });
    }
    closeGame(where){
        if (where == 'favorites'){
            let quoteArray = [];
            for (let v=0; v< this.state.homeData[17].quotes.length; v++){
                quoteArray.push(v + '**' + this.state.homeData[17].quotes[v]);
            }
            this.props.navigator.replace({
                id: 'favorites',
                passProps: {
                    homeData: this.state.homeData,
                    daily_solvedArray: dsArray,
                    title: 'My Favorites',
                    dataSource: quoteArray,
                    dataElement: '17',
                    isPremium: this.state.isPremium,
                    bgColor: colors.pale_green,
                    reverse: this.props.reverse
                },
            });
            return;
        }
        let myPackArray = [];
        let str = '';
        for (let key in homeData){
            if (homeData[key].type == 'mypack'){
                myPackArray.push(homeData[key].title);
            }
        }
        var levels = [5, 5, 6, 6];
        var taken = -1;
        for(var i=0; i<4; i++){
            var titleIndex = -1;
            var rnd = Array.from(new Array(homeData[levels[i]].data.length), (x,i) => i);
            rnd = shuffleArray(rnd);
            for (var r=0; r<rnd.length; r++){
                if (myPackArray.indexOf(homeData[levels[i]].data[rnd[r]].name) < 0 && rnd[r] != taken){
                    titleIndex = rnd[r];
                    taken = rnd[r];
                    myPackArray.push(homeData[r].title);
                    break;
                }
            }
            if (titleIndex > -1){
                homeData[18 + i].title = '*' + homeData[levels[i]].data[titleIndex].name;
                homeData[18 + i].product_id = homeData[levels[i]].data[titleIndex].product_id;
                homeData[18 + i].num_quotes = homeData[levels[i]].data[titleIndex].num_quotes;
                homeData[18 + i].bg_color = homeData[levels[i]].data[titleIndex].color;
            }else{
                homeData[18 + i].show = 'false';
            }
        }
        try {
            AsyncStorage.setItem(KEY_Verses, JSON.stringify(homeData));
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
        this.props.navigator.replace({
            id: where,
            passProps: {
                homeData: this.props.homeData,
                daily_solvedArray: this.state.daily_solvedArray,
                dataElement: this.props.dataElement,
                textColor: this.props.textColor,
                bgColor: this.props.bgColor,
                title: this.props.myTitle,
                reverse: this.props.reverse
            }
       });
    }
    onDrop(text) {
        let line0String = this.state.line0Text;
        let line1String = this.state.line1Text;
        let line2String = this.state.line2Text;
        let line3String = this.state.line3Text;
        let line4String = this.state.line4Text;
        let line5String = this.state.line5Text;
        let line6String = this.state.line6Text;
        let line7String = this.state.line7Text;
        let onLine = this.state.wordArrayPosition[0];
        let onWord = this.state.wordArrayPosition[1];
        let onLetter = this.state.wordArrayPosition[2];
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let fragArray = text.split('');
        let addSpace = this.state.addSpace;
//        line0String = (this.state.leadingApostrophe)?'’':'';
        for (let fragLoop=0; fragLoop<fragArray.length; fragLoop++){
            let loopAgain = true;
            do {
                let theVerseLetter = this.state.wordsArray[onLine][onWord].substr(onLetter, 1);
                let theVerseLetterTLC = theVerseLetter.toLowerCase();
                if (theVerseLetterTLC == fragArray[fragLoop] || letters.indexOf(theVerseLetterTLC) < 0 || theVerseLetter.length == 0){
                    switch (onLine){
                        case 0:
                            line0String = (addSpace)?line0String + ' ' + theVerseLetter:line0String + theVerseLetter;
                            break;
                        case 1:
                            line1String = (addSpace)?line1String + ' ' + theVerseLetter:line1String + theVerseLetter;
                            break;
                        case 2:
                            line2String = (addSpace)?line2String + ' ' + theVerseLetter:line2String + theVerseLetter;
                            break;
                        case 3:
                            line3String = (addSpace)?line3String + ' ' + theVerseLetter:line3String + theVerseLetter;
                            break;
                        case 4:
                            line4String = (addSpace)?line4String + ' ' + theVerseLetter:line4String + theVerseLetter;
                            break;
                        case 5:
                            line5String = (addSpace)?line5String + ' ' + theVerseLetter:line5String + theVerseLetter;
                            break;
                        case 6:
                            line6String = (addSpace)?line6String + ' ' + theVerseLetter:line6String + theVerseLetter;
                            break;
                        case 7:
                            line7String = (addSpace)?line7String + ' ' + theVerseLetter:line7String + theVerseLetter;
                            break;
                    }
                    addSpace = false;
                }
                if (onLetter + 1 >= this.state.wordsArray[onLine][onWord].length){//finished a word
                    addSpace = true;
                    if (onWord + 1 == this.state.wordsArray[onLine].length){//at the end of a line
                        addSpace = false;
                        if (onLine == 7 || this.state.wordsArray[onLine + 1].length == 0){//finished verse
                            clearInterval(this.hintAnimation);
                            this.setState({doneWithQuote: true, showCloseQuote: true, showHintButton: false});
                            if (this.props.fromWhere == 'book' || this.props.fromWhere == 'favorites'){
                                if(this.state.useSounds == true){fanfare.play();}
                                this.endOfGame(1);
                            }else{
                                setTimeout(() => {
                                    this.giveQuotedQuiz();
                                }, 500);
                            }
                            break;
                        }
                        onWord = 0;
                        onLetter = 0;
                        onLine += 1;
                    }else{//staying on this line
                        onWord += 1;
                        onLetter = 0;
                    }
                }else{//still within a word
                    onLetter += 1;
                }
                let nextCharacter = this.state.wordsArray[onLine][onWord].substr(onLetter, 1);
                nextCharacter = nextCharacter.toLowerCase();
                loopAgain = (letters.indexOf(nextCharacter) < 0)?true:false;
            }while(loopAgain);
        }
        let increment = this.state.onThisFragment;
        increment += 1;
        let nextStr = this.state.fragmentOrder[increment]
        this.setState({ nextFrag: nextStr,
                        onThisFragment: increment, addSpace: addSpace,
                        wordArrayPosition: [onLine, onWord, onLetter], line0Text: line0String,
                        line1Text: line1String, line2Text: line2String, line3Text: line3String,
                        line4Text: line4String, line5Text: line5String, line6Text: line6String, line7Text: line7String
        })
        if (this.state.playedFirst == true){
            setTimeout(() => {this.playDropSound()}, 50);
        }else{
            this.setState({playedFirst: true});
        }
    }
    endOfGame(solvedPoints){
        var newNumSolved = '';
        let indexToUse = (this.props.fromWhere == 'daily')?+this.state.index + +1:this.state.index;
        let onLastVerseInPack=(this.props.fromWhere == 'home' || indexToUse == parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10))?true:false;
        if (onLastVerseInPack){
            this.setState({ showNextArrow: true, arrowImage: require('../images/arrowbackward.png') });
        }else{
            this.setState({ showNextArrow: true, arrowImage: require('../images/arrowforward.png') });
        }
        this.showButtonPanel();
        if(this.props.fromWhere == 'collection' || this.props.fromWhere == 'book'){
            newNumSolved = (parseInt(homeData[this.props.dataElement].num_solved, 10) + 1).toString();
            if(!this.state.openedAll)homeData[this.props.dataElement].num_solved = newNumSolved;
            homeData[this.props.dataElement].solved[this.state.index] = 1;
            let onLastVerse=+this.state.index + +1 == parseInt(homeData[this.props.dataElement].num_quotes, 10)?true:false;
            let notSolvedYet = homeData[this.props.dataElement].solved.some(hasAZero);
            if((onLastVerse && !this.state.openedAll) || !notSolvedYet)homeData[this.props.dataElement].type = 'solved';
            try {
                AsyncStorage.setItem(KEY_Verses, JSON.stringify(homeData));
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        }else if(this.props.fromWhere == 'home'){
            dsArray[this.state.index] = '1';
        }else if(this.props.fromWhere == 'daily'){
            dsArray[+this.state.index + +1] = '1';
            this.setState({daily_solvedArray: dsArray});
        }
        var shouldAskToRate = ((this.state.numSolved + 1) % 15 == 0 && this.state.numSolved + 1 < 50)?true:false;
        var numSolved = this.state.numSolved + solvedPoints;
        var bonusLevel = this.state.nextBonus;
        var nextBonusLevel = null;
        var bonusIndex = null;
        if (numSolved >= bonusLevel){
            switch (bonusLevel){
                case 20:
                    bonusIndex = 0;
                    nextBonusLevel = '50';
                    break;
                case 50:
                    bonusIndex = 1;
                    nextBonusLevel = '100';
                    break;
                case 100:
                    bonusIndex = 2;
                    nextBonusLevel = '250';
                    break;
                case 250:
                    bonusIndex = 3;
                    nextBonusLevel = '500';
                    break;
                case 500:
                    bonusIndex = 4;
                    nextBonusLevel = '1000';
                    break;
                case 1000:
                    bonusIndex = 5;
                    nextBonusLevel = '100000000';
                    break;
            }
            let objToPush = bonuses[bonusIndex];
            objToPush.index = String(homeData.length);
            homeData.push(objToPush);
            try {
                AsyncStorage.setItem(KEY_Verses, JSON.stringify(homeData));
                AsyncStorage.setItem(KEY_NextBonus, nextBonusLevel);
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        }
        let strNumSolved = String(numSolved);
        try {
            AsyncStorage.setItem(KEY_daily_solved_array, JSON.stringify(dsArray));
            AsyncStorage.setItem(KEY_Solved, strNumSolved);
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
        if(this.props.fromWhere == 'home'){//solved Quote of the Day
            try {
                AsyncStorage.setItem(KEY_solvedTP, 'true');
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        }
        if (shouldAskToRate && !this.state.hasRated){//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ move this... ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            let dismissText = (numSolved < 46)?'Maybe later...':'Never';
            Alert.alert( 'Enjoying reQuotify?',  `It seems you're enjoying the app, which makes us very happy! Would you care to take a moment to rate us in the App Store?'`,
                [
                    {text: 'Give Rating', onPress: () => this.rateApp()},
                    {text: dismissText, style: 'cancel'},
                ]
            )
        }
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
    playDropSound(){
        if(!this.state.doneWithQuote && this.state.useSounds == true){plink1.play();}

    }
    footerBorder(color) {
        let bgC = this.props.bgColor;
        let darkerColor = (bgC == colors.pale_green)?shadeColor(colors.blue_bg, 5):shadeColor(color, -40);
//        let darkerColor = shadeColor(color, 5);
        return {borderColor: darkerColor};
    }
    headerBorder(color) {
        let bgC = this.props.bgColor;
        let darkerColor = (bgC == colors.pale_green)?shadeColor(colors.blue_bg, 5):shadeColor(color, -40);
//        let darkerColor = shadeColor(color, 5);
        return {borderColor: darkerColor};
    }
    headerFooterColor(color) {
        let bgC = this.props.bgColor;
        let darkerColor = (bgC == colors.pale_green)?colors.blue_bg:shadeColor(color, -40);
//        let darkerColor = shadeColor(color, -40);
        return {backgroundColor: darkerColor};
    }
    playFirst(){
        let quoteArray = this.props.homeData[this.props.dataElement].quotes[this.props.index].split('**');
        let vStr = cleanup(quoteArray[2]);
        let str = '';
        switch (true){
            case ((this.state.frag0 == this.state.nextFrag) || (reverse(this.state.frag0) == this.state.nextFrag)):
                str = (this.state.frag0 == this.state.nextFrag)?(this.state.frag0):reverse(this.state.frag0);
                this.setState({frag0Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag1 == this.state.nextFrag) || (reverse(this.state.frag1) == this.state.nextFrag)):
                str = (this.state.frag1 == this.state.nextFrag)?(this.state.frag1):reverse(this.state.frag1);
                this.setState({frag1Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag2 == this.state.nextFrag) || (reverse(this.state.frag2) == this.state.nextFrag)):
                str = (this.state.frag2 == this.state.nextFrag)?(this.state.frag2):reverse(this.state.frag2);
                this.setState({frag2Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag3 == this.state.nextFrag) || (reverse(this.state.frag3) == this.state.nextFrag)):
                str = (this.state.frag3 == this.state.nextFrag)?(this.state.frag3):reverse(this.state.frag3);
                this.setState({frag3Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag4 == this.state.nextFrag) || (reverse(this.state.frag4) == this.state.nextFrag)):
                str = (this.state.frag4 == this.state.nextFrag)?(this.state.frag4):reverse(this.state.frag4);
                this.setState({frag4Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag5 == this.state.nextFrag) || (reverse(this.state.frag5) == this.state.nextFrag)):
                str = (this.state.frag5 == this.state.nextFrag)?(this.state.frag5):reverse(this.state.frag5);
                this.setState({frag5Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag6 == this.state.nextFrag) || (reverse(this.state.frag6) == this.state.nextFrag)):
                str = (this.state.frag6 == this.state.nextFrag)?(this.state.frag6):reverse(this.state.frag6);
                this.setState({frag6Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag7 == this.state.nextFrag) || (reverse(this.state.frag7) == this.state.nextFrag)):
                str = (this.state.frag7 == this.state.nextFrag)?(this.state.frag7):reverse(this.state.frag7);
                this.setState({frag7Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag8 == this.state.nextFrag) || (reverse(this.state.frag8) == this.state.nextFrag)):
                str = (this.state.frag8 == this.state.nextFrag)?(this.state.frag8):reverse(this.state.frag8);
                this.setState({frag8Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag9 == this.state.nextFrag) || (reverse(this.state.frag9) == this.state.nextFrag)):
                str = (this.state.frag9 == this.state.nextFrag)?(this.state.frag9):reverse(this.state.frag9);
                this.setState({frag9Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag10 == this.state.nextFrag) || (reverse(this.state.frag10) == this.state.nextFrag)):
                str = (this.state.frag10 == this.state.nextFrag)?(this.state.frag10):reverse(this.state.frag10);
                this.setState({frag10Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag11 == this.state.nextFrag) || (reverse(this.state.frag11) == this.state.nextFrag)):
                str = (this.state.frag11 == this.state.nextFrag)?(this.state.frag11):reverse(this.state.frag11);
                this.setState({frag11Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag12 == this.state.nextFrag) || (reverse(this.state.frag12) == this.state.nextFrag)):
                str = (this.state.frag12 == this.state.nextFrag)?(this.state.frag12):reverse(this.state.frag12);
                this.setState({frag12Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag13 == this.state.nextFrag) || (reverse(this.state.frag13) == this.state.nextFrag)):
                str = (this.state.frag13 == this.state.nextFrag)?(this.state.frag13):reverse(this.state.frag13);
                this.setState({frag13Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag14 == this.state.nextFrag) || (reverse(this.state.frag14) == this.state.nextFrag)):
                str = (this.state.frag14 == this.state.nextFrag)?(this.state.frag14):reverse(this.state.frag14);
                this.setState({frag14Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag15 == this.state.nextFrag) || (reverse(this.state.frag15) == this.state.nextFrag)):
                str = (this.state.frag15 == this.state.nextFrag)?(this.state.frag15):reverse(this.state.frag15);
                this.setState({frag15Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag16 == this.state.nextFrag) || (reverse(this.state.frag16) == this.state.nextFrag)):
                str = (this.state.frag16 == this.state.nextFrag)?(this.state.frag16):reverse(this.state.frag16);
                this.setState({frag16Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag17 == this.state.nextFrag) || (reverse(this.state.frag17) == this.state.nextFrag)):
                str = (this.state.frag17 == this.state.nextFrag)?(this.state.frag17):reverse(this.state.frag17);
                this.setState({frag17Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag18 == this.state.nextFrag) || (reverse(this.state.frag18) == this.state.nextFrag)):
                str = (this.state.frag18 == this.state.nextFrag)?(this.state.frag18):reverse(this.state.frag18);
                this.setState({frag18Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag19 == this.state.nextFrag) || (reverse(this.state.frag19) == this.state.nextFrag)):
                str = (this.state.frag19 == this.state.nextFrag)?(this.state.frag19):reverse(this.state.frag19);
                this.setState({frag19Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag20 == this.state.nextFrag) || (reverse(this.state.frag20) == this.state.nextFrag)):
                str = (this.state.frag20 == this.state.nextFrag)?(this.state.frag20):reverse(this.state.frag20);
                this.setState({frag20Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag21 == this.state.nextFrag) || (reverse(this.state.frag21) == this.state.nextFrag)):
                str = (this.state.frag21 == this.state.nextFrag)?(this.state.frag21):reverse(this.state.frag21);
                this.setState({frag21Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag22 == this.state.nextFrag) || (reverse(this.state.frag22) == this.state.nextFrag)):
                str = (this.state.frag22 == this.state.nextFrag)?(this.state.frag22):reverse(this.state.frag22);
                this.setState({frag22Opacity: 0});
                this.onDrop(str);
                break;
            case ((this.state.frag23 == this.state.nextFrag) || (reverse(this.state.frag23) == this.state.nextFrag)):
                str = (this.state.frag23 == this.state.nextFrag)?(this.state.frag23):reverse(this.state.frag23);
                this.setState({frag23Opacity: 0});
                this.onDrop(str);
                break;
        }
    }
    giveHint(frag){
//        this.setState({openQuoteX: -30});
//        return;
        let hints = this.state.numHints;
        let hasInfinite = this.state.hasInfiniteHints;
        let hasPaid = this.state.hasPaidForHints;
        if (hints > 0 && !hasInfinite){
            let newHintNum = hints - 1;
            this.setState({numHints: newHintNum});
            let newquoteStr = newHintNum + '**' + this.state.quotedPerson + '**' + this.state.entireQuote;
            homeData[this.props.dataElement].quotes[this.props.index] = newquoteStr;
            if (hasPaid){
                try {
                    AsyncStorage.setItem(KEY_MyHints, String(newHintNum));
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
        }
        if (hints < 1 && !hasInfinite){
        let alertString = (hasPaid == true)?`Would you like to purchase more hints?`:`Sorry, only 2 hints per Verse unless you've purchased a hint package!`;
            Alert.alert( 'No more hints...',  alertString,
                [
                    {text: 'See Packages', onPress: () => this.goToHintStore()},
                    {text: 'No Thanks', style: 'cancel'},
                ]
            )
            return;
        }
        if(this.state.useSounds == true){swish.play();}
        this.a.showNextTile(frag);
        this.b.showNextTile(frag);
        this.c.showNextTile(frag);
        let rows = this.state.numberOfRows;
        switch(true){
            case rows > 7:
                this.v.showNextTile(frag);
                this.w.showNextTile(frag);
                this.x.showNextTile(frag);
            case rows > 6:
                this.s.showNextTile(frag);
                this.t.showNextTile(frag);
                this.u.showNextTile(frag);
            case rows > 5:
                this.p.showNextTile(frag);
                this.q.showNextTile(frag);
                this.r.showNextTile(frag);
            case rows > 4:
                this.m.showNextTile(frag);
                this.n.showNextTile(frag);
                this.o.showNextTile(frag);
            case rows > 3:
                this.j.showNextTile(frag);
                this.k.showNextTile(frag);
                this.l.showNextTile(frag);
            case rows > 2:
                this.g.showNextTile(frag);
                this.h.showNextTile(frag);
                this.i.showNextTile(frag);
            case rows > 1:
                this.d.showNextTile(frag);
                this.e.showNextTile(frag);
                this.f.showNextTile(frag);
        }
    }
    goToHintStore(){
        try {
            this.props.navigator.push({
                id: 'hints',
                passProps: {
                    destination: 'game',
                    homeData: this.state.homeData,
                    daily_solvedArray: dsArray,
                    title: this.props.title,
                    dataSource: this.state.dataSource,
                    dataElement: this.props.dataElement,
                    bgColor: this.props.bgColor,
                    reverse: this.props.reverse
                }
            });
        } catch(err)  {
            window.alert(err.message)
            return true;
        }
    }
    showButtonPanel(){
        this.grow.setValue(0);
        this.opac.setValue(0);
        this.setState({showButtons: true});

        Animated.parallel([
            Animated.timing(this.opac, {
                toValue: 1,
                duration: 200,
                delay: 500
            }),
            Animated.timing(this.grow, {
                    toValue: 1.1,
                    delay: 500
            })
        ]).start(()=>{
            Animated.spring(
                this.grow,
                { toValue: 1, friction: 3 }
            ).start()
        });
    }
    flipPanel(){
        this.flip.setValue(0);
        let quotedPersonStr = '';
        let pBgC ='';
        let pBC = '';
        let bool = false;
//        let pText = (fromBook == true)?this.props.title:this.state.quotedPerson;
        if(!this.state.showingVerse){
            pBgC = '#555555';
            pBC = '#000000';
            bool = true;
            this.setState({panelText:  this.state.quotedPerson,
                                       panelBgColor: pBgC,
                                       panelBorderColor: pBC,
                                       showingVerse: bool
            })
            Animated.timing(this.flip,
                 {
                    toValue: 1,
                    duration: 1000,
                  }
            ).start();
        }else{
            this.setPanelColors();
            this.setState({panelText: '', showingVerse: bool});
        }
    }
    showDropdown(){
        this.setState({ shouldShowDropdown: true,});

    }
    onDropdownSelect(which){
        this.setState({ shouldShowDropdown: false });
        switch(which){
            case 0://touch outside of dropdown, just close
                break;
            case 1://toggle sounds:
                if(this.state.useSounds == true){
                    this.setState({soundString: 'Use Sounds',
                                    useSounds: false
                    });
                    try {
                        AsyncStorage.setItem(KEY_Sound, 'false');//
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }else{
                    this.setState({soundString: 'Mute Sounds',
                                    useSounds: true
                    });
                    try {
                        AsyncStorage.setItem(KEY_Sound, 'true');//
                    } catch (error) {
                        window.alert('AsyncStorage error: ' + error.message);
                    }
                }
                break;
            case 2://reset scene:
                this.reset_scene();
                break;
            case 3://go to app intro 2nd page:
        try {
            this.props.navigator.push({
                id: 'swiper',
                passProps: {
                    destination: 'game',
                    seenIntro: 'true',
                    }
            });
        } catch(err)  {
            window.alert(err.message)
            return true;
        }
                break;
            default:
        }
    }
    addToFavorites(){
        if (this.state.isPremium || this.state.numFavorites < 3){
            let newNumFavorites = this.state.numFavorites + 1;
            this.setState({numFavorites: newNumFavorites});
            let num = (parseInt(homeData[17].num_quotes, 10) + 1) + '';
            homeData[17].num_quotes = num;
            homeData[17].quotes.push(this.props.homeData[this.props.dataElement].quotes[this.props.index]);
            homeData[17].show = 'true';
            try {
                AsyncStorage.setItem(KEY_Verses, JSON.stringify(homeData));
                AsyncStorage.setItem(KEY_Favorites, newNumFavorites + '');
                ToastAndroid.show('Added to Favorites', ToastAndroid.SHORT);
//                Alert.alert('Quote Added', this.state.quotedPerson + ' added to Favorites' );
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        }else{
            Alert.alert('Favorites full', 'Sorry, Favorites storage is limited to 3 unless you have purchased something within the app');
        }
    }
    linkToUrl(which){
        if (which == 'FB'){
            Linking.canOpenURL(configs.FB_URL_APP)
            .then(supported => {
                if (supported) {
                    Linking.openURL(configs.FB_URL_APP);
                } else {
                    Linking.canOpenURL(configs.FB_URL_BROWSER)
                    .then(isSupported => {
                        if (isSupported) {
                            Linking.openURL(configs.FB_URL_BROWSER);
                        } else {
                            console.log('Don\'t know how to open URL: ' + configs.FB_URL_BROWSER);
                        }
                    });
                }
            });
        }else{
            Linking.canOpenURL(configs.TWITTER_URL_APP)
            .then(supported => {
                if (supported) {
                    Linking.openURL(configs.TWITTER_URL_APP);
                } else {
                    Linking.canOpenURL(configs.TWITTER_URL_BROWSER)
                    .then(isSupported => {
                        if (isSupported) {
                            Linking.openURL(configs.TWITTER_URL_BROWSER);
                        } else {
                            console.log('Don\'t know how to open URL: ' + configs.TWITTER_URL_BROWSER);
                        }
                    });
                }
            });
        }
    }
    sendTweet(quotedPerson, verse){
        let bodyStr = 'Just solved quote of ' + quotedPerson + ' in the reQuotify app: \"' + verse + '\"';
        bodyStr = bodyStr.substr(0, 139);
        FabricTwitterKit.composeTweet({
            body: bodyStr
        }, (completed, cancelled, error) => {
            console.log('completed: ' + completed + ' cancelled: ' + cancelled + ' error: ' + error);
        });
    }
    dismissOverlay(){
       this.setState({shouldShowOverlay: false});

    }
    giveQuotedQuiz(){
        if(this.state.useSounds == true){fanfare.play();}
        setTimeout(() => {
            if(this.state.useSounds == true){swish.play();}
            this.setState({ shouldShowGuessHeader: true });
        }, 1000);
        setTimeout(() => {
            if(this.state.useSounds == true){swish.play();}
            this.setState({ shouldShowGuesses: true });
        }, 2000);

    }
    guessQuoted(whichCell, guess){
        let sp = 1;
        if (guess == this.state.quoted){
            sp++;
            switch (whichCell){
                case 'top':
                    this.setState({bg1Color: 'green', name2: 'That\'s right!', name3: 'Double Solved Points!'});
                    break;
                case 'middle':
                    this.setState({bg2Color: 'green', name1: 'That\'s right!', name3: 'Double Solved Points!'});
                    break;
                case 'bottom':
                    this.setState({bg3Color: 'green', name1: 'That\'s right!', name2: 'Double Solved Points!'});
            }
        }else{
            switch (whichCell){
                case 'top':
                    this.setState({bg1Color: 'red'});
                    if (this.state.name2 == this.state.quoted){
                        this.setState({bg2Color: 'green'});
                    }else{
                        this.setState({bg3Color: 'green'});
                    }
                    break;
                case 'middle':
                    this.setState({bg2Color: 'red'});
                    if (this.state.name1 == this.state.quoted){
                        this.setState({bg1Color: 'green'});
                    }else{
                        this.setState({bg3Color: 'green'});
                    }
                    break;
                case 'bottom':
                    this.setState({bg3Color: 'red'});
                    if (this.state.name1 == this.state.quoted){
                        this.setState({bg1Color: 'green'});
                    }else{
                        this.setState({bg2Color: 'green'});
                    }
            }
        }
        setTimeout(() => {
            this.refs.header.bounceOutUp(850);
            this.refs.top.bounceOutRight(850);
            this.refs.middle.bounceOutLeft(850);
            this.refs.bottom.bounceOutRight(850);
        }, 1500);
        setTimeout(() => {
            if (this.props.fromWhere != 'book' && !this.state.showingVerse)this.flipPanel();
        }, 2000);
        setTimeout(() => {
            this.endOfGame(sp);
        }, 3500);

    }
    setCloseQuoteX(event){
        let dims = {x, y, width, height} = event.nativeEvent.layout;
        let xOffset = dims.width + height*.15;
            xOffset = (this.state.numLines < 3)? xOffset + scrHeight*.11:xOffset + scrHeight*.01;
            this.setState({
                closeQuoteX: xOffset//, showCloseQuote: true
            });
    }
    setCloseQuoteY(event){
        let d = {x, y, width, height} = event.nativeEvent.layout;
        let yOffset = (this.state.numLines - 1) * d.height;
        this.setState({closeQuoteY: yOffset});
    }


    render() {
        const rotateX = this.flip.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        const scale = this.grow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        let imageStyle = {transform: [{rotateX}]};
        let buttonsStyle = {opacity: this.opac.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                  }), transform: [{scale}]};
        if(this.state.isLoading == true){
            return(
                <View style={[game_styles.loading, {backgroundColor: '#222222'}]}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            );
        }else{
            return (
                <View style={{flex: 1}}>
                    <Text style={game_styles.dummy_text_container} onLayout={(event) => this.setCloseQuoteX(event)} >
                        <Text style={game_styles.dummy_text}>{this.state.dummyText}</Text>
                    </Text>
                    <View style={[game_styles.container, {backgroundColor: this.state.bgColor}]}>
                        <View style={[game_styles.header, this.headerBorder(this.state.bgColor), this.headerFooterColor(this.state.bgColor)]}>
                            <Button style={[game_styles.button, {marginLeft: getArrowMargin()}]} onPress={() => this.closeGame(this.props.fromWhere)}>
                                <Image source={ require('../images/close.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                            <Text style={styles.header_text} >{ this.state.title }</Text>
                            <Button style={[game_styles.button, {marginRight: getArrowMargin()}]} onPress={ () => this.showDropdown()}>
                                <Image source={ require('../images/dropdown.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                        </View>
                        <View style={game_styles.tablet}>
                            <Image style={game_styles.parchment} source={require('../images/parchment.png')} resizeMode='stretch' />
                            <Animatable.Image
                                style={game_styles.letter}
                                resizeMode='stretch'
                                source={this.state.letterImage}
                                ref='openquote'
                                animation={'rubberBand'}
                                duration={1500}
                                delay={1000}
                            />
                            <View style={game_styles.verse_container}>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line0Text }</Text>
                                </View>
                                <View style={game_styles.first_line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line1Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line2Text }</Text>
                                </View>
                                <View style={game_styles.line} onLayout={(event) => this.setCloseQuoteY(event)}>
                                    <Text style={game_styles.verse_text} >{ this.state.line3Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line4Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line5Text }</Text>
                                </View>
                                <View style={game_styles.line}>
                                    <Text style={game_styles.verse_text} >{ this.state.line6Text }</Text>
                                </View>
                                <View style={{flex: .75}}>
                                </View>
                                {this.state.showCloseQuote &&
                                <View style={[game_styles.close_quote_container,{top: this.state.closeQuoteY, left: this.state.closeQuoteX}]}>
                                    <Animatable.Image
                                        style={game_styles.close_quote}
                                        resizeMode='stretch'
                                        source={require('../images/closequote.png')}
                                        ref='closequote'
                                        animation={'bounceInRight'}
                                        duration={900}
                                    />
                                </View>
                                }
                            </View>
                        </View>
                        <View style={game_styles.verse_panel_container}>
                            <Animated.View style={[imageStyle, game_styles.verse_panel, {backgroundColor: this.state.panelBgColor, borderColor: this.state.panelBorderColor}]}>
                                        <Text numberOfLines={1} style={game_styles.panel_text} >{this.state.panelText}</Text>
                            </Animated.View>
                        </View>
                        <View style={game_styles.game}>
                            <View style={game_styles.tile_row} >
                                <Tile ref={(a) => { this.a = a; }} opac={ this.state.frag0Opacity } text={ this.state.frag0 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(b) => { this.b = b; }} opac={ this.state.frag1Opacity } text={ this.state.frag1 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(c) => { this.c = c; }} opac={ this.state.frag2Opacity } text={ this.state.frag2 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            { this.state.rows2 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(d) => { this.d = d; }} opac={ this.state.frag3Opacity } text={ this.state.frag3 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(e) => { this.e = e; }} opac={ this.state.frag4Opacity } text={ this.state.frag4 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(f) => { this.f = f; }} opac={ this.state.frag5Opacity } text={ this.state.frag5 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                            { this.state.rows3 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(g) => { this.g = g; }} opac={ this.state.frag6Opacity } text={ this.state.frag6 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(h) => { this.h = h; }} opac={ this.state.frag7Opacity } text={ this.state.frag7 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(i) => { this.i = i; }} opac={ this.state.frag8Opacity } text={ this.state.frag8 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                            { this.state.rows4 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(j) => { this.j = j; }} opac={ this.state.frag9Opacity } text={ this.state.frag9 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(k) => { this.k = k; }} opac={ this.state.frag10Opacity } text={ this.state.frag10 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(l) => { this.l = l; }} opac={ this.state.frag11Opacity } text={ this.state.frag11 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                            { this.state.rows5 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(m) => { this.m = m; }} opac={ this.state.frag12Opacity } text={ this.state.frag12 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(n) => { this.n = n; }} opac={ this.state.frag13Opacity } text={ this.state.frag13 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(o) => { this.o = o; }} opac={ this.state.frag14Opacity } text={ this.state.frag14 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                            { this.state.rows6 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(p) => { this.p = p; }} opac={ this.state.frag15Opacity } text={ this.state.frag15 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(q) => { this.q = q; }} opac={ this.state.frag16Opacity } text={ this.state.frag16 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(r) => { this.r = r; }} opac={ this.state.frag17Opacity } text={ this.state.frag17 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                            { this.state.rows7 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(s) => { this.s = s; }} opac={ this.state.frag18Opacity } text={ this.state.frag18 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(t) => { this.t = t; }} opac={ this.state.frag19Opacity } text={ this.state.frag19 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(u) => { this.u = u; }} opac={ this.state.frag20Opacity } text={ this.state.frag20 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                            { this.state.rows8 &&
                            <View style={game_styles.tile_row} >
                                <Tile ref={(v) => { this.v = v; }} opac={ this.state.frag21Opacity } text={ this.state.frag21 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(w) => { this.w = w; }} opac={ this.state.frag22Opacity } text={ this.state.frag22 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                                <Tile ref={(x) => { this.x = x; }} opac={ this.state.frag23Opacity } text={ this.state.frag23 } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            </View>
                            }
                        </View>
                        <View style={[game_styles.footer, this.footerBorder(this.state.bgColor), this.headerFooterColor(this.state.bgColor)]}>
                            { this.state.showHintButton &&
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: scrWidth}}>
                                <View style={game_styles.hint_container}>
                                </View>
                                <Animatable.View
                                        ref='hintbutton'
                                        duration={1500}
                                        iterationCount={2}
                                        style={game_styles.hint_container} onStartShouldSetResponder={() => { this.giveHint(this.state.nextFrag) }}>
                                    <View style={game_styles.hint_button} >
                                        <Text style={game_styles.hint_text}>hint</Text>
                                    </View>
                                </Animatable.View>
                                <View style={game_styles.hint_container}>
                                    <Text style={[game_styles.hint_text, {opacity: this.state.hintNumOpacity}]}>{ this.state.numHints }</Text>
                                </View>
                            </View>
                            }
                        </View>
                        { this.state.showButtons &&
                        <View style={game_styles.after_buttons}>
                            { this.state.showFB &&
                            <Animated.Image style={[ game_styles.button_image, buttonsStyle ]} source={require('../images/buttonfb.png')} onStartShouldSetResponder={() => { this.linkToUrl('FB') }}/>
                            }
                            { this.state.showTwitter &&
                            <Animated.Image style={[ game_styles.button_image, buttonsStyle ]} source={require('../images/buttontwitter.png')} onStartShouldSetResponder={() => { this.sendTweet(this.state.quotedPerson, this.state.entireQuote) }}/>
                            }
                            { this.state.showFavorites &&
                            <Animated.Image style={[ {width: 65, height: 65, margin: 1}, buttonsStyle ]} source={require('../images/favorites.png')} onStartShouldSetResponder={() => { this.addToFavorites() }}/>
                            }
                            { this.state.showBook &&
                            <Animated.Image style={[ {width: 65, height: 65, margin: 1}, buttonsStyle ]} source={require('../images/book.png')} onStartShouldSetResponder={() => { this.seeInReader() }}/>
                            }
                        </View>
                        }
                        { this.state.showNextArrow &&
                        <View style={game_styles.next_arrow} onStartShouldSetResponder={() => { this.nextGame() }} >
                            <Image source={this.state.arrowImage}/>
                        </View>
                        }
                        {this.state.shouldShowGuessHeader &&
                        <View style={{position: 'absolute', top: scrHeight*.34, left: 0, width: scrWidth, height: scrHeight*.2}}>
                            <Animatable.Image source={ require('../images/nicejob.png') }
                                style={game_styles.guess_header}
                                ref='header'
                                animation={'bounceInDown'}
                                duration={900}
                            >
                            </Animatable.Image>
                        </View>
                        }
                        {this.state.shouldShowDropdown &&
                            <DropdownMenu onPress={(num)=>{ this.onDropdownSelect(num); }} item1={this.state.soundString} item2={'Reset Verse'} item3={'How to Play'}/>
                        }
                        {this.state.shouldShowOverlay &&
                            <Overlay onPress={()=>{ this.dismissOverlay(); }} margin={0.16} text={`Mute game sounds and reset the Quote with this menu`} />
                        }
                        {this.state.shouldShowGuesses &&
                        <View style={{position: 'absolute', top: scrHeight*.5, left: width*.05, width: scrWidth*.9, height: scrHeight*.6}}>
                            <Animatable.View
                                style={[game_styles.guess_cell, {top: 0, backgroundColor: this.state.bg1Color}]}
                                ref='top'
                                animation={'bounceInLeft'}
                                duration={700}
                                onStartShouldSetResponder={() => {this.guessQuoted('top', this.state.name1);}}
                            >
                                <Text style={game_styles.name}>{this.state.name1}</Text>
                            </Animatable.View>
                            <Animatable.View
                                style={[game_styles.guess_cell, {top: scrHeight*.1, backgroundColor: this.state.bg2Color}]}
                                ref='middle'
                                animation={'bounceInRight'}
                                duration={800}
                                onStartShouldSetResponder={() => {this.guessQuoted('middle', this.state.name2);}}
                            >
                                <Text style={game_styles.name}>{this.state.name2}</Text>
                            </Animatable.View>
                            <Animatable.View
                                style={[game_styles.guess_cell, {top: scrHeight*.2, backgroundColor: this.state.bg3Color}]}
                                ref='bottom'
                                animation={'bounceInLeft'}
                                duration={600}
                                onStartShouldSetResponder={() => {this.guessQuoted('bottom', this.state.name3);}}
                            >
                                <Text style={game_styles.name}>{this.state.name3}</Text>
                            </Animatable.View>
                        </View>
                        }
                    </View>
                </View>
            );
        }
    }
}



const game_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        borderBottomWidth: 6
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    tablet: {
        marginTop: 6,
        flex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        width: width
    },
    parchment: {
        position: 'absolute',
        top: 0,
        left: (width-(height*.52))/2,
        height: height*.30,
        width: height*.52
    },
    letter: {
        position: 'absolute',
        top: height*.05,
        left: (width-(height*.478))/2 + height*.05,
        width: height*.11,
        height: height*.07
    },
    open_quote_container: {
        position: 'absolute',
        top: height*.01,
        width: height*.046,
        height: height*.026
    },
    open_quote: {
        width: height*.045,
        height: height*.025,
    },
    close_quote_container: {
        position: 'absolute',
        width: height*.045,
        height: height*.025
    },
    close_quote: {
        width: height*.042,
        height: height*.022,
    },
    verse_container: {
        flex: 1,
        position: 'absolute',
        top: height*.05,
        left: (width-(height*.478))/2 + height*.051,
        width: height*.5,
        height: height*.25
    },
    first_line: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: height*.11,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    line: {
        flex: 1,
        paddingLeft: height*.015,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    verse_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.085),
        color: '#000000',
        fontFamily: 'Segoe Print',//'Book Antiqua',
    },
    verse_panel_container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    verse_panel: {
        alignItems: 'center',
        justifyContent: 'center',
        width: height/3.5,
        height: height/20,
        borderWidth: StyleSheet.hairlineWidth,
    },
    panel_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.08),
        color: '#ffffff'
    },
    game: {
        flex: 16,
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    footer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        borderTopWidth: 6,
    },
    hint_container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.12),
        height: normalize(height*0.085),
    },
    hint_button: {
        height: height/23,
        width: height/9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#486bdd',
        borderRadius: 15,
    },
    hint_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.094),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tile_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    next_arrow: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        top: height*.52,
        height: height*.18,
    },
    after_buttons: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        top: height*.7,
        height: height*.25,
    },
    button_image: {
        width: 60,
        height: 60,
        margin: 3
    },
    name: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    guess_header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: (width - height*.3)/2,
        width: height*.3,
        height: height*.145
    },
    guess_cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        width: scrWidth*.9,
        height: scrHeight*.086,
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 7,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        elevation: 5
    },
    dummy_text: {
        flex: 1,
        height: 26,
        fontSize: normalizeFont(configs.LETTER_SIZE*0.085),
        fontFamily: 'Segoe Print',//'Book Antiqua',
        alignSelf: 'flex-start'
    },
    dummy_text_container: {
        alignSelf: 'flex-start',
        position: 'absolute',
        top: height*2,
        left: height*2,
        backgroundColor: 'transparent'
    }
});

module.exports = Game;