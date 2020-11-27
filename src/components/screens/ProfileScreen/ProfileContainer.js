import React from 'react';
import ProfileComponent from './ProfileComponent';
import { connect } from 'react-redux';
import moment from 'moment'
import { Animated, Dimensions } from 'react-native';
import { Actions, onAddHistoryChangeListener } from 'react-native-js-navigator'
import { getWaitPromise } from '../../../tools/tools'
import { preload } from 'react-native-cache-control-image';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';

class ProfileContainer extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            headerOffset: new Animated.Value(0),
            processPreloadedPosts: []
        }

        this.screenWidth = Dimensions.get('screen').width;
        this.isDownloadProcessActive = false
    }

    componentDidMount() {
        onAddHistoryChangeListener(this.navigatorChanged)

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
            const nextImage = this.props.likedImages.find(image => !this.state.processPreloadedPosts.includes(image.imageUrl))

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
        this.props.toggleTabBar(false)
        Actions.push("feedV2", {
            images: array,
            initialIndex: index,
            showButtons: false
        })
    }

    render() {
        return (
            <ProfileComponent
                headerOffset={this.state.headerOffset}
                screenWidth={this.screenWidth}
                likedImages={this.props.likedImages}
                processPreloadedPosts={this.state.processPreloadedPosts}
                onLikedImagePress={this.onLikedImagePress}
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