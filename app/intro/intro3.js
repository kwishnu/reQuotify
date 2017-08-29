import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, BackHandler, Alert } from 'react-native';
import Button from '../components/Button';
import Tile from '../components/Tile';
import GrayTile from '../components/GrayTile';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
const deepCopy = require('../config/deepCopy.js');
const {width, height} = require('Dimensions').get('window');
let homeData = {};
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


class Intro2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'intro2',
            bgColor: colors.pale_bg,
            panelBgColor: colors.pale_bg,
            panelBorderColor: invertColor(colors.pale_bg, true),
            line0Text: 'n the beginning God',
            line1Text: 'creat',
            line2Text: '',
            showNextArrow: false,
            letterImage: require('../images/letters/i.png'),
            arrowImage: require('../images/arrowforward.png'),
            showText1: false,
            showText2: false,
            showTiles: true,
            text1text: 'Tap the \'hint\' button below to show the next tile...',
            text2text: '...and now, drop it on the page.',
            played: false,
            showFooter: true
        }
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        this.setState({frag1Opacity: 0});
        this.setPanelColors();
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        homeData = this.props.homeData;
        this.setState({ letterImage: require('../images/letters/i.png') });
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        this.props.navigator.pop({});
        return true;
    }
    start(){
        setTimeout(()=>{
            Alert.alert('Hints', 'If you get stumped, try using the hint button...',
            [{text: 'OK', onPress: () => this.giveDirections()}], { onDismiss: () => {this.giveDirections()} }
            );
        }, 500);
    }
    reset(){
        setTimeout(()=>{
            this.setState({ text1text: 'Tap the \'hint\' button below to show the next tile...',
                            text2text: '...and now, drop it on the page.',
                            showText1: false,
                            showText2: false,
                            showTiles: true,
                            nextFrag: 'edtheh',
                            played: false,
                            line0Text: 'n the beginning God',
                            line1Text: 'creat',
                            showNextArrow: false,
                            showFooter: true
            });
        }, 500);
    }
    goSomewhere(){
        if (this.props.seenIntro != 'true'){
            this.props.navigator.replace({
                id: 'home',
                passProps: {
                    homeData: this.props.homeData,
                    isPremium: this.props.isPremium,
                    seenIntro: this.props.seenIntro,
                    connectionBool: this.props.connectionBool,
                    destination: this.props.destination
                },
           });
        }else{
            this.props.navigator.pop({});
        }
    }
    setPanelColors(){
        let darkerPanel = shadeColor(colors.pale_bg, -10);
        let darkerBorder = shadeColor(colors.pale_bg, -50);
        this.setState({panelBgColor: darkerPanel, panelBorderColor: darkerBorder});
    }
    giveDirections(){
        setTimeout(()=>{this.setState({showText1: true})}, 250);
//        setTimeout(()=>{this.setState({showText2: true})}, 1500);
    }
    onDrop(text) {
        if (text == 'edtheh'){
            this.setState({line1Text: 'created the h', played: true});
            setTimeout(() => {this.setState({ text1text: 'Two hints per verse unless you\'ve purchased a hint package', showText2: false, showTiles: false, showFooter: false })}, 800);
            setTimeout(() => {this.setState({ showNextArrow: true, showFooter: true, showText2: true, text2text: 'Next...' })}, 802);
        }
    }
    footerBorder(color) {
        let bgC = colors.pale_bg;
        let darkerColor = (bgC == colors.pale_bg)?shadeColor(colors.blue_bg, 5):shadeColor(color, -40);
        return {borderColor: darkerColor};
    }
    headerBorder(color) {
        let bgC = colors.pale_bg;
        let darkerColor = (bgC == colors.pale_bg)?shadeColor(colors.blue_bg, 5):shadeColor(color, -40);
        return {borderColor: darkerColor};
    }
    headerFooterColor(color) {
        let bgC = colors.pale_bg;
        let darkerColor = (bgC == colors.pale_bg)? colors.blue_bg:shadeColor(color, -40);
        return {backgroundColor: darkerColor};
    }
    giveHint(frag){
        if (!this.state.played){
            this.c.showNextTile(frag);
        setTimeout(()=>{this.setState({showText2: true})}, 300);
        }

    }

    render() {
        return (
            <View style={[intro_styles.container, {backgroundColor: this.state.bgColor}]}>
                <View style={[intro_styles.header, this.headerBorder(this.state.bgColor), this.headerFooterColor(this.state.bgColor)]}>
                    <Button style={[intro_styles.button, {marginLeft: getArrowMargin()}]}>
                        <Image source={ require('../images/close.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                    </Button>
                    <Button style={[intro_styles.button, {marginRight: getArrowMargin()}]}>
                        <Image source={ require('../images/dropdown.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                    </Button>
                </View>
                <View style={intro_styles.tablet}>
                        <Image style={intro_styles.parchment} source={require('../images/parchment.png')} resizeMode='stretch'/>
                        <Image style={intro_styles.letter} source={this.state.letterImage} />
                            <View style={intro_styles.verse_container}>
                                <View style={intro_styles.first_line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line0Text }</Text>
                                </View>
                                <View style={intro_styles.first_line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line1Text }</Text>
                                </View>
                                <View style={intro_styles.first_line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line2Text }</Text>
                                </View>
                                <View style={intro_styles.line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line3Text }</Text>
                                </View>
                                <View style={intro_styles.line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line4Text }</Text>
                                </View>
                                <View style={intro_styles.line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line5Text }</Text>
                                </View>
                                <View style={intro_styles.line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line6Text }</Text>
                                </View>
                                <View style={intro_styles.line}>
                                    <Text style={intro_styles.verse_text} >{ this.state.line7Text }</Text>
                                </View>
                                <View style={intro_styles.line}></View>
                            </View>
                </View>
                <View style={intro_styles.verse_panel_container}>
                    <View style={[intro_styles.verse_panel, {backgroundColor: this.state.panelBgColor, borderColor: this.state.panelBorderColor}]}>
                    </View>
                </View>
                { this.state.showNextArrow &&
                <View style={intro_styles.next_arrow}>
                    <Image source={this.state.arrowImage}/>
                </View>
                }
                { this.state.showText1 &&
                <View style={intro_styles.text1}>
                    <Text style={intro_styles.instructions_text}>{this.state.text1text}</Text>
                </View>
                }
                { this.state.showText2 &&
                <View style={intro_styles.text2}>
                    <Text style={intro_styles.instructions_text}>{this.state.text2text}</Text>
                </View>
                }
                <View style={intro_styles.game}>
                </View>
                <View style={[intro_styles.footer, this.footerBorder(this.state.bgColor), this.headerFooterColor(this.state.bgColor)]}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: width}}>
                            <View style={{padding: height*.015}} onStartShouldSetResponder={()=>this.goSomewhere()}>
                                <Text style={intro_styles.footer_text}>Skip</Text>
                            </View>
                            <View style={intro_styles.hint_container} onStartShouldSetResponder={() => { this.giveHint('edtheh') }}>
                                <View style={intro_styles.hint_button} >
                                    <Text style={intro_styles.hint_text}>hint</Text>
                                </View>
                            </View>
                            <View style={{padding: height*.015}}>
                                <Text style={[intro_styles.footer_text, {color: colors.blue_bg}]}>Skip</Text>
                            </View>
                        </View>
                </View>
                 { this.state.showTiles &&
                    <View style={intro_styles.tiles_container}>
                       <View style={intro_styles.tile_row} >
                            <Tile opac={0} ref={(a) => { this.a = a; }}  text={ 'nthebegi' } nextFrag={ 'nthebegi' } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            <Tile ref={(b) => { this.b = b; }} text={ 'sandt' } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            <Tile ref={(c) => { this.c = c; }} text={ 'edtheh' } nextFrag={ 'edtheh' } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                        </View>
                        <View style={intro_styles.tile_row} >
                            <Tile opac={0} ref={(d) => { this.d = d; }} text={ 'taerc' } nextFrag={ 'creat' } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            <Tile ref={(e) => { this.e = e; }} text={ 'eaven' } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                            <Tile opac={0} ref={(f) => { this.f = f; }} text={ 'ninggod' } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                        </View>
                        <View style={intro_styles.tile_row} >
                            <Tile ref={(g) => { this.g = g; }} text={ 'heearth' } nextFrag={ this.state.nextFrag } onDrop={ (text)=>{ this.onDrop(text); }} sounds={ this.state.useSounds }/>
                        </View>
                    </View>
                }
            </View>
        );
    }
}



const intro_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        width: width,
        borderBottomWidth: 6,
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
        width: width,
    },
    parchment: {
        position: 'absolute',
        top: 0,
        left: (width-(height*.47))/2,
        height: height*.30,
        width: height*.47
    },
    tiles_container: {
        position: 'absolute',
        height: 250,
        width: width,
        top: height*.6,
        left: 0
    },
    text1: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height*.15,
        top: height*.47,
        paddingHorizontal: height*.06
    },
    text2: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height*.15,
        top: height*.72,
        paddingHorizontal: height*.06
    },
    letter: {
        position: 'absolute',
        top: height*.052,
        left: (width-(height*.478))/2 + height*.058,
        width: height*.08,
        height: height*.083,
    },
    verse_container: {
        flex: 1,
        position: 'absolute',
        top: height*.05,
        left: (width-(height*.478))/2 + height*.063,
        width: width*.75,
        height: height*.25,
    },
    first_line: {
        flex: 1,
        paddingLeft: height*.075,
    },
    line: {
        flex: 1,
    },
    verse_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.09),
        color: '#000000',
        fontFamily: 'Book Antiqua',
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
    instructions_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.1),
        color: '#000000',
        textAlign: 'center',

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
        justifyContent: 'space-around',
        width: width,
        borderTopWidth: 6,
        paddingHorizontal: normalize(height*0.01),
    },
    footer_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE*0.14),
        fontWeight: 'bold',
        color: '#ffffff',
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
        height: height/5.5,
        top: height*.6,
    }
});

module.exports = Intro2;