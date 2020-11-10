import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { Actions } from 'react-native-js-navigator';
import Button from '../../theme/Button';
import SafeArea from '../../theme/SafeArea';
import PopUp from 'react-native-js-popup'
import FilterPopUp from './FilterPopUp'
import { POPUPS } from '../../../store/constants/appConstants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import colors from '../../theme/colors';
import List from '../../theme/List';
import SearchItem from './SearchItem';
import style from '../../theme/style';



export default SearchComponent = ({
    onFilterPress,
    onPopUpClose,
    onUrlChange,
    isLoading,
    showFilter,
    isSearchFieldActive,
    searchFieldValue,
    onSearchPress,
    onSearchFieldChange,
    onSearchFieldEndEditing,
    isSearchFocused,
    setSearchFieldRef,
    getNewListElements,
    activeUrl,
    onMangaSelect,
}) => {
    return (
        <PopUp
            containerStyle={styles.popupStyleFix}
            onClose={onPopUpClose}
            theme="popup"
            name={POPUPS.SEARCH_FILTER}
            backgroundSwipeable
            popUpContent={<FilterPopUp
                onClose={onPopUpClose}
                onUrlChange={onUrlChange}
            />}>
            <SafeArea
                safeStyle={styles.safeContainer}
                style={styles.container}
            >
                <View style={styles.flexContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.searchFieldContainer}>
                            {
                                isSearchFieldActive ? (
                                    <TextInput
                                        ref={setSearchFieldRef}
                                        multiline={false}
                                        numberOfLines={1}
                                        selectionColor={'white'}
                                        placeholder="Название, автор, серия..."
                                        placeholderTextColor={'rgba(255,255,255,0.8)'}
                                        value={searchFieldValue}
                                        onChangeText={onSearchFieldChange}
                                        onEndEditing={onSearchFieldEndEditing}
                                        style={[styles.searchField, isSearchFocused ? styles.activeSearchField : {}]}
                                    />
                                ) : (
                                        <Text numberOfLines={1} style={styles.searchField}>{searchFieldValue.trim().length == 0 ? "MangaChan" : searchFieldValue}</Text>
                                    )
                            }
                        </View>
                        <Button
                            onPress={onSearchPress}
                            style={styles.searchButton}
                        >
                            <FontAwesomeIcon icon={faSearch} size={18} color={'white'} />
                        </Button>
                    </View>
                    <View style={styles.flexContainer}>
                        {
                            isLoading ? (
                                <ActivityIndicator size="large" />
                            ) : (
                                    <List
                                        keyExtractor={(item) => item.name}
                                        contentContainerStyle={styles.listContainer}
                                        numColumns={2}
                                        horizontal={false}
                                        listIdentifier={activeUrl}
                                        getNewElements={getNewListElements}
                                        renderItem={({ item, index }) => <SearchItem
                                            item={item}
                                            index={index}
                                            onPress={onMangaSelect}
                                        />}
                                    />
                                )
                        }
                    </View>
                    {
                        showFilter && (
                            <Button style={styles.filterButton} onPress={onFilterPress}>
                                <FontAwesomeIcon size={20} icon={faFilter} color="white" />
                            </Button>
                        )
                    }
                </View>
            </SafeArea>
        </PopUp>
    )
}

const styles = StyleSheet.create({
    popupStyleFix: {
        paddingVertical: 0,
        paddingTop: 10
    },
    filterButton: {
        position: 'absolute',
        right: 26,
        bottom: 26,
        width: 50,
        height: 50,
        backgroundColor: colors.faIconBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    flexContainer: {
        flex: 1,
    },
    headerContainer: {
        ...style.header,
        alignItems: 'flex-end',
    },
    safeContainer: {
        backgroundColor: colors.faIconBlue
    },
    container: {
        backgroundColor: 'white'
    },
    searchField: {
        flex: 1,
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        paddingVertical: 8,
        alignContent: 'center'
    },
    searchButton: {
        padding: 8,
    },
    searchFieldContainer: {
        flexDirection: 'row',
        flex: 1
    },
    activeSearchField: {
        fontWeight: 'normal'
    },
    listContainer: {
        marginHorizontal: 8,
        marginVertical: 8
    }
})