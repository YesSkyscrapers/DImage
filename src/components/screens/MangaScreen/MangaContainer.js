import React from 'react';
import MangaComponent from './MangaComponent';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { getHtmlFromUrl, mergeActiveUrlAndSubUrl } from '../../../tools/parsers/tools';
import mangachanParser from '../../../tools/parsers/mangachanParser'

class MangaContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            manga: {
                image: this.props.image,
                name: this.props.name,
                url: this.props.url,
                chapters: []
            },
            isLoading: true,
            chaptersSortOrder: 0
        }
    }

    componentDidMount() {
        getHtmlFromUrl(this.state.manga.url).then(html => {
            return Promise.all([
                mangachanParser.getMangaDescription(html).then(manga => {
                    this.setState({
                        manga: {
                            ...this.state.manga,
                            ...manga,
                        },
                    })
                }),
                mangachanParser.getMangaChapters(html).then(chapters => {
                    this.setState({
                        manga: {
                            ...this.state.manga,
                            chapters: chapters.map(chapter => ({ ...chapter, url: mergeActiveUrlAndSubUrl(this.state.manga.url, chapter.url) }))
                        },
                    })
                })
            ]).then(() => {
                this.setState({
                    isLoading: false
                })
            })
        })

    }

    onChapterPress = chapter => {
        Actions.push("newMangaReader", {
            chapters: this.state.manga.chapters,
            activeChapterIndex: this.state.manga.chapters.indexOf(chapter)
        })
    }

    onBack = () => {
        Actions.pop();
        this.props.toggleTabBar(true)
    }

    onChangeSortOrder = () => {
        this.setState({
            chaptersSortOrder: 1 - this.state.chaptersSortOrder
        })
    }

    render() {
        return (
            <MangaComponent
                manga={this.state.manga}
                onBack={this.onBack}
                isLoading={this.state.isLoading}
                chaptersSortOrder={this.state.chaptersSortOrder}
                onChangeSortOrder={this.onChangeSortOrder}
                onChapterPress={this.onChapterPress}
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
)(MangaContainer);