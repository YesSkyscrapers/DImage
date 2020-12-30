import React from 'react';
import FeedComponent from './FeedComponent';
import RNFetchBlob from 'rn-fetch-blob';
import { initFeed, likeALotImages, loadFeed, seeImage } from '../../../store/actions/feedActions'
import { checkProxy } from '../../../store/actions/appActions';
import { connect } from 'react-redux';
import moment from 'moment'
import { Dimensions } from 'react-native';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { SKIP_PAGE } from '../../theme/List';

class FeedContainer extends React.PureComponent {

    state = {
        currentPage: 0,
        isLoading: true,
        feedListIdentifier: 1,
        isRefreshing: false,
        showButtons: true
    }

    screenHeight = Dimensions.get("screen").height
    usePrevDay = false
    listData = []
    listLoadedData = [];
    isFirstResultLoad = true;
    screenChanged = false

    componentDidMount() {

        this.setState({ isLoading: false })
        setTimeout(() => {
            this.toggleUI(false)
            // this.props.likeALotImages();
        }, 1000)
    }

    onNavigatorHistoryChange = (changeInfo) => {
        this.screenChanged = true;
    }

    toggleUI = state => {
        this.props.toggleTabBar(state)
        this.setState({
            showButtons: state == undefined ? !this.state.showButtons : state
        })
    }

    getNewListElements = (page) => {
        return this.props.loadFeed(page, this.usePrevDay).then(images => {

            if (page == 0 && images.length == 0 && !this.usePrevDay) {
                this.usePrevDay = true;
                return this.getNewListElements(page)
            } else {
                if (images != SKIP_PAGE) {
                    this.listLoadedData = this.listLoadedData.concat(images)
                    if (images.length == 0 && this.listLoadedData.length == 0) {
                        this.usePrevDay = true;
                        return this.getNewListElements(page)
                    }
                }
                return images
            }
        })
    }


    onFeedScroll = (event) => {
        const offset = event.nativeEvent.contentOffset.y;
        const currentPage = Math.round((offset - offset % this.screenHeight) / this.screenHeight);
        if (this.state.currentPage != currentPage) {
            this.setState({
                currentPage
            })
            this.props.seeImage(this.listData[currentPage])
        }
    }

    onScreenTap = () => {
        this.toggleUI()
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
                    currentPage: 0
                })
                this.isFirstResultLoad = true
                this.listLoadedData = []
            }, 100)
        })
    }

    onDownloadPress = (url) => {
        //    return saveFile(url)
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
                onDownloadPress={this.onDownloadPress}
                showButtons={this.state.showButtons}
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
        likeALotImages: () => dispatch(likeALotImages(0, []))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedContainer);