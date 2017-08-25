import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, BackHandler, Linking } from 'react-native';
import Button from '../components/Button';
import configs from '../config/configs';
import { normalize, normalizeFont, getLikeImageSize, getArrowSize, getArrowMargin } from '../config/pixelRatio';
import FabricTwitterKit from 'react-native-fabric-twitterkit';
//import com.facebook.FacebookSdk;
const FBSDK = require('react-native-fbsdk');
const { ShareDialog } = FBSDK;
const shareLinkContent = {
  contentType: 'link',
  contentUrl: 'https://www.facebook.com/ReVersify-1729363820699544/',
};
const styles = require('../styles/styles');
const {width, height} = require('Dimensions').get('window');

module.exports = class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'social',
            shareLinkContent: shareLinkContent
        };
        this.handleHardwareBackButton = this.handleHardwareBackButton.bind(this);
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton);
    }
    handleHardwareBackButton() {
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
    linkToUrl(which){
        if (which == 'FB'){
            Linking.canOpenURL(configs.FB_PAGE_ID)
            .then((supported) => {
              console.log(supported)
                if (supported) {
                    Linking.openURL(configs.FB_PAGE_ID)//FB_URL_APP);
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
            .then((supported) => {
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
    share(which){
      if (which == 'FB'){
        ShareDialog.canShow(this.state.shareLinkContent).then((canShow) => {
          console.log(canShow);
          if (canShow) {
              return ShareDialog.show(this.state.shareLinkContent);
            }
          }
        ).then((result) => {
            if (result.isCancelled) {
              console.log('Share cancelled');
            } else {
              console.log('Share success with postId: ' + result.postId);
            }
          }
        );
      }else{
        FabricTwitterKit.composeTweet({
            body: 'All should check out \'reVersify\' in the App Store or Google Play...I\'m really enjoying it!'
        }, (completed, cancelled, error) => {
            console.log('completed: ' + completed + ' cancelled: ' + cancelled + ' error: ' + error);
        });
      }
    }
    render() {
        const imageSource = (this.props.which == 'FB')?require('../images/fblogo.png') : require('../images/twitterlogo.png');
        const likeImage = (this.props.which == 'FB')?require('../images/fblike.png') : require('../images/twitterheart.png');
        const shareImage = (this.props.which == 'FB')?require('../images/fblogo.png') : require('../images/twitterlogo.png');
        const bg = (this.props.which == 'FB')?this.props.color:'#ffffff';
        const likeText = (this.props.which == 'FB')?'Like us on Facebook':'Follow us on Twitter';
        const shareText = (this.props.which == 'FB')?'Share something about us on Facebook...':'Tweet something about us...';
        const text1 = (this.props.which == 'FB')?'Like us on Facebook so you can follow ':'Follow us on Twitter to keep up on ';
        const text2 = 'reVersify News: learn of new reVersify Verse Collections and other games we release!';
        const text = text1 + text2;
        return (
                <View style={[social_styles.container, {borderColor: this.props.color}]}>
                    <View style={ [social_styles.header, {backgroundColor: this.props.color}] }>
                        <Button style={[social_styles.button, {marginLeft: getArrowMargin()}]} onPress={ () => this.handleHardwareBackButton() }>
                            <Image source={ require('../images/arrowback.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                        </Button>
                        <Text style={styles.header_text} >{this.props.title}
                        </Text>
                        <Button style={[social_styles.button, {marginRight: getArrowMargin()}]}>
                            <Image source={ require('../images/noimage.png') } style={{ width: getArrowSize(), height: getArrowSize()}} />
                        </Button>
                    </View>
                    <View style={ social_styles.image_container }>
                        <Image source={ imageSource } style={{ width: height*.14, height: height*.14 }} />
                    </View>
                    <View style={ social_styles.outerview }>
                      <View style={ [social_styles.buttons_container,{borderColor: this.props.color}] }>
                        <Text style={social_styles.body_text}>{text}</Text>
                        <Button style={[social_styles.ok_button,{backgroundColor: bg, borderColor: this.props.color}]} onPress={()=>{this.linkToUrl(this.props.which)}}>
                          <Image source={ likeImage } style={{ width: getLikeImageSize(), height: getLikeImageSize() }} />
                        </Button>
                        <Text style={social_styles.small_text}>{likeText}</Text>
                        <Button style={[social_styles.ok_button,{backgroundColor: this.props.color, borderColor: this.props.color}]} onPress={()=>{this.share(this.props.which)}}>
                          <Image source={ shareImage } style={{ width: getLikeImageSize(), height: getLikeImageSize() }} />
                        </Button>
                        <View style={{width: height*.2}}>
                        <Text style={social_styles.small_text}>{shareText}</Text>
                        </View>
                      </View>
                    </View>
                </View>
        );
    }
};


const social_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 5,
    },
    header: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: window.width,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: normalize(height*0.077),
        height: normalize(height*0.077)
    },
    image_container: {
        flex: 8,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: height*.01
    },
    outerview: {
        flex: 18,
        justifyContent: 'center',
        alignItems: 'center',
        padding: height*.01,
        marginBottom: height*.04
    },
    buttons_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: height*.08,
        paddingVertical: height*.03,
        borderWidth: 2,
        borderRadius: height*.04
    },
    button_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .12),
        color: '#ffffff'
    },
    body_text: {
        fontSize: normalizeFont(configs.LETTER_SIZE * .085),
//        fontWeight: 'bold',
        color: '#222222',
        textAlign: 'center',
        lineHeight: Math.round(height*.03),
    },
    small_text: {
      fontSize: normalizeFont(configs.LETTER_SIZE * .068),
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      lineHeight: Math.round(height*.02)
    },
    ok_button: {
        height: height * 0.08,
        width: height * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderRadius: 4,
        marginTop: height*.05,
        marginBottom: height*.012,
        paddingTop: 3
    }
});