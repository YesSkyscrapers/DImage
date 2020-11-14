import React from 'react';
import FeedComponent from './FeedComponent';
import { preload, changeFetchFunc } from 'react-native-cache-control-image'
import RNFetchBlob from 'rn-fetch-blob';
import { initFeed, loadFeed, seeImage } from '../../../store/actions/feedActions'
import { checkProxy } from '../../../store/actions/appActions';
import { connect } from 'react-redux';
import moment from 'moment'
import { Dimensions } from 'react-native';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';

class FeedContainer extends React.PureComponent {

    state = {
        currentPage: 0,
        isLoading: true,
        feedListIdentifier: 1,
        isRefreshing: false
    }

    screenHeight = Dimensions.get("screen").height
    usePrevDay = false
    listData = []
    isFirstResultLoad = true;

    componentDidMount() {
        this.props.checkProxy().then(() => {
            this.setState({ isLoading: false })
        })

        //чтобы показать что он вообще то есть...
        setTimeout(() => {
            this.props.toggleTabBar(false)
        }, 500)
    }

    getNewListElements = (page) => {
        return this.props.loadFeed(page, this.usePrevDay).then(images => {

            if (page == 0 && images.length == 0 && !this.usePrevDay) {
                this.usePrevDay = true;
                return this.getNewListElements(page)
            } else {
                return images
            }
        })
    }

    onFeedScroll = (event) => {
        const offset = event.nativeEvent.contentOffset.y;
        const currentPage = (offset - offset % this.screenHeight) / this.screenHeight;
        if (this.state.currentPage != currentPage) {
            this.setState({
                currentPage
            })
            this.props.seeImage(this.listData[currentPage])
        }
    }

    onScreenTap = () => {
        this.props.toggleTabBar()
    }

    onResult = data => {
        this.listData = data;
        if (this.isFirstResultLoad && !!this.listData[0]) {
            this.props.seeImage(this.listData[0])
            this.isFirstResultLoad = false
        }
    }

    onRefresh = () => {
        this.setState({
            isRefreshing: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    isRefreshing: false,
                    feedListIdentifier: ++this.state.feedListIdentifier,
                })
                this.isFirstResultLoad = true
            }, 100)
        })
    }

    render() {
        return (
            <FeedComponent
                getNewListElements={this.getNewListElements}
                onFeedScroll={this.onFeedScroll}
                currentPage={this.state.currentPage}
                isLoading={this.state.isLoading}
                onScreenTap={this.onScreenTap}
                onResult={this.onResult}
                onRefresh={this.onRefresh}
                feedListIdentifier={this.state.feedListIdentifier}
                isRefreshing={this.state.isRefreshing}
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
        toggleTabBar: (state) => dispatch(toggle_tabbar_visibility(state)),
        checkProxy: () => dispatch(checkProxy()),
        seeImage: (url) => dispatch(seeImage(url)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedContainer);