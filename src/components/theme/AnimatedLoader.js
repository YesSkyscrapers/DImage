import React from 'react';
import { StyleSheet, Image as DefaultImage, Easing, View, Text, Animated } from 'react-native';
import style from './style';
import PercentageCircle from 'react-native-percentage-circle';

export default class AnimatedLoader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            animation: new Animated.Value(0)
        }
        this.stopAnimation = false;
    }



    componentDidMount() {
        this.animate()
    }

    componentWillUnmount() {
        this.stopAnimation = true;
    }

    animate = () => {
        Animated.timing(
            this.state.animation,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => {
            if (!this.stopAnimation) {
                this.setState({
                    animation: new Animated.Value(0)
                }, () => {
                    if (!this.stopAnimation) {
                        this.animate()
                    }
                })
            }
        })
    }

    render() {
        const rotationAnimation = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <Animated.View style={[styles.centerView, {
                transform: [{
                    rotate: rotationAnimation
                }]
            }]}>
                <PercentageCircle
                    radius={35}
                    percent={((this.props.percent && this.props.percent > 0.05) ? this.props.percent : 0.05) * 100}
                    color={"#3498db"}
                    bgcolor="transparent"
                    innerColor="white"
                    borderWidth={5}
                ><Text>{null}</Text></PercentageCircle>
            </Animated.View>
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
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20
    }
})