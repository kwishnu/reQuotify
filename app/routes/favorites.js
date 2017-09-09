import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, ListView, BackHandler, Alert, AsyncStorage, ActivityIndicator, AppState, Vibration } from 'react-native';
import moment from 'moment';
import Button from '../components/Button';
import Dialog from '../components/Dialog';
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
let homeData = {};
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const NUM_WIDE = 5;
const CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
const CELL_PADDING = Math.floor(CELL_WIDTH * .05) + 5; // 5% of the cell width...+
const TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2) - 7;
const BORDER_RADIUS = CELL_PADDING * .2 + 3;
const KEY_daily_solved_array = 'solved_array';
const KEY_Time = 'timeKey';
const KEY_Verses = 'versesKey';
const KEY_expandInfo = 'expandInfoKey';
const KEY_Favorites = 'numFavoritesKey';
const KEY_Premium = 'premiumOrNot';


class Favorites extends Component{
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            id: 'collection',
            homeData: this.props.homeData,
            dataElement: this.props.dataElement,
            title: this.props.title,
            isOpen: false,
            dataSource: this.props.dataSource,
//            dataSource: ds.cloneWithRows(Array.from(new Array(parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10)), (x,i) => i)),
            bgColor: this.props.bgColor,
            headerColor: '',
            titleColor: '',
            isLoading: true,
            shouldShowDialog: false,
            selected: '',
            questionOpacity: 1,
            infoString: ''
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        AsyncStorage.getItem(KEY_Premium).then((premium) => {
            if (premium == 'true'){
                this.setState({questionOpacity: 0, expand: false});
            }else{
                AsyncStorage.getItem(KEY_expandInfo).then((strExpand) => {
                    if(strExpand){
                        let expandArr = strExpand.split('.');
                        let tf = 0;
                        tf = (expandArr[2] == '1')?1:0;
                        this.setState({expand: tf, infoString: `Storage of Favorites is limited to 3 Verses unless any item has been purchased in the app. A portion of the proceeds raised by the app will be donated to the WEB project of World Outreach Ministries.`});
                    }
                });
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
        }else if(this.state.shouldShowDialog){
            this.setState({ shouldShowDialog: false });
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
                        destination: 'favorites',
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
                            destination: 'favorites',
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
         let strToReturn='';
         let onThis = parseInt(this.props.homeData[this.props.dataElement].num_solved, 10);
         let numPuzzles = parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10);
         if (onThis == numPuzzles){
            strToReturn = (this.props.homeData[this.props.dataElement].solved[num] == 0)?'#00FF00':'#079707';
            return {
                backgroundColor: strToReturn
            };
         }
         if(num==onThis){
             strToReturn='#00FF00';
             }else if(num<onThis){
             strToReturn='#079707';
             }else{
             strToReturn='#999ba0';
         }
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
    getText(verseStr){
        let arr = verseStr.split('**');
        return arr[2];
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
                    todayFull: this.props.todayFull,
                    reverse: this.props.reverse,
                    gripeText: gripeText,
                    dataElement: index,
                    isPremium: this.props.isPremium,
                    bgColor: '#055105'
                },
            });
        });
    }
    onSelect(verseStr) {
        let arr = verseStr.split('**');
        let index = parseInt(arr[0], 10);
        let bgC = this.props.bgColor;
        let newColor = (bgC == '#000000')? colors.pale_bg:this.props.bgColor;
        this.props.navigator.replace({
            id: 'game',
            passProps: {
                homeData: this.state.homeData,
                title: '',
                index: index,
                fromWhere: 'favorites',
                daily_solvedArray: this.props.daily_solvedArray,
                reverse: this.props.reverse,
                dataElement: '17',
                bgColor: newColor,
                myTitle: this.props.title,
                fromWhere: 'favorites',
                expand: true
            },
       });
    }
    showDialog(str){
        Vibration.vibrate(25);
        this.setState({ shouldShowDialog: true, selected: str });
    }
    onDialogSelect(which){
        this.setState({ shouldShowDialog: false });
        if(which == 0)return;
        let arr = this.state.selected.split('**');
        Alert.alert( 'Remove Verse', 'Remove ' + arr[2] + ' from My Favorites?',
            [
                {text: 'Remove', onPress: () => this.removeItem(arr[0])},
                {text: 'Cancel', style: 'cancel'},
            ]
        )
    }
    removeItem(item){
        let num = parseInt(item, 10);
        let dataArray = this.state.homeData;
        let bool = (this.state.homeData[17].verses.length > 1)?'true':'false';
        dataArray[17].show = bool;
        dataArray[17].verses.length = 0;
        dataArray[17].num_quotes = (parseInt(dataArray[17].num_quotes, 10) - 1) + '';
        let newArray = [];
        for (let a=0; a<this.state.dataSource.length; a++){
            if (this.state.dataSource[a].substr(0, 1) != item){
                dataArray[17].verses.push(this.state.dataSource[a].substring(this.state.dataSource[a].indexOf('*') + 2));
                newArray.push(this.state.dataSource[a]);
            }
        }
        try {
            AsyncStorage.setItem(KEY_Verses, JSON.stringify(dataArray));
            AsyncStorage.setItem(KEY_Favorites, String(dataArray[17].verses.length));
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
        if (bool == 'true'){
            this.setState({homeData: dataArray, dataSource: newArray});
        }else{
            this.props.navigator.replace({
                id: 'home',
                passProps: {
                    homeData: dataArray,
                }
            });
        }
    }
    toggleInfoBox(bool){
        if (this.state.questionOpacity == 0)return;
        this.setState({expand: !bool});
        AsyncStorage.getItem(KEY_expandInfo).then((strExpand) => {
            let expArr = strExpand.split('.');
            expArr[2] = '0';
            let reglue = expArr.join('.');
            try {
                AsyncStorage.setItem(KEY_expandInfo, reglue);//
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        });
    }


    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } data = {this.props.homeData} />;
        if(this.state.isLoading == true){
            return(
                <View style={[collection_styles.loading, {backgroundColor: '#222222'}]}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            )
        }else{
           const rows = this.dataSource.cloneWithRows(this.state.dataSource);
        if(this.state.expand){
            return (
                <SideMenu
                    menu={ menu }
                    isOpen={ this.state.isOpen }
                    onChange={ (isOpen) => this.updateMenuState(isOpen) }>
                    <View style={[collection_styles.container, {backgroundColor: this.state.bgColor}, this.darkBorder(this.state.bgColor)]}>
                        <View style={ [collection_styles.header, {backgroundColor: this.state.headerColor}]}>
                            <Button style={[collection_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                                <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                            <Text style={{fontSize: configs.LETTER_SIZE * 0.7, color: this.state.titleColor}} >{this.props.title}</Text>
                            <Button style={[collection_styles.button, {marginRight: getArrowMargin()}]}>
                                <Image source={ require('../images/noimage.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                        </View>
                        <View style={ [collection_styles.tiles_container, {backgroundColor: this.state.bgColor}, this.darkBorder(this.state.bgColor)] }>
                            <View style={[ collection_styles.infoBox, {flex: 5} ]}>
                                <View style={ collection_styles.text_container }>
                                    <Text style={collection_styles.info_text} >{this.state.infoString}</Text>
                                </View>
                                <View style={ collection_styles.button_container }>
                                    <Button style={ collection_styles.gotit_button } onPress={ () => this.toggleInfoBox(this.state.expand) }>
                                            <Text style={[collection_styles.button_text, {color: 'red'}]}> X   </Text>
                                            <Text style={[collection_styles.button_text, {color: '#ffffff'}]} > Got it!</Text>
                                    </Button>
                                </View>
                            </View>
                            <View style={{flex: 8}}>
                                <ListView
                                    showsVerticalScrollIndicator ={false}
                                    enableEmptySections ={true}
                                    initialListSize ={100}
                                    contentContainerStyle={ collection_styles.listview }
                                    dataSource={rows}
                                    renderRow={(rowData) =>
                                     <View>
                                         <TouchableHighlight onPress={() => this.onSelect(rowData)}
                                                             onLongPress={()=> this.showDialog(rowData)}
                                                             underlayColor={() => this.getUnderlay(rowData)}
                                                             style={collection_styles.launcher} >
                                             <Text style={ styles.verse_text_large }>{this.getText(rowData)}</Text>
                                         </TouchableHighlight>
                                     </View>}
                                />
                                </View>
                            </View>
                        {this.state.shouldShowDialog &&
                                <Dialog showFull={false} onPress={(num)=>{ this.onDialogSelect(num); }} item4={'Remove from Favorites'} />
                        }
                     </View>
                </SideMenu>
            );
        }else{
            return (
                <SideMenu
                    menu={ menu }
                    isOpen={ this.state.isOpen }
                    onChange={ (isOpen) => this.updateMenuState(isOpen) }>

                    <View style={ [collection_styles.container, {backgroundColor: this.state.bgColor}, this.darkBorder(this.state.bgColor)] }>
                        <View style={ [collection_styles.header, {backgroundColor: this.state.headerColor}]}>
                            <Button style={[collection_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                                <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                            <Text style={{fontSize: configs.LETTER_SIZE * 0.7, color: this.state.titleColor}} >{this.props.title}</Text>
                            <Button style={[collection_styles.button, {marginRight: getArrowMargin(), opacity: this.state.questionOpacity}]} onPress={ () => this.toggleInfoBox() }>
                                <Image source={ require('../images/infoquestion.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                        </View>
                        <View style={ [collection_styles.tiles_container, {backgroundColor: this.state.bgColor}, this.darkBorder(this.state.bgColor)] }>
                                <ListView  showsVerticalScrollIndicator ={false}
                                    initialListSize ={100}
                                    contentContainerStyle={ collection_styles.listview }
                                    dataSource={rows}
                                    renderRow={(rowData) =>
                                     <View>
                                         <TouchableHighlight onPress={() => this.onSelect(rowData)}
                                                             onLongPress={()=> this.showDialog(rowData)}
                                                             underlayColor={() => this.getUnderlay(rowData)}
                                                             style={collection_styles.launcher} >
                                             <Text style={ styles.verse_text_large }>{this.getText(rowData)}</Text>
                                         </TouchableHighlight>
                                     </View>}
                                />
                                </View>
                        {this.state.shouldShowDialog &&
                                <Dialog showFull={false} onPress={(num)=>{ this.onDialogSelect(num); }} item4={'Remove from Favorites'} />
                        }
                     </View>
                </SideMenu>
            );
        }
    }
}
}


const collection_styles = StyleSheet.create({
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
        marginBottom: 6,
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
    infoBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
        width: width * .9,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#333333',
        marginTop: 16,
        marginBottom: 10
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
    info_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .085),
        color: '#333333'
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    launcher: {
        width: width*.96,
        height: TILE_WIDTH,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        margin: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0ffff'
    },
});

module.exports = Favorites;
