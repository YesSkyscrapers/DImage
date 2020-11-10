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



export default MangaComponent = ({
    onBack,
    manga,
    isLoading,
    chaptersSortOrder,
    onChangeSortOrder,
    onChapterPress,
}) => {

    const ITEM_WIDTH = (Dimensions.get('window').width / 2) - 50;
    const ITEM_PROPORTION = 100 / 150;

    return (
        <SafeArea
            safeStyle={styles.safeContainer}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <Button onPress={onBack} style={styles.headerButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={18} color="white" />
                </Button>
                <Button onPress={onBack} style={styles.headerButton}>
                    <FontAwesomeIcon icon={faDownload} size={18} color="white" />
                </Button>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mangaDescriptionContainer}>
                    <View style={[style.backgroundImage, { overflow: 'hidden' }]}>
                        <Image
                            style={style.backgroundImage}
                            url={manga.image}
                            resizeMode="cover"
                        />
                    </View>
                    <LinearGradient
                        locations={[0, 0.7, 1]}
                        colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,1)']}
                        style={styles.backgroundImageOverflow}
                    />
                    <View style={styles.backgroundImageOverflow} />
                    <View style={styles.mangaDescriptionContentContainer}>
                        <View style={[
                            styles.imageContainer,
                            {
                                width: ITEM_WIDTH,
                                height: ITEM_WIDTH / ITEM_PROPORTION,
                            },
                        ]}>
                            <Image
                                style={[style.backgroundImage]}
                                url={manga.image}
                                resizeMode="cover"
                            />
                        </View>
                        <View>
                            <Text style={styles.title}>{manga.name}</Text>
                            {
                                isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="black" size="small" />
                                    </View>
                                ) : <View style={styles.subDescriptionContainer}>
                                        {
                                            manga.authors ? <Text style={styles.description}>{manga.authors}</Text> : null
                                        }
                                        {
                                            (manga.volumesCount || manga.chaptersCount) ? <Text style={styles.description}>{`${manga.volumesCount ? `${manga.volumesCount} томов` : ''}${manga.volumesCount && manga.chaptersCount ? `, ` : ''}${manga.chaptersCount ? `${manga.chaptersCount} глав` : ''}`}</Text> : null
                                        }
                                        {
                                            manga.chaptersStatus ? <Text style={styles.description}>{`${manga.chaptersStatus[0].toUpperCase()}${manga.chaptersStatus.slice(1).toLowerCase()}`}</Text> : null
                                        }
                                    </View>
                            }
                        </View>
                    </View>

                </View>
                <View style={styles.allContentContainer}>
                    <View>
                        <View style={styles.mangaDescriptionFieldTitleContainer}>
                            <Text style={styles.mangaDescriptionFieldTitle}>Описание</Text>
                            <Button style={styles.likeButton}>
                                <FontAwesomeIcon size={24} icon={false ? faHeart : faSolidHeart} color={false ? colors.faIconBlue : 'black'} />
                            </Button>
                        </View>
                        <Text style={styles.text}>{manga.description}</Text>
                        <Text style={styles.text}>{manga.tags}</Text>
                    </View>
                    <View>
                        <View style={styles.mangaDescriptionFieldTitleContainer}>
                            <Text style={styles.mangaDescriptionFieldTitle}>Главы</Text>
                            <Button onPress={onChangeSortOrder} style={styles.likeButton}>
                                <FontAwesomeIcon size={24} icon={chaptersSortOrder == 0 ? faSortNumericDown : faSortNumericUp} color={'black'} />
                            </Button>
                        </View>
                        <View style={styles.chaptersOutfit}>
                            {
                                (chaptersSortOrder == 0 ? manga.chapters.map(e => e) : manga.chapters.map(e => e).reverse()).map(chapter => (
                                    <Button onPress={() => onChapterPress(chapter)} style={styles.chapterRow}>
                                        <Text style={styles.chapterName}>{chapter.name}</Text>
                                        <Text style={styles.chapterDate}>{moment(chapter.date).format('DD.MM.YYYY')}</Text>
                                    </Button>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeArea>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        backgroundColor: colors.faIconBlue
    },
    container: {
        backgroundColor: 'white'
    },
    headerContainer: {
        ...style.header,
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
    loadingContainer: {
        padding: 30
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
    }
})