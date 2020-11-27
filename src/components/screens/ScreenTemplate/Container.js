import React from 'react';
import Component from './Component';
import { connect } from 'react-redux';

class Container extends React.PureComponent {

    state = {

    }


    componentDidMount() {

    }


    render() {
        return (
            <Component
            />
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
)(Container);