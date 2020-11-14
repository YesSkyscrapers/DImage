import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    RefreshControl
} from 'react-native';
import { Actions } from 'react-native-js-navigator';
import Button from '../../theme/Button';
import SafeArea from '../../theme/SafeArea';
import colors from '../../theme/colors';
import FeedItem from './FeedItem'
import List from '../../theme/List';
import FeedStubItem from './FeedStubItem';

const MAX_PRELOAD_IMAGES_COUNT = 10;
const MIN_PRELOAD_IMAGES_COUNT = 3;
const UNLOAD_IMAGES_COUNT = 5;

const checkIfImageShow = (index, currentPage) => {
    let maxIndex = MIN_PRELOAD_IMAGES_COUNT + currentPage;
    maxIndex = maxIndex > MAX_PRELOAD_IMAGES_COUNT ? MAX_PRELOAD_IMAGES_COUNT : maxIndex
    return ((index < currentPage + maxIndex) && (index >= currentPage - UNLOAD_IMAGES_COUNT))
}

const CenteredLoader = () => {
    return (
        <View style={[styles.dimensionContainer, styles.centerContent]}>
            <ActivityIndicator size="large" color={colors.white} />
        </View>
    )
}

export default FeedComponent = ({
    getNewListElements,
    onFeedScroll,
    currentPage,
    isLoading,
    onScreenTap,
    onResult,
    onRefresh,
    feedListIdentifier,
    isRefreshing,
}) => {


    return (
        <View style={styles.dimensionContainer}>
            {
                isLoading ? (
                    <CenteredLoader />
                ) :
                    (
                        <List
                            disableLoader
                            scrollEventThrottle={32}
                            onScroll={onFeedScroll}
                            listIdentifier={feedListIdentifier}
                            keyExtractor={(item) => item}
                            contentContainerStyle={styles.listContainer}
                            horizontal={false}
                            ListEmptyComponent={<CenteredLoader />}
                            getNewElements={getNewListElements}
                            onResult={onResult}
                            decelerationRate={"fast"}
                            snapToInterval={Dimensions.get('screen').height}
                            renderItem={({ item, index }) => (
                                <Button
                                    activeOpacity={1}
                                    onPress={onScreenTap}
                                >
                                    {
                                        checkIfImageShow(index, currentPage) ? (
                                            <FeedItem
                                                item={item}
                                                index={index}
                                            />
                                        ) : (
                                                <FeedStubItem
                                                    item={item}
                                                    index={index}
                                                />
                                            )
                                    }
                                </Button>
                            )}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={onRefresh}
                                    colors={[colors.black]}
                                    tintColor={colors.white09}
                                />
                            }
                        />
                    )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    dimensionContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: colors.black,
    },
    flexContainer: {
        flex: 1,
        backgroundColor: colors.black,
    },
    safeContainer: {
        backgroundColor: colors.black,
    },
    loaderContainer: {
        flex: 1
    },
    container: {
        backgroundColor: 'white',
        backgroundColor: colors.black,
    },
    listContainer: {
        backgroundColor: colors.black,
        flexGrow: 1
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})