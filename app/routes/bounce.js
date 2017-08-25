import React, {Component} from 'react';
import { View } from 'react-native';

class Bounce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'bounce'
        };
    }
    componentDidMount() {
        this.sendBack(this.props.sender);
    }
    sendBack(from){
        if (from == 'game'){
            this.props.navigator.replace({
                id: 'game',
                passProps: {
                    homeData: this.props.homeData,
                    daily_solvedArray: this.props.daily_solvedArray,
                    dataElement: this.props.dataElement,
                    hasRated: this.props.hasRated,
                    textColor: this.props.textColor,
                    bgColor: this.props.bgColor,
                    title: this.props.title,
                    myTitle: this.props.senderTitle,
                    index: this.props.index,
                    fromWhere: this.props.fromWhere
                }
           });
        }else{
            this.props.navigator.replace({
                id: 'reader',
                passProps: {
                    homeData: this.props.homeData,
                    dataElement: this.props.dataElement,
                    chapterIndex: this.props.chapterIndex,
                }
           });
        }
    }

    render() {
		return(
			<View style={{flex: 1, backgroundColor: this.props.bgColor}}>
			</View>
		)
    }
}


module.exports = Bounce;