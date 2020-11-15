import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { loadFeedPost } from '../../../store/actions/feedActions';
import { preload } from 'react-native-cache-control-image'
import { connect } from 'react-redux';
import Image from '../../theme/Image';
import colors from '../../theme/colors';

class FeedItem extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            postUrl: props.item,
            postInfo: undefined,
            isLoading: true,
        }

        this.cancelLoad = false;
    }

    componentDidMount() {
        this.props.loadFeedPost(this.state.postUrl).then(postInfo => {
            if (this.cancelLoad) {
                return;
            }
            if (postInfo) {
                this.setState({
                    postInfo
                }, () => {
                    if (this.props.onCompleteUrlReceived) {
                        this.props.onCompleteUrlReceived(postInfo.imageUrl)
                    }
                    preload(postInfo.imageUrl).then((result) => {
                        if (this.cancelLoad) {
                            return;
                        }
                        this.setState({
                            isLoading: !result
                        })
                    })
                })
            } else {
                console.log('smth error, pls catch it')
            }
        })
    }

    componentWillUnmount() {
        this.cancelLoad = true
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    (!this.state.postInfo || this.state.isLoading) ? (
                        <ActivityIndicator size="large" color={colors.white} />
                    ) : (
                            <Image
                                resizeMode="contain"
                                loaderSize="large"
                                url={this.state.postInfo.imageUrl}
                                style={styles.container}
                            />
                        )
                }
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
        loadFeedPost: (url) => dispatch(loadFeedPost(url)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedItem);

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})