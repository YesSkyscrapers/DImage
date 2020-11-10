import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import mangachanParser from '../../../tools/parsers/mangachanParser'
import Button from '../../theme/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRedo, faTimes, faArrowUp, faArrowDown, faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import colors from '../../theme/colors';
import { SORT_TYPES, TAGS_STATUS } from '../../../store/constants/searchConstants';
import { getHtmlFromUrl } from '../../../tools/parsers/tools'

const FILTER_POPUP_MAX_HEIGHT = Dimensions.get('screen').height * 2 / 3;
const parserMapping = {
    "sortTypes": mangachanParser.getSortList,
    "tags": mangachanParser.getTagsList,
    "status": mangachanParser.getStatuseslist
}

const BASE_URL = 'https://manga-chan.me/'
const CATALOG_PATH = 'catalog/'
const TAGS_PATH = 'tags/'

export default class FilterPopUp extends React.PureComponent {

    state = {
        sortTypes: {
            isLoading: true,
            list: [],
            activeIndex: 0,
            defaultActiveIndex: 0,
            activeSort: null
        },
        tags: {
            isLoading: true,
            list: [],
            activeIndex: [],
            defaultActiveIndex: [],
        },
        status: {
            isLoading: true,
            list: [],
            activeIndex: 0,
            defaultActiveIndex: 0,
        }
    }



    parseElements = (element, html) => {
        return new Promise(resolve => {
            return parserMapping[element](html).then(result => {
                this.setState({
                    [element]: {
                        isLoading: false,
                        list: result.list,
                        activeIndex: result.activeIndex,
                        defaultActiveIndex: result.activeIndex,
                        activeSort: result.activeSort
                    }
                }, () => {
                    resolve();
                })
            })
        })
    }

    componentDidMount() {
        getHtmlFromUrl(`${BASE_URL}${CATALOG_PATH}`).then(html => {
            Promise.all([
                this.parseElements("status", html),
                this.parseElements("tags", html).then(() => {
                    if (this.state.tags.list.length > 0) {
                        return getHtmlFromUrl(`${BASE_URL}${TAGS_PATH}${this.state.tags.list[0].codeName}`).then(htmlForStatus => {
                            return this.parseElements("sortTypes", htmlForStatus)
                        })
                    }
                })
            ]).then(() => {
                this.onUrlChange();
            })
        })
    }

    onUrlChange = () => {
        let baseUrl = BASE_URL
        let tagsSubUrl = this.state.tags.activeIndex.length == 0 ? CATALOG_PATH : TAGS_PATH;
        let statusUrl = this.state.status.list[this.state.status.activeIndex].path
        let tagsUrlEnd = ''

        if (this.state.tags.activeIndex.length == 1) {
            tagsUrlEnd = `${this.state.tags.activeIndex[0].status == TAGS_STATUS.EXCLUDE ? '-' : ''}${this.state.tags.list[this.state.tags.activeIndex[0].index].codeName}`
        } else if (this.state.tags.activeIndex.length == 2) {
            let firstTagUrlEnd = `${this.state.tags.activeIndex[0].status == TAGS_STATUS.EXCLUDE ? '-' : ''}${this.state.tags.list[this.state.tags.activeIndex[0].index].codeName}`
            let secondTagUrlEnd = `${this.state.tags.activeIndex[1].status == TAGS_STATUS.EXCLUDE ? '-' : '+'}${this.state.tags.list[this.state.tags.activeIndex[1].index].codeName}`
            tagsUrlEnd = firstTagUrlEnd + secondTagUrlEnd;
        }

        let sortEnd = `?n=${this.state.sortTypes.list[this.state.sortTypes.activeIndex].param}${this.state.sortTypes.activeSort}`

        let urlWithoutParams = `${baseUrl}${tagsSubUrl}${statusUrl}${tagsUrlEnd}`
        let url = `${urlWithoutParams[urlWithoutParams.length - 1] == '/' ? urlWithoutParams.slice(0, -1) : urlWithoutParams}${sortEnd}`
        this.props.onUrlChange(url)
    }

    onClosePress = () => {
        this.props.onClose()
    }

    onResetFilter = () => {
        this.setState({
            sortTypes: {
                ...this.state.sortTypes,
                activeIndex: this.state.sortTypes.defaultActiveIndex,
                activeSort: this.state.sortTypes.list[this.state.sortTypes.defaultActiveIndex].mainSort
            },
            status: {
                ...this.state.status,
                activeIndex: this.state.status.defaultActiveIndex
            },
            tags: {
                ...this.state.tags,
                activeIndex: this.state.tags.defaultActiveIndex
            },
        }, () => {
            this.onUrlChange()
        })
    }

    onSortPress = (sortType) => {
        let index = this.state.sortTypes.list.indexOf(sortType);
        if (this.state.sortTypes.activeIndex == index) {
            this.setState({
                sortTypes: {
                    ...this.state.sortTypes,
                    activeSort: SORT_TYPES.DESC == this.state.sortTypes.activeSort ? SORT_TYPES.ASC : SORT_TYPES.DESC
                }
            }, () => {
                this.onUrlChange()
            })
        } else {
            this.setState({
                sortTypes: {
                    ...this.state.sortTypes,
                    activeIndex: index,
                    activeSort: this.state.sortTypes.list[index].mainSort
                }
            }, () => {
                this.onUrlChange()
            })
        }

    }

    onStatusPress = (status) => {
        let index = this.state.status.list.indexOf(status);
        this.setState({
            status: {
                ...this.state.status,
                activeIndex: index,
            }
        }, () => {
            this.onUrlChange()
        })
    }

    onTagPress = (tag) => {
        let index = this.state.tags.list.indexOf(tag);
        if (this.state.tags.activeIndex.map(activeIndexObject => activeIndexObject.index).includes(index)) {
            let selectedIndexObject = this.state.tags.activeIndex.filter(activeIndexObject => activeIndexObject.index == index)[0]
            if (selectedIndexObject.status == TAGS_STATUS.INCLUDE) {
                selectedIndexObject.status = TAGS_STATUS.EXCLUDE
                this.setState({
                    tags: {
                        ...this.state.tags,
                        activeIndex: this.state.tags.activeIndex
                    }
                }, () => {
                    this.onUrlChange()
                })
            } else {
                this.setState({
                    tags: {
                        ...this.state.tags,
                        activeIndex: this.state.tags.activeIndex.filter(e => e.index != index),
                    }
                }, () => {
                    this.onUrlChange()
                })
            }
        } else {
            this.setState({
                tags: {
                    ...this.state.tags,
                    activeIndex: this.state.tags.activeIndex.concat([{ index, status: TAGS_STATUS.INCLUDE }]),
                }
            }, () => {
                this.onUrlChange()
            })
        }
    }

    render() {
        return (
            <View style={{
                maxHeight: FILTER_POPUP_MAX_HEIGHT,
            }}>
                <View style={styles.buttonsContainer}>
                    <Button style={styles.button} onPress={this.onClosePress}>
                        <FontAwesomeIcon color={colors.faIconBlue} size={25} icon={faTimes} />
                    </Button>
                    <Button style={styles.button} onPress={this.onResetFilter}>
                        <FontAwesomeIcon color={colors.faIconBlue} size={20} icon={faRedo} />
                    </Button>
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.blockContainer}>
                        <Text style={styles.rowTitle}>Сортировка</Text>
                        <View>
                            {
                                this.state.sortTypes.isLoading ? (
                                    <ActivityIndicator size="large" />
                                ) : (
                                        <View>
                                            {
                                                this.state.sortTypes.list.map((sortType, index) => (
                                                    <Button onPress={() => this.onSortPress(sortType)} style={styles.row} key={index}>
                                                        <Text style={styles.rowName}>{sortType.name}</Text>
                                                        {
                                                            index == this.state.sortTypes.activeIndex ? (
                                                                <FontAwesomeIcon
                                                                    size={18}
                                                                    icon={this.state.sortTypes.activeSort == sortType.mainSort ? faArrowDown : faArrowUp}
                                                                    color={colors.faIconBlue}
                                                                />
                                                            ) : null
                                                        }
                                                    </Button>
                                                ))
                                            }
                                        </View>
                                    )
                            }
                        </View>
                    </View>

                    <View style={styles.blockContainer}>
                        <Text style={styles.rowTitle}>Статус</Text>
                        <View>
                            {
                                this.state.status.isLoading ? (
                                    <ActivityIndicator size="large" />
                                ) : (
                                        <View>
                                            {
                                                this.state.status.list.map((statusType, index) => (
                                                    <Button onPress={() => this.onStatusPress(statusType)} style={styles.row} key={index}>
                                                        <Text style={styles.rowName}>{statusType.name}</Text>
                                                        {
                                                            index == this.state.status.activeIndex ? (
                                                                <FontAwesomeIcon
                                                                    size={18}
                                                                    icon={faCheck}
                                                                    color={colors.faIconBlue}
                                                                />
                                                            ) : null
                                                        }
                                                    </Button>
                                                ))
                                            }
                                        </View>
                                    )
                            }
                        </View>
                    </View>

                    <View style={styles.blockContainer}>
                        <Text style={styles.rowTitle}>Тэги</Text>
                        <View>
                            {
                                this.state.tags.isLoading ? (
                                    <ActivityIndicator size="large" />
                                ) : (
                                        <View>
                                            {
                                                this.state.tags.list.map((tag, index) => (
                                                    <Button
                                                        disabled={this.state.tags.activeIndex.length >= 2 && !this.state.tags.activeIndex.map(e => e.index).includes(index)}
                                                        onPress={() => this.onTagPress(tag)}
                                                        style={styles.row} key={index}>
                                                        <Text style={[styles.rowName, this.state.tags.activeIndex.length >= 2 && !this.state.tags.activeIndex.map(e => e.index).includes(index) ? styles.disabledRowText : {}]}>{tag.name}</Text>
                                                        {
                                                            this.state.tags.activeIndex.map(activeIndexObject => (
                                                                <View key={activeIndexObject.index}>
                                                                    {
                                                                        activeIndexObject.index == index ? (
                                                                            <FontAwesomeIcon
                                                                                size={activeIndexObject.status == TAGS_STATUS.INCLUDE ? 18 : 20}
                                                                                icon={activeIndexObject.status == TAGS_STATUS.INCLUDE ? faCheck : faTimes}
                                                                                color={colors.faIconBlue}
                                                                            />
                                                                        ) : null
                                                                    }
                                                                </View>
                                                            ))
                                                        }
                                                    </Button>
                                                ))
                                            }
                                        </View>
                                    )
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    button: {
        width: 46,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 2
    },
    rowTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginBottom: 8
    },
    rowName: {
        fontSize: 18,
        flex: 1,
    },
    disabledRowText: {
        color: 'rgba(0, 0, 0, 0.5)'
    },
    blockContainer: {
        marginBottom: 16,
    }
})