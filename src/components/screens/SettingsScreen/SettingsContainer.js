import React from 'react';
import SettingsComponent from './SettingsComponent';
import { connect } from 'react-redux';
import { switch_nsfw_filter } from '../../../store/actionCreators/feedActionCreators';
import { Actions } from 'react-native-router-flux';
import { Linking } from 'react-native';
import eventsService from '../../../tools/eventsService';
import { FEED_DROP_EVENT } from '../../../store/constants/feedConstants';

class SettingsContainer extends React.PureComponent {

    state = {

    }


    componentDidMount() {

    }

    onBackButtonPress = () => {
        Actions.pop()
    }

    onSwitchNsfwFilter = () => {
        this.props.switchNsfwFilter()
        eventsService.callEvent(FEED_DROP_EVENT)
    }

    onFeedBack = () => {
        Linking.openURL("mailto:yes.skyscrapers@gmail.com?subject=DImageFeedback")
    }

    render() {
        return (
            <SettingsComponent
                onBackButtonPress={this.onBackButtonPress}
                useNsfwFilter={this.props.useNsfwFilter}
                onSwitchNsfwFilter={this.onSwitchNsfwFilter}
                onFeedBack={this.onFeedBack}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        useNsfwFilter: state.feed.useNsfwFilter
    };
};

const mapDispatchToProps = dispatch => {
    return {
        switchNsfwFilter: () => dispatch(switch_nsfw_filter())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsContainer);