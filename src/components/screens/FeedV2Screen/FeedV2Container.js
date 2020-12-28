import React from 'react';
import FeedV2Component from './FeedV2Component';
import { connect } from 'react-redux';
import { Animated, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';

const HEADER_OFFSET = 500;
const ACTIVE_IMAGES_COUNT = 5; // *2 + 1 (current + before + after)

class FeedV2Container extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            images: props.images,
            activeIndex: props.initialIndex,
            showButtons: props.showButtons,
            headerOffset: new Animated.Value(props.showButtons ? 0 : -HEADER_OFFSET),
        }

        this.screenHeight = Dimensions.get('screen').height
    }


    componentDidMount() {
        if (this.props.initialIndex) {
            setTimeout(() => {
                this.scrollRef.scrollTo({
                    x: 0,
                    y: this.props.initialIndex * this.screenHeight,
                    animated: false
                })
            }, 100)
        }
    }

    checkIfShouldShow = (index) => {
        let maxIndex = ACTIVE_IMAGES_COUNT + this.state.activeIndex;
        let minIndex = this.state.activeIndex - ACTIVE_IMAGES_COUNT;
        var list = [];
        for (var i = minIndex; i <= maxIndex; i++) {
            list.push(i);
        }
        return list.includes(index)
    }

    onScroll = event => {
        const offset = event.nativeEvent.contentOffset.y;
        const currentPage = Math.round((offset - offset % this.screenHeight) / this.screenHeight);
        if (this.state.activeIndex != currentPage) {
            this.setState({
                activeIndex: currentPage
            })
        }
    }

    onBackButtonPress = () => {
        Actions.pop();
    }

    onScreenTap = () => {
        this.toggleUI();
    }

    toggleUI = (state) => {
        const newState = state == undefined ? !this.state.showButtons : state
        this.props.toggleTabBar(state)
        this.setState({
            showButtons: newState
        })
        this.animate(newState)
    }

    animate = (state = false) => {
        const newHeaderValue = state ? 0 : -HEADER_OFFSET
        Animated.parallel([
            Animated.timing(this.state.headerOffset, {
                toValue: newHeaderValue,
                duration: 300,
                useNativeDriver: true
            })
        ]).start()
    }


    render() {
        return (
            <FeedV2Component
                images={this.state.images}
                onScroll={this.onScroll}
                checkIfShouldShow={this.checkIfShouldShow}
                onBackButtonPress={this.onBackButtonPress}
                setScrollRef={ref => this.scrollRef = ref}
                showButtons={this.state.showButtons}
                onScreenTap={this.onScreenTap}
                headerOffset={this.state.headerOffset}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleTabBar: (state) => dispatch(toggle_tabbar_visibility(state)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedV2Container);