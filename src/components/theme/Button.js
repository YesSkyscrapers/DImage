import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import style from './style';

const BUTTON_CLICK_DELAY = 300;

export default class Button extends React.PureComponent {

    allowClick = true;

    onPress = (...params) => {
        if (this.props.onPress && this.allowClick) {
            this.allowClick = false;

            this.props.onPress(...params);

            setTimeout(() => {
                this.allowClick = true
            }, BUTTON_CLICK_DELAY)
        }
    }

    render() {
        return (
            <TouchableOpacity
                {...this.props}
                onPress={this.onPress}
                style={[style.blueButton, this.props.style]}
            >
                {this.props.children}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
})