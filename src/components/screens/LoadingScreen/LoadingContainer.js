import React from 'react';
import LoadingComponent from './LoadingComponent';
import { connect } from 'react-redux';
import moment from 'moment'
import { Actions } from 'react-native-router-flux';
import { checkProxy, initCrashlytics } from '../../../store/actions/appActions';

class LoadingContainer extends React.PureComponent {

    state = {

    }

    componentDidMount() {
        console.log('started')
        this.props.initCrashlytics().then(() => {
            console.log('crashlytics inited')
            this.props.checkProxy().then(() => {
                console.log('proxy checked')
                Actions.push("main", {}, { withoutAnimation: true })
            })
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
        initCrashlytics: () => dispatch(initCrashlytics()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoadingContainer);