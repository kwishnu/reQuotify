import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, BackHandler, Alert, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Button from '../components/Button';
import Tile from '../components/Tile';
import GrayTile from '../components/GrayTile';
import configs from '../config/configs';
import colors from '../config/colors';
import { normalize, normalizeFont, getArrowSize, getArrowMargin }  from '../config/pixelRatio';
const {width, height} = require('Dimensions').get('window');
const scrHeight = height;
const scrWidth = width;
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
        this.flip = new Animated.Value(0);
        this.state = {
            id: 'intro2',
            pan: new Animated.ValueXY(0),
            scale: new Animated.Value(1),
            bgColor: colors.pale_bg,
            panelBgColor: colors.pale_bg,
            panelBorderColor: invertColor(colors.pale_bg, true),
            showingVerse: false,
            panelText: '',
            line0Text: 'journey of a thousand',
            line1Text: 'miles must begin with',
            line2Text: 'a single step.',
            showNextArrow: false,
            letterImage: require('../images/letters/a.png'),
            arrowImage: require('../images/arrowforward.png'),
            scaleXY: new Animated.Value(0),
            showText1: false,
            showText2: false,
            showTiles: false,
            text2text: 'And finally...',
            text1text: '',
            played: false,
            showFooter: true,
            closeQuoteX: 0,
            closeQuoteY: 0,
            showCloseQuote: false,
            dummyText: '',
            name1: '',
            name2: '',
            name3: '',
            bg1Color: colors.medium_gray,
            bg2Color: colors.medium_gray,
            bg3Color: colors.medium_gray
        }
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount() {
        this.setState({frag1Opacity: 0});
        this.setPanelColors();
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
        homeData = this.props.homeData;
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
        this.goSomewhere();
        return true;
    }
    start(){
        setTimeout(()=>{
            Alert.alert('Who said it?', `After you've solved the quote, take a quiz about who is being quoted...`,
            [{text: 'OK', onPress: () => this.giveQuotedQuiz()}], { onDismiss: () => {this.giveDirections()} }
            );
        }, 500);
    }
    reset(){
        setTimeout(()=>{
            this.setState({ showText1: false,
                            showText2: false,
                            showNextArrow: false,
                            panelText: '',
                            showingVerse: false,
                            showCloseQuote: false,
                            shouldShowGuesses: false,
                            shouldShowGuessHeader: false,
                            bg1Color: colors.medium_gray,
                            bg2Color: colors.medium_gray,
                            bg3Color: colors.medium_gray
            });
            this.setPanelColors();
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
    giveQuotedQuiz(){
        this.setState({ showCloseQuote: true });
        setTimeout(() => {
            this.setState({ shouldShowGuessHeader: true });
        }, 1000);
        setTimeout(() => {
            this.setState({ shouldShowGuesses: true, name1: 'Robert Frost', name2: 'Lao Tzu', name3: 'Joan Benoit Samuelson' });
        }, 2000);

    }
    guessQuoted(whichCell, guess){
        if (guess == 'Lao Tzu'){
            this.setState({bg2Color: 'green', name1: 'That\'s right!', name3: 'Double Solved Points', text1text: 'Nice one!'});
        }else{
            switch (whichCell){
                case 'top':
                    this.setState({bg1Color: 'red', text1text: 'Who knew, right?'});
                    if (this.state.name2 == 'Lao Tzu'){
                        this.setState({bg2Color: 'green'});
                    }else{
                        this.setState({bg3Color: 'green'});
                    }
                    break;
                case 'bottom':
                    this.setState({bg3Color: 'red', text1text: 'Who knew, right?'});
                    if (this.state.name1 == 'Lao Tzu'){
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
            this.flipPanel();
        }, 2000);
        setTimeout(() => {
            this.giveDirections();
        }, 1000);

    }
    setCloseQuoteX(event){
        let dims = {x, y, width, height} = event.nativeEvent.layout;
        let xOffset = dims.width + height*.15 + scrHeight*.09;
        this.setState({
            closeQuoteX: xOffset
        });
    }
    setCloseQuoteY(event){
        let d = {x, y, width, height} = event.nativeEvent.layout;
        let yOffset = 2 * d.height + height*.25;
        this.setState({closeQuoteY: yOffset});
    }
    giveDirections(){
        setTimeout(()=>{this.setState({showText1: true, showText2: true, showNextArrow: true})}, 1200);
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

    flipPanel(){
        this.flip.setValue(0);
        let pBgC ='';
        let pBC = '';
        let bool = false;
        if(!this.state.showingVerse){
            pBgC = '#555555';
            pBC = '#000000';
            bool = true;
            this.setState({panelText:  'Lao Tzu',
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
    giveHint(frag){
        if (!this.state.played){
            this.c.showNextTile(frag);
        }

    }

    render() {
        const rotateX = this.flip.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        let imageStyle = {transform: [{rotateX}]};
        return (
            <View style={{flex: 1}}>
                <Text style={intro_styles.dummy_text_container} onLayout={(event) => this.setCloseQuoteX(event)} >
                    <Text style={intro_styles.dummy_text}>a single step.</Text>
                </Text>
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
                                    <View style={intro_styles.second_line}>
                                        <Text style={intro_styles.verse_text} >{ this.state.line1Text }</Text>
                                    </View>
                                    <View style={intro_styles.third_line}>
                                        <Text style={intro_styles.verse_text} >{ this.state.line2Text }</Text>
                                    </View>
                                    <View style={intro_styles.line} onLayout={(event) => this.setCloseQuoteY(event)}>
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
                                    {this.state.showCloseQuote &&
                                    <View style={[intro_styles.close_quote_container,{top: this.state.closeQuoteY, left: this.state.closeQuoteX}]}>
                                        <Animatable.Image
                                            style={intro_styles.close_quote}
                                            resizeMode='stretch'
                                            source={require('../images/closequote.png')}
                                            ref='closequote'
                                            animation={'bounceInRight'}
                                            duration={900}
                                            delay={500}
                                        />
                                    </View>
                                    }
                                </View>
                    </View>
                    <View style={intro_styles.verse_panel_container} onStartShouldSetResponder={ ()=> {this.flipPanel()}}>
                        <Animated.View style={[imageStyle, intro_styles.verse_panel, {backgroundColor: this.state.panelBgColor, borderColor: this.state.panelBorderColor}]}>
                                    <Text style={intro_styles.panel_text} >{this.state.panelText}</Text>
                        </Animated.View>
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
                        <View style={{padding: height*.015}} onStartShouldSetResponder={()=>this.goSomewhere()}>
                            <Text style={intro_styles.footer_text}>Skip</Text>
                        </View>
                        <View style={{height:height*.09, width: height*.09, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={intro_styles.footer_text}></Text>
                        </View>
                    </View>
                    {this.state.shouldShowGuessHeader &&
                    <View style={{position: 'absolute', top: scrHeight*.34, left: 0, width: scrWidth, height: scrHeight*.2}}>
                        <Animatable.Image source={ require('../images/nicejob.png') }
                            style={intro_styles.guess_header}
                            ref='header'
                            animation={'bounceInDown'}
                            duration={900}
                        >
                        </Animatable.Image>
                    </View>
                    }
                    {this.state.shouldShowGuesses &&
                    <View style={{position: 'absolute', top: scrHeight*.5, left: width*.05, width: scrWidth*.9, height: scrHeight*.6}}>
                        <Animatable.View
                            style={[intro_styles.guess_cell, {top: 0, backgroundColor: this.state.bg1Color}]}
                            ref='top'
                            animation={'bounceInLeft'}
                            duration={700}
                            onStartShouldSetResponder={() => {this.guessQuoted('top', this.state.name1);}}
                        >
                          <Text style={intro_styles.name}>{this.state.name1}</Text>
                        </Animatable.View>
                        <Animatable.View
                            style={[intro_styles.guess_cell, {top: scrHeight*.1, backgroundColor: this.state.bg2Color}]}
                            ref='middle'
                            animation={'bounceInRight'}
                            duration={800}
                            onStartShouldSetResponder={() => {this.guessQuoted('middle', this.state.name2);}}
                        >
                          <Text style={intro_styles.name}>{this.state.name2}</Text>
                        </Animatable.View>
                        <Animatable.View
                            style={[intro_styles.guess_cell, {top: scrHeight*.2, backgroundColor: this.state.bg3Color}]}
                            ref='bottom'
                            animation={'bounceInLeft'}
                            duration={600}
                            onStartShouldSetResponder={() => {this.guessQuoted('bottom', this.state.name3);}}
                        >
                          <Text style={intro_styles.name}>{this.state.name3}</Text>
                        </Animatable.View>
                    </View>
                    }
                </View>
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
    open_quote_container: {
        position: 'absolute',
        top: 0,
        width: height*.046,
        height: height*.026
    },
    open_quote: {
        width: height*.045,
        height: height*.025,
    },
    close_quote_container: {
        position: 'absolute',
        width: height*.046,
        height: height*.026
    },
    close_quote: {
        width: height*.045,
        height: height*.025,
    },
    text1: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height*.15,
        top: height*.48,
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
        top: height*.06,
        left: (width-(height*.478))/2 + height*.051,
        width: height*.11,
        height: height*.08
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
        paddingLeft: height*.086,
    },
    second_line: {
        flex: 1,
        paddingLeft: height*.094,
    },
    third_line: {
        flex: 1,
        paddingLeft: height*.105,
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
        justifyContent: 'space-between',
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
        top: height*.58,
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

module.exports = Intro2;