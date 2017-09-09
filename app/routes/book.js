import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, ListView, BackHandler, AsyncStorage, ActivityIndicator, AppState, PixelRatio } from 'react-native';
import moment from 'moment';
import Button from '../components/Button';
import Overlay from '../components/Overlay';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getMargin, getImageSize, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
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
            ? '#333333'
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
    percent = percent/100;
    let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
let SideMenu = require('react-native-side-menu');
let Menu = require('../nav/menu');
let pixelRatio = PixelRatio.get();
let homeData = {};
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const NUM_WIDE = 3;
const CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
const CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
const TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
const BORDER_RADIUS = CELL_PADDING * .2 + 3;
const KEY_daily_solved_array = 'solved_array';
const KEY_Time = 'timeKey';
const KEY_ShowedOverlay = 'showOverlay';

class Book extends Component{
    constructor(props) {
        super(props);
//        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            id: 'book',
            homeData: this.props.homeData,
            title: this.props.title,
            isOpen: false,
            dataSource: this.props.homeData[this.props.dataElement].verses,
//            dataSource: ds.cloneWithRows(Array.from(new Array(parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10)), (x,i) => i)),
            bgColor: this.props.bgColor,
            headerColor: '',
            titleColor: '',
            isLoading: true,
            shouldShowOverlay: false
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        AsyncStorage.getItem(KEY_ShowedOverlay).then((showedOrNot) => {
            if (showedOrNot == 'false'){
                this.setState({shouldShowOverlay: true});
                try {
                    AsyncStorage.setItem(KEY_ShowedOverlay, 'true');
                } catch (error) {
                    window.alert('AsyncStorage error: ' + error.message);
                }
            }
        });
        homeData = this.state.homeData;
        this.setColors();
        AppState.addEventListener('change', this.handleAppStateChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        setTimeout(() => {this.stopSpinner()}, 10);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
        AppState.removeEventListener('change', this.handleAppStateChange);
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
                        passProps: {
                            motive: 'initialize'
                        }
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
    stopSpinner(){
        this.setState({isLoading: false});
    }
    setColors(){
        let bgC = this.props.bgColor;
        let fieldColor = (bgC == colors.pale_bg)? colors.pale_bg:shadeColor(bgC, 10);
        let headColor = (bgC == colors.pale_bg)? colors.blue_bg:shadeColor(bgC, -20);
        let titletextColor = (bgC == colors.pale_bg)? '#9eacda':invertColor(headColor, true);
        this.setState({
            bgColor: fieldColor,
            headerColor: headColor,
            titleColor: titletextColor,
        });
    }
    handleHardwareBackButton() {
        if (this.state.isOpen) {
            this.toggle();
            return true;
        }else{
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
                this.props.navigator.replace({
                    id: 'home',
                    passProps: {
                        homeData: homeData,
                    }
                });
                return true;
            } catch(err)  {
                return false;
            }
        }
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    updateMenuState(isOpen) {
        this.setState({ isOpen: isOpen });
    }
    onMenuItemSelected = (item) => {
        var index = parseInt(item.index, 10);
        var myPackArray = [];
        var keepInList = [];
        switch (item.link){
            case 'home':
                this.props.navigator.replace({
                    id: 'home',
                    passProps: {
                        homeData: this.props.homeData,
                    }
                });
                break;
            case 'intro':
                this.props.navigator.push({
                    id: 'swiper',
                    passProps: {
                        destination: 'book',
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
                            destination: 'book',
                            homeData: this.state.homeData,
                        }
                    });
                    return;
                }
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
                        dataIndex: index,
                        title: item.title,
                        availableList: keepInList,
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
            borderWidth: 2,
        };
    }
    darkBorder(color) {
        var darkerColor = shadeColor(color, -60);
            return {borderColor: darkerColor};
    }
    bg(num){
        let strToReturn = (this.props.homeData[this.props.dataElement].solved[num] == 0)?'#ffffff':'#cae6ef';
            return {
                backgroundColor: strToReturn
            };
    }
    getUnderlay(num){
         let strToReturn='';
         let onThis = parseInt(this.props.homeData[this.props.dataElement].num_solved, 10);
         let numPuzzles = parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10);
         if (onThis == numPuzzles){
            strToReturn = (this.props.homeData[this.props.dataElement].solved[num] == 0)?'#00FF00':'#079707';
            return strToReturn;
         }
         if(num==onThis){
             strToReturn='#00FF00';
             }else if(num<onThis){
             strToReturn='#079707';
             }else{
             strToReturn='#999ba0';
             }

         return strToReturn;
    }
    getBorder(num){
         let strToReturn='';
         let onThis = parseInt(this.props.homeData[this.props.dataElement].num_solved, 10);
         let numPuzzles = parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10);
         if (onThis == numPuzzles){
            strToReturn = (this.props.homeData[this.props.dataElement].solved[num] == 0)?'#00FF00':'#00a700';
            return {borderColor: strToReturn};
         }
         if(num==onThis){
             strToReturn='#0F0';
             }else if(num<onThis){
                 strToReturn='#00a700';
             }else{
                 strToReturn='#7e867e';
             }
         return {borderColor: strToReturn};
    }
    getText(verse){
        let verseArray = verse.split('**');
        return verseArray[1].substring(verseArray[1].indexOf(' ', -1) + 1);
    }
    goToDaily(index){
        let sArray = [];
        let gripeText = (this.props.isPremium == 'true')?'':'Purchase any item in the app and always have access here to the previous 30 Daily Verses!';

        AsyncStorage.getItem(KEY_daily_solved_array).then((theArray) => {
            if (theArray !== null) {
              sArray = JSON.parse(theArray);
            }
            this.props.navigator.replace({
                id: 'daily',
                passProps: {
                    homeData: this.props.homeData,
                    daily_solvedArray: sArray,
                    title: 'Daily Verses',
                    reverse: this.props.reverse,
                    todayFull: this.props.todayFull,
                    gripeText: gripeText,
                    dataElement: index,
                    bgColor: '#055105'
                },
            });
        });
    }
    launchReader(){
        let chapterNum = parseInt(this.props.homeData[this.props.dataElement].on_chapter, 10);
        this.props.navigator.push({
            id: 'reader',
            passProps: {
                homeData: this.props.homeData,
                dataElement: this.props.dataElement,
                chapterIndex: chapterNum,
                fromWhere: 'book'
            }
        });
    }
    onSelect(verseStr, index) {
        let bgC = this.props.bgColor;
        let newColor = (bgC == '#000000')? colors.pale_bg:this.props.bgColor;
        let fullVerse = this.props.title + ' ' + this.getText(verseStr);
        this.props.navigator.replace({
            id: 'game',
            passProps: {
                homeData: this.props.homeData,
                title: fullVerse,
                index: index,
                fromWhere: 'book',
                daily_solvedArray: this.props.daily_solvedArray,
                isPremium: this.props.isPremium,
                reverse: this.props.reverse,
                dataElement: this.props.dataElement,
                bgColor: newColor,
                myTitle: this.props.title
            },
       });
    }
    getImageStyle(){
        if (pixelRatio < 1.4){
            return {
                width: normalize(height*0.07), height: normalize(height*0.07)
            }
        }
        return {
            width: normalize(height*0.14), height: normalize(height*0.14)
        }
    }
    getMargin(){
        if (pixelRatio < 1.4){
            return {
                marginRight: normalize(height*0.05)
            }
        }
        return {
            marginRight: normalize(height*0.02)
        }
    }
    dismissOverlay(){
       this.setState({shouldShowOverlay: false});
    }

    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } data = {this.props.homeData} />;
        const ds = this.dataSource.cloneWithRows(this.props.homeData[this.props.dataElement].verses);
        if(this.state.isLoading == true){
            return(
                <View style={[book_styles.loading, {backgroundColor: '#222222'}]}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            )
        }else{
            return (
                <SideMenu
                    menu={ menu }
                    isOpen={ this.state.isOpen }
                    onChange={ (isOpen) => this.updateMenuState(isOpen) }>

                    <View style={ [book_styles.container, {backgroundColor: this.state.bgColor}, this.darkBorder(this.state.bgColor)] }>
                        <View style={ [book_styles.header, {backgroundColor: this.state.headerColor}]}>
                            <Button style={[book_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                                <Image source={ require('../images/arrowback.png') } style={ { width: getArrowSize(), height: getArrowSize() } } />
                            </Button>
                            <Text style={{fontSize: configs.LETTER_SIZE * 0.7, color: this.state.titleColor}} >{this.props.title}</Text>
                            <Button style={[book_styles.button, {marginRight: getMargin()}]} onPress={ () => this.launchReader()}>
                                <Image source={ require('../images/book.png') } style={{height: getImageSize(), width: getImageSize()}} />
                            </Button>
                        </View>
                        <View style={ [book_styles.tiles_container, {backgroundColor: this.state.bgColor}, this.darkBorder(this.state.bgColor)] }>
                             <ListView  showsVerticalScrollIndicator ={false}
                                        initialListSize ={100}
                                        enableEmptySections ={true}
                                        contentContainerStyle={ book_styles.listview }
                                        dataSource={ds}
                                        renderRow={(rowData, sectionID, rowID) =>
                                         <View>
                                             <TouchableHighlight onPress={() => this.onSelect(rowData, rowID)}
                                                                 style={[book_styles.launcher, this.bg(rowID)]} >
                                                 <Text style={ book_styles.launcher_text }>{this.getText(rowData)}</Text>
                                             </TouchableHighlight>
                                         </View>}
                             />
                        </View>
                        {this.state.shouldShowOverlay &&
                        <Overlay onPress={()=>{ this.dismissOverlay(); }} margin={0.12} text={`Read the actual text of this Book of the Bible by tapping the icon in the upper right`} />
                        }
                     </View>
                </SideMenu>
            );
        }
    }
}


const book_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
        marginBottom: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    tiles_container: {
        flex: 11,
        paddingLeft: 6,
        paddingRight: 6,
    },
    launcher: {
        width: height*.126,
        height: height*.126,
        borderRadius: height*.063,
        borderWidth: 1,
        margin: height*.002,
        justifyContent: 'center',
        alignItems: 'center'
    },
    launcher_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*.09),
        fontWeight: 'bold'
    }
});

module.exports = Book;
