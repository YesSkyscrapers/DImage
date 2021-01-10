import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { saveFile, seeImage } from '../../../store/actions/feedActions';
import colors from '../../theme/colors';
import Image from '../../theme/Image';
import LikeUI from './LikeUI';

class FeedV2Item extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            showButtons: props.showButtons
        }

        this.sawMark = false
    }

    componentDidMount() {
        if (!this.props.showStub) {
            this.markAsSaw()
        }
    }

    componentWillUnmount() {
    }

    markAsSaw = () => {
        this.sawMark = true;
        this.props.seeImage(this.props.image.link)
    }

    componentDidUpdate(prevProps) {
        if (this.props.showStub != prevProps.showStub && !this.sawMark && !this.props.showStub) {
            this.markAsSaw()
        }
    }

    onScreenTap = () => {
        this.props.onScreenTap()
    }



    onDownloadPress = item => {
        return this.props.downloadFile(item)
    }

    render() {


        return (
            <View style={styles.dimensionsContainer}>
                <LikeUI
                    showBackButton
                    onBackButtonPress={this.props.onBackButtonPress}
                    item={this.props.image}
                    onPress={this.onScreenTap}
                    onDownloadPress={this.onDownloadPress}
                    showButtons={this.props.showButtons}
                    likedPost={this.props.likedPost}
                >
                    {
                        this.props.showStub ? (
                            <View style={[styles.dimensionsContainer, styles.center]}>
                                <ActivityIndicator size="large" color={colors.white} />
                            </View>
                        ) : (
                                <Image
                                    resizeMode="contain"
                                    loaderSize="large"
                                    url={this.props.image.imageUrl}
                                    style={styles.dimensionsContainer}
                                />
                            )
                    }
                </LikeUI>
            </View>
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
        downloadFile: item => dispatch(saveFile(item)),
        seeImage: image => dispatch(seeImage(image))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedV2Item);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    dimensionsContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})