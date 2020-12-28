import React from 'react';
import ProfileComponent from './ProfileComponent';
import { connect } from 'react-redux';
import moment from 'moment'
import { Animated, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux'
import { getWaitPromise } from '../../../tools/tools'
import { preload } from 'react-native-cache-control-image';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import crashlytics from '@react-native-firebase/crashlytics';

const IMAGE_PROPORTION = 150 / 225;

class ProfileContainer extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            headerOffset: new Animated.Value(0),
            processPreloadedPosts: [],
            showRow: 0
        }

        this.screenWidth = Dimensions.get('screen').width;
        this.screenHeight = Dimensions.get('screen').height;
        this.itemHeight = ((Dimensions.get('screen').width - 11) / 2) / IMAGE_PROPORTION
        this.isDownloadProcessActive = false
    }

    componentDidMount() {
        //onAddHistoryChangeListener(this.navigatorChanged)

        this.startAnimation()
        this.startPreloadProcess()
    }

    profileScreenName = 'profileTab'
    navigatorChanged = (changeInfo) => {
        const nextScreen = changeInfo.nextScreenName
        const prevScreen = changeInfo.prevScreenName
        if (nextScreen == this.profileScreenName) {
            this.isDownloadProcessActive = true
        } else if (prevScreen == this.profileScreenName) {
            this.isDownloadProcessActive = false
        }
    }

    startPreloadProcess = () => {
        if (this.isDownloadProcessActive) {
            const nextImage = this.props.likedImages.slice(this.state.showRow < 0 ? 0 : this.state.showRow).find(image => !this.state.processPreloadedPosts.includes(image.imageUrl))

            if (nextImage) {
                return preload(nextImage.imageUrl).then(() => {
                    return new Promise(resolve => {
                        this.setState({
                            processPreloadedPosts: this.state.processPreloadedPosts.concat([nextImage.imageUrl])
                        }, () => {
                            resolve()
                        })
                    }).then(() => {
                        return this.startPreloadProcess();
                    })
                })
            } else {
                return getWaitPromise(300).then(() => {
                    return this.startPreloadProcess();
                })
            }
        } else {
            return getWaitPromise(300).then(() => {
                return this.startPreloadProcess();
            })
        }
    }



    startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.headerOffset, {
                    toValue: this.screenWidth * 1.2,
                    duration: this.screenWidth * 8,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.headerOffset, {
                    toValue: -this.screenWidth * 0.2,
                    duration: this.screenWidth * 8,
                    useNativeDriver: true
                })
            ])
        ).start()
    }

    onLikedImagePress = (item, index, array) => {
        this.isDownloadProcessActive = false
        this.props.toggleTabBar(false)
        Actions.push("feedV2", {
            images: array,
            initialIndex: index,
            showButtons: false
        })
    }

    onScroll = event => {
        const offset = event.nativeEvent.contentOffset.y - this.screenHeight;
        if (offset > 0) {
            const currentPage = Math.round((offset - offset % this.itemHeight) / this.itemHeight);
            if (this.state.showRow != currentPage) {
                this.setState({
                    showRow: currentPage
                })
            }
        }
    }

    onSettingsPress = () => {
        crashlytics().crash();
    }

    render() {
        return (
            <ProfileComponent
                headerOffset={this.state.headerOffset}
                screenWidth={this.screenWidth}
                likedImages={this.props.likedImages}
                processPreloadedPosts={this.state.processPreloadedPosts}
                onLikedImagePress={this.onLikedImagePress}
                onScroll={this.onScroll}
                showRow={[
                    this.state.showRow - 5,
                    this.state.showRow - 4,
                    this.state.showRow - 3,
                    this.state.showRow - 2,
                    this.state.showRow - 1,
                    this.state.showRow,
                    this.state.showRow + 1,
                    this.state.showRow + 2,
                    this.state.showRow + 3,
                    this.state.showRow + 4,
                    this.state.showRow + 5
                ]}
                onSettingsPress={this.onSettingsPress}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        likedImages: state.feed.likedPost
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
)(ProfileContainer);