import React, { Component } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native';
import { normalize }  from '../config/pixelRatio';
const {width, height} = require('Dimensions').get('window');
import Swiper from 'react-native-swiper';
import Intro from '../intro/intro';
import Intro1 from '../intro/intro1';
import Intro2 from '../intro/intro2';
import Intro3 from '../intro/intro3';
import Intro4 from '../intro/intro4';
import Intro5 from '../intro/intro5';
const KEY_Premium = 'premiumOrNot';
const KEY_PlayFirst = 'playFirstKey';
const KEY_ratedTheApp = 'ratedApp';
const KEY_ThankRated = 'thankRatedApp';
const KEY_ThankPremium = 'thankPremium';
const KEY_ShowedGameOverlay = 'showedOverlay';
const KEY_ShowedOverlay = 'showOverlay';
const KEY_showFB = 'showFBKey';
const KEY_showTwitter = 'showTwitterKey';
const KEY_HideVerse = 'hideVerseKey';
const KEY_reverse = 'reverseFragments';
const KEY_expandInfo = 'expandInfoKey';
const KEY_MyHints = 'myHintsKey';
const KEY_Solved = 'numSolvedKey';
const KEY_Favorites = 'numFavoritesKey';
const KEY_show_score = 'showScoreKey';

class SwipeNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'swiper',
            isLoading: true
        };
    }
    componentDidMount() {
        setTimeout(()=> {this.setState({isLoading: false})}, 1000);
        if (this.props.seenIntro != 'true'){
            var initArray = [
                [KEY_Premium, 'false'],
                [KEY_PlayFirst, 'false'],
                [KEY_ratedTheApp, 'false'],
                [KEY_ThankRated, 'false'],
                [KEY_ThankPremium, 'false'],
                [KEY_ShowedGameOverlay, 'false'],
                [KEY_ShowedOverlay, 'false'],
                [KEY_HideVerse, 'true'],
                [KEY_showFB, 'true'],
                [KEY_showTwitter, 'true'],
                [KEY_reverse, 'true'],
                [KEY_expandInfo, '1.1.1'],
                [KEY_MyHints, '-1'],
                [KEY_Solved, '0'],
                [KEY_Favorites, '0'],
                [KEY_show_score, '1']
            ];
            try {
                AsyncStorage.multiSet(initArray);
            } catch (error) {
                window.alert('AsyncStorage error: ' + error.message);
            }
        }
    }
    onScroll(index){
        switch (index){
            case 0:
                this.intro1.reset();
                break;
            case 1:
                this.intro1.start();
                this.intro2.reset();
                break;
            case 2:
                this.intro2.start();
                this.intro1.reset();
                this.intro3.reset();
                break;
            case 3:
                this.intro3.start();
                this.intro2.reset();
                this.intro4.reset();
                break;
            case 4:
                this.intro4.start();
                this.intro3.reset();
                this.intro5.reset();
                break;
            case 5:
                this.intro5.start();
                this.intro4.reset();
                break;
        }
    }
      render() {
        if(this.state.isLoading == true){
            return(
                <View style={ styles.container }>
                    <Image style={ styles.image } source={require('../images/logo.png')} />
                    <ActivityIndicator style={styles.spinner} animating={true} size={'large'}/>
                </View>
            );
        }else{
            return (
                <Swiper
                    style={{flex: 1}}
                    loop={false}
                    showsPagination={true}
                    index={0}
                    onMomentumScrollEnd= {(e, state, context) => this.onScroll(state.index)}
                    dotStyle={{marginBottom: height*.07}}
                    activeDotStyle={{marginBottom: height*.07}}
                    dotColor= '#999999'
                >
                    <Intro  ref={(intro0) => { this.intro0 = intro0 }}
                            navigator= {this.props.navigator}
                            seenIntro= {this.props.seenIntro}
                            destination= {this.props.destination}
                            homeData= {this.props.homeData}
                            connectionBool={this.props.connectionBool}
                            isPremium= {this.props.isPremium}
                            seenIntro= {this.props.seenIntro}
                    />
                    <Intro1  ref={(intro1) => { this.intro1 = intro1 }}
                            navigator= {this.props.navigator}
                            seenIntro= {this.props.seenIntro}
                            destination= {this.props.destination}
                            homeData= {this.props.homeData}
                            connectionBool={this.props.connectionBool}
                            isPremium= {this.props.isPremium}
                            seenIntro= {this.props.seenIntro}
                    />
                    <Intro2  ref={(intro2) => { this.intro2 = intro2 }}
                            navigator= {this.props.navigator}
                            seenIntro= {this.props.seenIntro}
                            destination= {this.props.destination}
                            homeData= {this.props.homeData}
                            connectionBool={this.props.connectionBool}
                            isPremium= {this.props.isPremium}
                            seenIntro= {this.props.seenIntro}
                    />
                    <Intro3  ref={(intro3) => { this.intro3 = intro3 }}
                            navigator= {this.props.navigator}
                            seenIntro= {this.props.seenIntro}
                            destination= {this.props.destination}
                            homeData= {this.props.homeData}
                            connectionBool={this.props.connectionBool}
                            isPremium= {this.props.isPremium}
                            seenIntro= {this.props.seenIntro}
                    />
                    <Intro4  ref={(intro4) => { this.intro4 = intro4 }}
                            navigator= {this.props.navigator}
                            seenIntro= {this.props.seenIntro}
                            destination= {this.props.destination}
                            homeData= {this.props.homeData}
                            connectionBool={this.props.connectionBool}
                            isPremium= {this.props.isPremium}
                            seenIntro= {this.props.seenIntro}
                    />
                    <Intro5  ref={(intro5) => { this.intro5 = intro5 }}
                            navigator= {this.props.navigator}
                            seenIntro= {this.props.seenIntro}
                            destination= {this.props.destination}
                            homeData= {this.props.homeData}
                            connectionBool={this.props.connectionBool}
                            isPremium= {this.props.isPremium}
                            seenIntro= {this.props.seenIntro}
                    />
                </Swiper>
            );
        }
    }
}

const styles = StyleSheet.create({
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

module.exports = SwipeNavigator;
