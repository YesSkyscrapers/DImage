import React from 'react';
import ProfileComponent from './ProfileComponent';
import { connect } from 'react-redux';
import moment from 'moment'

class ProfileContainer extends React.PureComponent {

    state = {

    }


    render() {
        return (
            <ProfileComponent
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
)(ProfileContainer);