import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { loadFeedPost } from '../../../store/actions/feedActions';
import { connect } from 'react-redux';
import Image from '../../theme/Image';
import colors from '../../theme/colors';
import Button from '../../theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faHeart, faCheckSquare, faClipboardCheck, faCloudDownloadAlt, faDownload, faFileDownload, faSpellCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons';
import { unlike_post, like_post } from '../../../store/actionCreators/feedActionCreators';
import SafeArea from '../../theme/SafeArea';

const ANIMATION_MAX = 200;

class LikeUI extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            saved: false,
            showButtons: new Animated.Value(props.showButtons ? 0 : ANIMATION_MAX),
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.showButtons != prevProps.showButtons) {
            this.animate(this.props.showButtons)
        }
    }

    animate = (state = false) => {
        const newValue = state ? 0 : ANIMATION_MAX
        Animated.parallel([
            Animated.timing(this.state.showButtons, {
                toValue: newValue,
                duration: 300,
                useNativeDriver: true
            }),
        ]).start()
    }

    onDownloadPress = () => {
        this.props.onDownloadPress(this.props.item).then(() => {
            this.setState({
                saved: true
            })
        })
    }

    like = () => {
        const likeObject = {
            ...this.props.item,
        }
        if (this.props.likedPost.includes(this.props.item.imageUrl)) {
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
                style={styles.container}
            >
                {
                    React.Children.map(this.props.children, child => {
                        return React.cloneElement(child, {
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
                        <FontAwesomeIcon icon={this.props.likedPost.includes(this.props.item.imageUrl) ? faHeart : faEmptyHeart} size={30} color={colors.white} />
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
)(LikeUI);

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
})