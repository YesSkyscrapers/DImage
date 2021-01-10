import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { loadFeedPost } from '../../../store/actions/feedActions';
import { connect } from 'react-redux';
import Image from '../../theme/Image';
import colors from '../../theme/colors';
import Button from '../../theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faHeart, faCheckSquare, faClipboardCheck, faCloudDownloadAlt, faDownload, faFileDownload, faSpellCheck, faArrowLeft, faStream, faTags } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons';
import { unlike_post, like_post } from '../../../store/actionCreators/feedActionCreators';
import SafeArea from '../../theme/SafeArea';
import moment from 'moment'
import { Actions } from 'react-native-router-flux';

const ANIMATION_MAX = 200;
const SAVING_STATES = {
    NOT_SAVED: 0,
    SAVING: 1,
    SAVED: 2
}

class LikeUI extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            likeAnimations: [],
            saved: SAVING_STATES.NOT_SAVED,
            showButtons: new Animated.Value(props.showButtons ? 0 : ANIMATION_MAX),
        }


        this.lastClickTime = undefined;
        this.lastClickTimeout = undefined;
        this.likeAnimationId = 0;
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
        if (SAVING_STATES.SAVING == this.state.saved) {
            return;
        }
        this.setState({
            saved: SAVING_STATES.SAVING
        })
        this.props.onDownloadPress(this.props.item).then(() => {
            this.setState({
                saved: SAVING_STATES.SAVED
            })
        }).catch(err => {
            this.setState({
                saved: SAVING_STATES.NOT_SAVED
            })
        })
    }

    like = (strict = false) => {
        const likeObject = {
            ...this.props.item,
        }
        if (this.props.likedPost.includes(this.props.item.imageUrl)) {
            if (!strict) {
                this.props.unlike(likeObject)
            }
        } else {
            this.props.like(likeObject)
        }
    }

    getImageFromState = state => {
        switch (state) {
            case SAVING_STATES.NOT_SAVED: {
                return faCloudDownloadAlt;
            }
            case SAVING_STATES.SAVING: {
                return faStream;
            }
            case SAVING_STATES.SAVED: {
                return faCheck;
            }
        }
    }

    getSizeFromState = state => {
        switch (state) {
            case SAVING_STATES.NOT_SAVED: {
                return 30;
            }
            case SAVING_STATES.SAVING: {
                return 25;
            }
            case SAVING_STATES.SAVED: {
                return 25;
            }
        }
    }

    onPress = event => {
        this.props.onPress(event)
        // const likePos = {
        //     x: event.nativeEvent.pageX,
        //     y: event.nativeEvent.pageY
        // }

        // console.log(likePos, this.lastClickTime)
        // if (this.lastClickTime) {
        //     clearTimeout(this.lastClickTimeout)
        //     this.lastClickTime = undefined;
        //     this.runLikeAnimation(likePos)
        //     this.like(true);
        // } else {
        //     this.lastClickTime = moment();

        //     console.log('settimeout')
        //     this.lastClickTimeout = setTimeout(() => {
        //         console.log('triggered')
        //         this.lastClickTime = undefined;

        //     }, 600);
        // }
    }

    //unused
    runLikeAnimation = likePos => {
        let animation = new Animated.Value(0)
        let likeAnimation = {
            id: this.likeAnimationId++,
            value: animation,
            randomValue: Math.random(),
            x: likePos.x + (Math.random() - 0.5) * 40,
            y: likePos.y + (Math.random() - 0.5) * 40,
        }

        this.setState({
            likeAnimations: this.state.likeAnimations.concat([likeAnimation])
        }, () => {
            Animated.timing(animation, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
            }).start(() => {
                this.setState({
                    likeAnimations: this.state.likeAnimations.filter(anim => anim != likeAnimation)
                })
            })
        })
    }

    onTagsPress = () => {
        Actions.push("nsfwList", {
            customTags: this.props.item.tags.artist.concat(this.props.item.tags.copyrights, this.props.item.tags.characters, this.props.item.tags.general, this.props.item.tags.meta)
        });
    }


    render() {
        return (
            <Button
                activeOpacity={1}
                onPress={this.onPress}
                style={styles.dimensionsContainer}
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
                    <Button style={styles.buttonContainer} onPress={() => this.like()}>
                        <FontAwesomeIcon icon={this.props.likedPost.includes(this.props.item.imageUrl) ? faHeart : faEmptyHeart} size={30} color={colors.white} />
                    </Button>
                    <Button style={styles.buttonContainer} onPress={this.onDownloadPress}>
                        <FontAwesomeIcon icon={this.getImageFromState(this.state.saved)} size={this.getSizeFromState(this.state.saved)} color={colors.white} />
                    </Button>
                </Animated.View>
            </Button>
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
    dimensionsContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    absoluteButtons: {
        position: 'absolute',
        right: 0,
        bottom: Dimensions.get('screen').height * 0.40
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