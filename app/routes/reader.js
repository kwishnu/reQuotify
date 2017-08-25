import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, BackHandler, AsyncStorage, AppState, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import configs from '../config/configs';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
import moment from 'moment';
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');
const KEY_Verses = 'versesKey';


module.exports = class Reader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'reader',
            isLoading: true,
            title: '',
            chapterNumber: '',
            section1: '',
            section2: '',
            section3: '',
            initial: '',
            backOpacity: 0,
            forwardOpacity: 0,
            bookmarkImage: require('../images/bookmarkgray.png'),
            bookmarkSet: false,
            bgColor: '',
            homeData: this.props.homeData
        };
        this.goBack = this.goBack.bind(this);
    }
    componentDidMount(){
        if (this.state.homeData[this.props.dataElement].on_chapter == String(this.props.chapterIndex)){
            this.setState({bookmarkImage: require('../images/bookmarkred.png'), bookmarkSet: true});
        }
        let chapterText = this.props.homeData[this.props.dataElement].chapters[this.props.chapterIndex];
        let s1 = '';
        let s2 = '';
        let s3 = '';
        if (this.props.fromWhere == 'game'){
            let startIndex = (this.props.startPoint == '1')?0:chapterText.indexOf(this.props.startPoint + ' ');
            let endIndex = (chapterText.indexOf(this.props.endPoint) > -1)?chapterText.indexOf(this.props.endPoint, startIndex + 1):chapterText.length;
            if (startIndex > -1 && endIndex > -1){
                s1 = chapterText.substring(0, startIndex - 1);
                s2 = chapterText.substring(startIndex, endIndex - 2);
                s3 = chapterText.substring(endIndex - 2);
            }else{
                s1 = chapterText
            }
        }else{
             s1 = chapterText
        }
        let title = this.props.homeData[this.props.dataElement].title;
        let bg = this.props.homeData[this.props.dataElement].bg_color;
        let chapNum = s1.substr(0, s1.indexOf('\n'));
        s1 = s1.substring(s1.indexOf('\n') + 1);
//        let initialLetter = s1.substr(0, 1);
//        s1 = s1.substring(1);
        let backOpac = (this.props.chapterIndex > 0)?1:0;
        let forwardOpac = (this.props.chapterIndex < this.props.homeData[this.props.dataElement].chapters.length - 1)?1:0;
        this.setState({ title: title,
                        chapterNumber: chapNum,
//                        initial: initialLetter,
                        section1: s1,
                        section2: s2,
                        section3: s3,
                        backOpacity: backOpac,
                        forwardOpacity: forwardOpac,
                        bgColor: bg,
                        isLoading: false
        })
        BackHandler.addEventListener('hardwareBackPress', this.goBack);
        AppState.addEventListener('change', this.handleAppStateChange);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.goBack);
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    handleAppStateChange=(appState)=>{
        if(appState == 'active'){
            this.props.navigator.replace({
                id: 'splash',
                passProps: {
                    motive: 'initialize'
                }
            });
        }
    }
    goBack() {
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
    nextChapter(direction){
        if(this.state.forwardOpacity == 0 && direction == 1)return;
        if(this.state.backOpacity == 0 && direction == -1)return;
        let newIndex = this.props.chapterIndex + direction;
        this.props.navigator.replace({
            id: 'bounce',
            passProps: {
                sender: 'reader',
                homeData: this.props.homeData,
                dataElement: this.props.dataElement,
                chapterIndex: newIndex,
            }
       });
    }
    setBookmark(set){
        if(!set){
            this.setState({bookmarkImage: require('../images/bookmarkred.png')});
            this.state.homeData[this.props.dataElement].on_chapter = String(this.props.chapterIndex);
        }else{
            this.setState({bookmarkImage: require('../images/bookmarkgray.png')});
            this.state.homeData[this.props.dataElement].on_chapter = '0';
        }
        try {
            AsyncStorage.setItem(KEY_Verses, JSON.stringify(this.state.homeData));
        } catch (error) {
            window.alert('AsyncStorage error: ' + error.message);
        }
    }

    render() {
        if(this.state.isLoading == true){
            return(
                <View style={[reader_styles.loading, {backgroundColor: '#222222'}]}>
                    <ActivityIndicator animating={true} size={'large'}/>
                </View>
            );
        }else{
            return (
                <View style={reader_styles.container}>
                    <View style={reader_styles.header}>
                        <Button style={[reader_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.goBack() }>
                            <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                        </Button>
                        <Button style={[reader_styles.button, {opacity: this.state.backOpacity}]} onPress={ () => this.nextChapter(-1) }>
                            <Image source={ require('../images/playarrowback.png') } style={{ width: normalize(height*0.08), height: normalize(height*0.08) }} />
                        </Button>
                        <Text style={styles.header_text} >{this.state.title}</Text>
                        <Button style={[reader_styles.button, {opacity: this.state.forwardOpacity}]} onPress={ () => this.nextChapter(1)}>
                            <Image source={ require('../images/playarrowforward.png') } style={{ width: normalize(height*0.08), height: normalize(height*0.08) }} />
                        </Button>
                        <Button style={[reader_styles.button, {marginRight: getArrowMargin()}]}  onPress={ () => this.setBookmark(this.state.bookmarkSet) }>
                            <Image source={this.state.bookmarkImage} style={{ width: getArrowSize(), height: getArrowSize()}} />
                        </Button>
                    </View>
                    <View style={[reader_styles.reader_container, {backgroundColor: this.state.bgColor}]}>
                        <ScrollView contentContainerStyle={reader_styles.scrollview}>
                            <Text style={reader_styles.bold_text}>{'\r\n'}</Text>
                            <Text style={reader_styles.initial_text}>{this.state.chapterNumber + '\r\n'}</Text>
                            <Text style={reader_styles.text}>
                                {this.state.section1}
                                <Text style={reader_styles.bold_text}> {this.state.section2} </Text>
                                {this.state.section3}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            );
        }
    }
}



const reader_styles = StyleSheet.create({
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
        padding: 6,
        width: width,
        backgroundColor: '#000000',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.08),
        height: normalize(height*0.08)
    },
    reader_container: {
        flex: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollview: {
        width: width*.93,
        borderWidth: 2,
        borderColor: '#333333',
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.09),
        color: '#000000',
        fontFamily: 'Book Antiqua',
        margin: 30
    },
    bold_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.09),
        color: '#000000',
        fontFamily: 'Book Antiqua',
        fontWeight: 'bold'
    },
    initial_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.14),
        color: '#000000',
        fontFamily: 'Book Antiqua',
    },
});
