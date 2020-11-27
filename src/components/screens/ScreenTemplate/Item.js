import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

class Item extends React.PureComponent {

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
)(Item);

const styles = StyleSheet.create({
    container: {
    }
})