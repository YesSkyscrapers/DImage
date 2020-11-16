import React from 'react';
import LoadingComponent from './LoadingComponent';
import { connect } from 'react-redux';
import moment from 'moment'
import { Actions } from 'react-native-js-navigator';
import { checkProxy } from '../../../store/actions/appActions';

class LoadingContainer extends React.PureComponent {

    state = {

    }

    componentDidMount() {
        this.props.checkProxy().then(() => {
            Actions.push("main", {}, { withoutAnimation: true })
        })
    }


    render() {
        return (
            <LoadingComponent
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
        checkProxy: () => dispatch(checkProxy()),

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoadingContainer);