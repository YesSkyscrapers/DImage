import React from 'react';
import NsfwListComponent from './NsfwListComponent';
import { connect } from 'react-redux';
import Clipboard from '@react-native-community/clipboard';
import { Actions } from 'react-native-router-flux';

class NsfwListContainer extends React.PureComponent {

    state = {
        tags: []
    }


    componentDidMount() {
        this.setState({
            tags: this.props.customTags ? this.props.customTags : this.props.nsfwTags
        })
    }

    onCopyPress = () => {
        Clipboard.setString(this.props.nsfwTags.join('\n'))
    }

    onBackPress = () => {
        Actions.pop();
    }

    render() {
        return (
            <NsfwListComponent
                tags={this.state.tags}
                onCopyPress={this.onCopyPress}
                onBackPress={this.onBackPress}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        nsfwTags: state.feed.nsfwTags || []
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NsfwListContainer);