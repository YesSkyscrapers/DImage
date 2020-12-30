import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { loadFeedPost } from '../../../store/actions/feedActions';
import { connect } from 'react-redux';
import Image from '../../theme/Image';
import colors from '../../theme/colors';
import Button from '../../theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faHeart, faCheckSquare, faClipboardCheck, faCloudDownloadAlt, faDownload, faFileDownload, faSpellCheck } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons';
import { unlike_post, like_post } from '../../../store/actionCreators/feedActionCreators';

const ANIMATION_MAX = 200;

class FeedItemContainer extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            saved: false,
            showButtons: new Animated.Value(props.showButtons ? 0 : ANIMATION_MAX)
        }

        this.completeUrl = undefined;
    }

    componentDidUpdate(prevProps) {
        if (this.props.showButtons != prevProps.showButtons) {
            this.animate(this.props.showButtons)
        }
    }

    animate = (state = false) => {
        const newValue = state ? 0 : ANIMATION_MAX
        Animated.timing(this.state.showButtons, {
            toValue: newValue,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    onDownloadPress = () => {
        this.props.onDownloadPress(this.completeUrl ? this.completeUrl : this.props.item).then(() => {
            this.setState({
                saved: true
            })
        })
    }

    onCompleteUrlReceived = url => {
        this.completeUrl = url
    }

    like = () => {
        if (!this.completeUrl) {
            setTimeout(() => {
                this.like()
            }, 1000)
            return;
        }
        const likeObject = {
            postUrl: this.props.item,
            imageUrl: this.completeUrl
        }
        if (this.props.likedPost.includes(this.completeUrl)) {
            this.props.unlike(likeObject)
        } else {
            this.props.like(likeObject)
        }
    }


    render() {
        return (
            <Button
                activeOpacity={1}
                onPress={this.props.onPress}
            >
                {
                    React.Children.map(this.props.children, child => {
                        return React.cloneElement(child, {
                            onCompleteUrlReceived: this.onCompleteUrlReceived
                        })
                    })
                }
                <Animated.View style={[
                    styles.absoluteButtons,
                    {
                        transform: [{
                            translateX: this.state.showButtons
                        }]
                    }
                ]}>
                    <View style={styles.buttonBackground} />
                    <Button style={styles.buttonContainer} onPress={this.like}>
                        <FontAwesomeIcon icon={this.props.likedPost.includes(this.completeUrl) ? faHeart : faEmptyHeart} size={30} color={colors.white} />
                    </Button>
                    <Button style={styles.buttonContainer} onPress={this.onDownloadPress}>
                        <FontAwesomeIcon icon={this.state.saved ? faCheck : faCloudDownloadAlt} size={this.state.saved ? 25 : 30} color={colors.white} />
                    </Button>
                </Animated.View>
            </Button>
        )
    }
}

const mapStateToProps = state => {
    return {
        likedPost: state.feed.likedPost.map(post => post.imageUrl) || []
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadFeedPost: (url) => dispatch(loadFeedPost(url)),
        like: (url) => dispatch(like_post(url)),
        unlike: (url) => dispatch(unlike_post(url)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedItemContainer);

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    absoluteButtons: {
        position: 'absolute',
        right: 0,
        bottom: Dimensions.get('screen').height * 0.44
    },
    buttonContainer: {
        width: Dimensions.get('screen').height * 0.07 + 5,
        height: Dimensions.get('screen').height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5
    },
    buttonBackground: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(33,33,33,0.7)',
        position: 'absolute',
        borderTopLeftRadius: Dimensions.get('screen').height * 0.035,
        borderBottomLeftRadius: Dimensions.get('screen').height * 0.035,
        borderWidth: 1,
        borderColor: colors.darkLayout9,
        borderRightWidth: 0,
        paddingLeft: 5
    }
})