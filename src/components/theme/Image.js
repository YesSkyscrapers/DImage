import React from 'react';
import { StyleSheet, Image as DefaultImage, View, Text, Animated, ActivityIndicator } from 'react-native';
import style from './style';
import PercentageCircle from 'react-native-percentage-circle';
import AnimatedLoader from './AnimatedLoader';
import { default as NewImage } from 'react-native-cache-control-image'

export default class Image extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showLoader: true,
        }
    }


    componentDidMount() {
    }



    onLoadEnd = () => {
        this.setState({
            showLoader: false
        })
    }


    render() {
        return (
            <View style={this.props.style}>
                <NewImage
                    style={this.props.style}
                    url={this.props.url}
                    resizeMode={this.props.resizeMode}
                    onLoadEnd={this.onLoadEnd}
                />
                {
                    (this.state.showLoader) && (
                        <View style={styles.centerView}>
                            <ActivityIndicator
                                size={this.props.loaderSize || "small"}
                            />
                        </View>
                    )
                }
            </View>
        )
    }
}

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