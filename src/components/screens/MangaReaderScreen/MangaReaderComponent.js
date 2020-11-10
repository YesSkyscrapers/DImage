import { faArrowLeft, faDownload, faHeart, faSortNumericDown, faSortNumericUp } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import SafeArea from '../../theme/SafeArea';
import style from '../../theme/style';
import Image from '../../theme/Image'
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { CHAPTER_STATE } from '../../../store/constants/readerConstants';

const getDimensionContainerStyle = (widthScale = 1) => {
    return {
        width: Dimensions.get('screen').width * (widthScale == 0 ? 1 : widthScale),
        height: Dimensions.get('screen').height
    }
}



export default MangaReaderComponent = ({
    onBack,
    chapters,
    onScroll,
    setRef,
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollEnd,
    currentPage,
    currentChapterIndex,
    allowedPages,
}) => {


    return (
        <View
            style={styles.flexContainer}>
            <ScrollView
                scrollEventThrottle={32}
                alwaysBounceHorizontal={false}
                ref={setRef}
                onScroll={onScroll}
                horizontal={true}
                decelerationRate={"fast"}
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                snapToInterval={Dimensions.get('screen').width}
                contentContainerStyle={styles.scrollContainer}>
                {
                    chapters.map((chapter, chapterIndex) => (
                        chapter.state == CHAPTER_STATE.NOT_SHOW ? null : (
                            chapter.state == CHAPTER_STATE.LOADING ? (
                                <View style={{ ...getDimensionContainerStyle(), }} />
                            ) : (
                                    chapter.images.map((image, imageIndex) => {
                                        const uniqueKey = `${chapterIndex}:${imageIndex}`


                                        return (
                                            <View key={uniqueKey} style={{ ...getDimensionContainerStyle(), }} >
                                                {
                                                    (allowedPages.includes(uniqueKey)) && (
                                                        <Image kaey={uniqueKey} url={image} style={{
                                                            ...getDimensionContainerStyle()
                                                        }}
                                                            resizeMode="contain"
                                                        />
                                                    )
                                                }
                                            </View>
                                        )
                                    })
                                )
                        )
                    ))
                }
            </ScrollView>
            <SafeArea safeStyle={styles.safeContainer}>
                <View style={styles.headerContainer}>
                    <Button onPress={onBack} style={styles.headerButton}>
                        <FontAwesomeIcon icon={faArrowLeft} size={18} color="white" />
                    </Button>
                </View>
            </SafeArea>
        </View>

    )
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
    },
    safeContainer: {
        backgroundColor: colors.faIconBlue,
        position: 'absolute',
        left: 0,
        right: 0
    },
    container: {
        backgroundColor: 'white'
    },
    headerContainer: {
        ...style.header,
        backgroundColor: 'transparent',
        justifyContent: 'space-between'
    },
    headerButton: {
        padding: 8,
    },
    scrollContainer: {
        flexGrow: 1
    },
    mangaDescriptionContainer: {

    },
    backgroundImageOverflow: {
        ...style.backgroundImage,
    },
    mangaDescriptionContentContainer: {
        padding: 16,
        flexDirection: 'row',
        paddingBottom: 40
    },
    image: {
        left: -5,
        right: -5,
        top: -5,
        bottom: -5
    },
    imageContainer: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginRight: 10
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 16,
        paddingTop: 4,
    },
    centeringContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    subDescriptionContainer: {

    },
    mangaDescriptionFieldTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mangaDescriptionFieldTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    likeButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -6
    },
    allContentContainer: {
        marginHorizontal: 16,
    },
    text: {
        fontSize: 17,
        marginBottom: 16
    },
    chapterRow: {
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    chaptersOutfit: {
        marginHorizontal: -16
    },
    chapterDate: {
        fontSize: 14
    },
    chapterName: {
        fontSize: 16,
        marginBottom: 4
    },
    imagesContainer: {
        flex: 1,
        flexDirection: 'row'
    },
})