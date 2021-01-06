import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import { add_nsfw_tag, remove_nsfw_tag } from '../../../store/actionCreators/feedActionCreators';
import Button from '../../theme/Button';
import colors from '../../theme/colors';

class NsfwListItem extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
        }

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onPress = () => {
        if (this.props.nsfwTags.includes(this.props.tag)) {
            this.props.removeNsfwTag(this.props.tag)
        } else {
            this.props.addNsfwTag(this.props.tag)
        }
    }

    render() {
        return (
            <Button onPress={this.onPress} style={[styles.container, this.props.nsfwTags.includes(this.props.tag) ? styles.disabled : {}]}>
                <Text style={styles.tag}>{this.props.tag}</Text>
            </Button>
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
        addNsfwTag: tag => dispatch(add_nsfw_tag(tag)),
        removeNsfwTag: tag => dispatch(remove_nsfw_tag(tag))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NsfwListItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 5,
        paddingHorizontal: 16,
        backgroundColor: colors.black,
    },
    disabled: {
        backgroundColor: colors.darkLayout8
    },
    tag: {
        color: colors.white,
        fontSize: 17
    }
})