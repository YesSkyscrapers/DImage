import React from 'react';
import NewMangaReaderComponent from './NewMangaReaderComponent';
import { Actions } from 'react-native-js-navigator';
import { connect } from 'react-redux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { getHtmlFromUrl, mergeActiveUrlAndSubUrl } from '../../../tools/parsers/tools';
import mangachanParser from '../../../tools/parsers/mangachanParser'
import { CHAPTER_STATE } from '../../../store/constants/readerConstants';
import { Dimensions } from 'react-native';
import Image from '../../theme/Image'
import { getWaitPromise } from '../../../tools/tools'


class NewMangaReaderContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            chapters: props.chapters,
            activePage: props.activeChapterIndex,
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    onBack = () => {
        Actions.pop();
        this.props.toggleTabBar(true)
    }

    render() {
        return (
            <NewMangaReaderComponent
                onBack={this.onBack}
                chapters={this.state.chapters}
                activePage={this.state.activePage}
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
        toggleTabBar: (state) => dispatch(toggle_tabbar_visibility(state))

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NewMangaReaderContainer);