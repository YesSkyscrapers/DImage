import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    RefreshControl
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from '../../theme/Button';
import SafeArea from '../../theme/SafeArea';
import colors from '../../theme/colors';
import FeedItem from './FeedItem'
import List from '../../theme/List';
import FeedStubItem from './FeedStubItem';
import FeedItemContainer from './FeedItemContainer';

const MAX_PRELOAD_IMAGES_COUNT = 3;
const MIN_PRELOAD_IMAGES_COUNT = 1;
const UNLOAD_IMAGES_COUNT = 3;

const checkIfImageShow = (index, currentPage) => {
    let maxIndex = MIN_PRELOAD_IMAGES_COUNT + currentPage;
    maxIndex = maxIndex > MAX_PRELOAD_IMAGES_COUNT ? MAX_PRELOAD_IMAGES_COUNT : maxIndex
    let minIndex = currentPage - UNLOAD_IMAGES_COUNT
    maxIndex = currentPage + maxIndex
    var list = [];
    for (var i = minIndex; i <= maxIndex; i++) {
        list.push(i);
    }
    return list.includes(index)
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
    onDownloadPress,
    showButtons,
}) => {


    return (
        <View style={styles.dimensionContainer}>
            {
                isLoading ? (
                    <CenteredLoader />
                ) :
                    (
                        <List
                            disableIntervalMomentum={true}
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
                                <FeedItemContainer
                                    item={item}
                                    onPress={onScreenTap}
                                    showButtons={showButtons}
                                    onDownloadPress={onDownloadPress}
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
                                </FeedItemContainer>
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