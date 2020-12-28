import React from 'react';
import SearchComponent from './SearchComponent';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { togglePopUp } from 'react-native-js-popup'
import { POPUPS } from '../../../store/constants/appConstants';
import { getHtmlFromUrl, mergeActiveUrlAndSubUrl } from '../../../tools/parsers/tools'
import mangachanParser from '../../../tools/parsers/mangachanParser'

const BASE_URL = 'https://manga-chan.me/'
const CATALOG_PATH = 'catalog/'
const TAGS_PATH = 'tags/'

class SearchContainer extends React.PureComponent {

    state = {
        isLoading: true,
        showFilter: true,
        isSearchFieldActive: false,
        isSearchFocused: false,
        searchFieldValue: '',
        activeUrl: '',
    }

    componentDidMount() {

    }

    onFilterPress = () => {
        this.props.toggleTabBar(false)
        togglePopUp(POPUPS.SEARCH_FILTER, true)
    }

    onPopUpClose = () => {
        this.props.toggleTabBar(true)
        togglePopUp(POPUPS.SEARCH_FILTER, false)
    }

    onUrlChange = (url) => {
        if (this.state.activeUrl != url) {
            this.setState({
                activeUrl: url
            })
        }
        if (this.state.isLoading) {
            this.setState({ isLoading: false })
        }
    }

    onSearchFieldChange = text => {
        this.setState({
            searchFieldValue: text.trim()
        })

        setTimeout(() => {
            if (text == this.state.searchFieldValue) {
                this.searchByText()
            }
        }, 1500)
    }

    searchByText = () => {
        console.log('search')
    }

    onSearchPress = () => {
        this.setState({
            isSearchFieldActive: true,
            isSearchFocused: true
        }, () => {
            try {
                this.searchFieldRef.focus()
            } catch (err) {
                setTimeout(() => {
                    try {
                        this.searchFieldRef.focus()
                    } catch (err) { }
                }, 1000)
            }
        })
    }

    onSearchFieldEndEditing = () => {
        this.setState({
            isSearchFieldActive: this.state.searchFieldValue.trim().length > 0,
            isSearchFocused: false
        })
    }

    getNewListElements = (page) => {
        return new Promise(resolve => {
            return getHtmlFromUrl(`${this.state.activeUrl}&offset=${page * 20}`).then(html => {
                return mangachanParser.getListElements(html).then(elements => {

                    resolve(elements)
                })
            })
        })
    }

    onMangaSelect = (item) => {
        let mangaUrl = mergeActiveUrlAndSubUrl(this.state.activeUrl, item.url)
        this.props.toggleTabBar(false)
        Actions.push("manga", {
            ...item,
            url: mangaUrl
        })
    }


    render() {
        return (
            <SearchComponent
                onFilterPress={this.onFilterPress}
                onPopUpClose={this.onPopUpClose}
                onUrlChange={this.onUrlChange}
                isLoading={this.state.isLoading}
                showFilter={this.state.showFilter}
                isSearchFieldActive={this.state.isSearchFieldActive}
                searchFieldValue={this.state.searchFieldValue}
                onSearchPress={this.onSearchPress}
                onSearchFieldChange={this.onSearchFieldChange}
                onSearchFieldEndEditing={this.onSearchFieldEndEditing}
                isSearchFocused={this.state.isSearchFocused}
                setSearchFieldRef={ref => this.searchFieldRef = ref}
                getNewListElements={this.getNewListElements}
                activeUrl={this.state.activeUrl}
                onMangaSelect={this.onMangaSelect}
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
)(SearchContainer);