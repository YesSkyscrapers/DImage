import React from 'react';
import { StyleSheet, Image as DefaultImage, View, Text, Animated, ActivityIndicator } from 'react-native';
import style from './style';
import PercentageCircle from 'react-native-percentage-circle';
import AnimatedLoader from './AnimatedLoader';
import FastImage from 'react-native-fast-image'
import colors from './colors';
import { PROXY_URL } from '../../tools/fetch';
import { connect } from 'react-redux';

class Image extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showLoader: !!this.props.url,
        }
    }


    componentDidMount() {
    }



    onLoadEnd = () => {
        this.setState({
            showLoader: false
        })
    }

    getResizeMode = () => {
        switch (this.props.resizeMode) {
            case 'cover': {
                return FastImage.resizeMode.cover
            }
            case 'contain': {
                return FastImage.resizeMode.contain
            }
        }
    }


    render() {
        return (
            <View style={this.props.style}>
                <FastImage
                    {
                    ...this.props
                    }
                    style={this.props.style}
                    onLoadEnd={this.onLoadEnd}
                    source={this.props.source ? this.props.source : {
                        uri: this.props.useProxy ? `${PROXY_URL}?url=${this.props.url}` : this.props.url,
                        priority: FastImage.priority.normal,
                        headers: {
                            url: this.props.useProxy ? this.props.url : undefined
                        },
                        cache: FastImage.cacheControl.web
                    }}
                    resizeMode={this.getResizeMode(this.props.resizeMode)}
                />
                {
                    (this.state.showLoader) && (
                        <View style={styles.centerView}>
                            <ActivityIndicator
                                size={this.props.loaderSize || "small"}
                                color={colors.white}
                            />
                        </View>
                    )
                }
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        useProxy: state.app.useProxy
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Image);

const styles = StyleSheet.create({
    centerView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20
    }
})