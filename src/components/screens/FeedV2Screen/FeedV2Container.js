import React from 'react';
import FeedV2Component from './FeedV2Component';
import { connect } from 'react-redux';
import { Animated, Dimensions, LogBox } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { loadFeed, loadFeedPost } from '../../../store/actions/feedActions';
import { SKIP_PAGE } from '../../theme/List';
import eventsService from '../../../tools/eventsService';
import { FEED_DROP_EVENT } from '../../../store/constants/feedConstants'

const HEADER_OFFSET = 500;
const ACTIVE_IMAGES_COUNT = 5; // *2 + 1 (current + before + after)

class FeedV2Container extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            images: props.images || [],
            activeIndex: props.initialIndex || 0,
            showButtons: props.showButtons == undefined ? true : props.showButtons,
            headerOffset: new Animated.Value(props.showButtons ? 0 : -HEADER_OFFSET),
            activeSearchingProcess: !props.disableActiveSearchingProcess,
            scrollReady: false,
            showBackButton: props.showBackButton == undefined ? false : props.showBackButton
        }

        this.screenHeight = Dimensions.get('screen').height
        this.loadActive = false;
        this.usePrevDay = false;
        this.loadComplete = false;
        this.page = 0;
        this.currentSceneName = null;
        this.sessionId = 0;
    }


    componentDidMount() {
        this.load()

        this.subscribeToDrop()
    }

    load = () => {
        setTimeout(() => {
            this.currentSceneName = Actions.currentScene;
        }, 100);
        if (this.props.initialIndex != undefined) {
            setTimeout(() => {
                this.scrollRef.scrollTo({
                    x: 0,
                    y: this.props.initialIndex * this.screenHeight,
                    animated: false
                })
                setTimeout(() => {
                    this.setState({
                        scrollReady: true
                    })
                }, 100)
            }, 100)
        } else {
            this.setState({
                scrollReady: true
            })
        }
        if (this.state.activeSearchingProcess) {
            this.loadFirstPage()
        }
    }

    componentWillUnmount() {
        if (!this.props.notUseSubscribeToDrop) {
            eventsService.removeEventListener(FEED_DROP_EVENT, this.feedDrop)
        }
    }

    subscribeToDrop = () => {
        if (!this.props.notUseSubscribeToDrop) {
            eventsService.addEventListener(FEED_DROP_EVENT, this.feedDrop)
        }
    }

    feedDrop = () => {
        this.sessionId++;
        this.setState({
            images: this.props.images || [],
            activeIndex: this.props.initialIndex || 0,
        }, () => {
            this.load()
        })
    }

    loadFirstPage = (page = 0) => {
        return this.getNewElements(page).then((result) => {
            if (result == SKIP_PAGE) {
                return this.loadFirstPage(page + 1)
            } else {
                return result;
            }
        })
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

            if (currentPage > (this.state.images.length) - 4 && this.state.activeSearchingProcess) {
                this.getNewElements()
            }
        }
    }

    getNewElements = () => {

        const currentSessionId = this.sessionId

        if (this.loadActive || this.loadComplete) {
            return Promise.resolve();
        }

        this.loadActive = true;
        return this.props.loadFeed(this.page, this.usePrevDay).then(images => {
            if (currentSessionId != this.sessionId) {
                return null;
            }
            if (this.page == 0 && images.length == 0 && !this.usePrevDay) {
                this.usePrevDay = true;
                return this.getNewElements(this.page)
            } else {
                this.page++;
                if (images != SKIP_PAGE) {
                    if (images.length == 0) {
                        this.loadComplete = true;
                        return images;
                    } else {
                        return this.loadPostInfos(images);
                    }
                }
                return images
            }
        }).finally(() => {
            this.loadActive = false;
        })
    }

    loadPostInfos = imageUrls => {
        const currentSessionId = this.sessionId;
        return Promise.all(imageUrls.map(imageUrl => {
            return this.props.loadFeedPost(imageUrl).then(postInfo => {
                return new Promise(resolve => {
                    if (currentSessionId != this.sessionId) {
                        resolve()
                    } else {
                        if (this.state.images.map(image => image.imageUrl).includes(postInfo.imageUrl)) {
                            resolve()
                        } else {
                            this.setState({
                                images: this.state.images.concat([postInfo])
                            }, () => {
                                resolve()
                            })
                        }
                    }
                })
            })
        }))
    }

    onBackButtonPress = () => {
        Actions.pop();
    }

    onScreenTap = () => {
        this.toggleUI();
    }

    toggleUI = (state) => {
        if (Actions.currentScene == this.currentSceneName) {
            const newState = state == undefined ? !this.state.showButtons : state
            this.props.toggleTabBar(state)

            this.setState({
                showButtons: newState
            })
            this.animate(newState)
        }
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
                scrollReady={this.state.scrollReady}
                showBackButton={this.state.showBackButton}
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
        loadFeed: (page, usePrevDay) => dispatch(loadFeed(page, usePrevDay)),
        loadFeedPost: (url) => dispatch(loadFeedPost(url)),
        toggleTabBar: (state) => dispatch(toggle_tabbar_visibility(state)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedV2Container);