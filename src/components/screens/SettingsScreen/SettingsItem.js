import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

class SettingsItem extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
        }

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={styles.container}>

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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsItem);

const styles = StyleSheet.create({
    container: {
    }
})