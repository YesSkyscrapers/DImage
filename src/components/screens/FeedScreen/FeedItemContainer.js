import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { loadFeedPost } from '../../../store/actions/feedActions';
import { preload } from 'react-native-cache-control-image'
import { connect } from 'react-redux';
import Image from '../../theme/Image';
import colors from '../../theme/colors';
import Button from '../../theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const ANIMATION_MAX = 200;

class FeedItemContainer extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
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
        this.props.onDownloadPress(this.completeUrl ? this.completeUrl : this.props.item)
    }

    onCompleteUrlReceived = url => {
        this.completeUrl = url
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
                    <Button style={styles.buttonContainer} onPress={this.onDownloadPress}>
                        <FontAwesomeIcon icon={faDownload} size={30} color={colors.white09} />
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
        bottom: Dimensions.get('screen').height * 0.33
    },
    buttonContainer: {
        width: Dimensions.get('screen').height * 0.07,
        height: Dimensions.get('screen').height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    }
})