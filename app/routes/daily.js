import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, ListView, BackHandler, Animated, AsyncStorage, AppState, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Button from '../components/Button';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
var homeData = {};
const SideMenu = require('react-native-side-menu');
const Menu = require('../nav/menu');
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const NUM_WIDE = 3;
const CELL_WIDTH = Math.floor(width/NUM_WIDE); // one tile's fraction of the screen width
const CELL_PADDING = Math.floor(CELL_WIDTH * .05); // 5% of the cell width...+
const TILE_WIDTH = (CELL_WIDTH - CELL_PADDING * 2);
const BORDER_RADIUS = CELL_PADDING * .2 + 3;
const KEY_Time = 'timeKey';


class Daily extends Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            daily_solvedArray: this.props.daily_solvedArray,
            id: 'daily',
            dataElement: this.props.dataElement,
            title: this.props.title,
            isOpen: false,
            isLoading: true,
            dataSource: ds.cloneWithRows(Array.from(new Array(parseInt(this.props.homeData[this.props.dataElement].num_quotes, 10)), (x,i) => i))//[0,1,2...]
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        homeData = this.props.homeData;
        AppState.addEventListener('change', this.handleAppStateChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        setTimeout(()=>{this.setState({isLoading: false});}, 50);
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
    handleHardwareBackButton() {
        if (this.state.isOpen) {
            this.toggle();
            return true;
        }else{
            try {
                var myPackArray = [];
                var str = '';
                for (var key in homeData){
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
                        destination: 'daily',
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
                            destination: 'daily',
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
            borderWidth: 1,
        };
    }
    bg(num){
         var strToReturn='';
         if (this.props.daily_solvedArray[num + 1]==0){
             strToReturn='#54165e';//green
             }else{
             strToReturn='#999ba0';//grey
             }
         return {
         backgroundColor: strToReturn
         };
     }
    getTextColor(num){
         var strToReturn='';
         if (this.props.daily_solvedArray[num + 1]==0){
             strToReturn='#ffffff';
             }else{
             strToReturn='#000000';
             }
         return {
         color: strToReturn
         };
    }
    getUnderlay(num){
         var strToReturn='';
         if (this.props.daily_solvedArray[num + 1]==0){
             strToReturn='#54165e';//green
             }else{
             strToReturn='#999ba0';//grey
             }
         return strToReturn;
    }
    getBorder(num){
         var strToReturn='';
         if (this.props.daily_solvedArray[num + 1]==0){
             strToReturn='#00ff00';//green
             }else{
             strToReturn='#000000';//black
             }
         return {
         borderColor: strToReturn
         };
    }
    onSelect(index, date) {
        this.props.navigator.replace({
            id: 'game',
            passProps: {
                homeData: this.props.homeData,
                title: date,
                index: index,
                fromWhere: 'daily',
                daily_solvedArray: this.props.daily_solvedArray,
                reverse: this.props.reverse,
                dataElement: this.props.dataElement,
                isPremium: this.state.isPremium,
                bgColor: this.props.bgColor,
                myTitle: this.props.title
            },
       });
    }

    render() {
        const menu = <Menu onItemSelected={ this.onMenuItemSelected } data = {this.props.homeData} />;
        if(this.state.isLoading == true){
            return(
                <View style={[daily_styles.loading, {backgroundColor: '#222222'}]}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            )
        }else{
            return (
                <SideMenu   menu={ menu }
                            isOpen={ this.state.isOpen }
                            onChange={ (isOpen) => this.updateMenuState(isOpen) }>
                    <View style={ [daily_styles.container, this.border('#070f4e')] }>
                        <View style={ daily_styles.header }>
                            <Button style={[daily_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                                <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                            <Text style={styles.header_text} >{this.props.title}</Text>
                            <Button style={[daily_styles.button, {marginRight: getArrowMargin()}]}>
                                <Image source={ require('../images/noimage.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                            </Button>
                        </View>
                        <View style={ [daily_styles.tiles_container, this.border('#070f4e')] }>
                             <ListView  showsVerticalScrollIndicator ={false}
                                        initialListSize ={50}
                                        contentContainerStyle={ daily_styles.listview }
                                        dataSource={this.state.dataSource}
                                        renderRow={(rowData) =>
                                 <View>
                                     <TouchableHighlight onPress={() => this.onSelect(rowData, moment().subtract(rowData + 1, 'days').format('MMMM D, YYYY'))}
                                                         underlayColor={this.getUnderlay(rowData)}
                                                         style={[daily_styles.launcher, this.getBorder(rowData), this.bg(rowData)]} >
                                         <Text  style={[ daily_styles.launcher_text, this.getTextColor(rowData) ] }>{moment().subtract(rowData + 1, 'days').format('M/D/YYYY')}</Text>
                                     </TouchableHighlight>
                                 </View>}
                             />
                        </View>
                        <View style={daily_styles.center_text_view}>
                            <Text numberOfLines={5} style={daily_styles.gripe_text}>{this.props.gripeText}</Text>
                        </View>
                    </View>
                </SideMenu>
            );
        }
    }
}


const daily_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.pale_bg,
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
        width: width,
        backgroundColor: '#000000',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    center_text_view: {
        flex: 1,
        width: width,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'absolute',
        padding: height/12,
        top: height/2,
    },
    gripe_text: {
        color: '#333333',
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.09),
        textAlign: 'center',
    },
    listview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tiles_container: {
        flex: 11,
        backgroundColor: colors.pale_bg,
        paddingHorizontal: 6,
        paddingTop: 15,
    },
    launcher: {
        width: height*.155,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        margin: CELL_PADDING * 1/2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    launcher_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * 0.076),
    }
});

module.exports = Daily;
