import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    Animated,
    FlatList,
} from 'react-native';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import Image from '../../theme/Image';
import SafeArea from '../../theme/SafeArea';
import HeaderImage from '../../../assets/profile/header.png'

const HEADER_PROPORTION = 450 / 150;
const IMAGE_PROPORTION = 150 / 225;

export default ProfileComponent = ({
    headerOffset,
    screenWidth,
    likedImages,
    processPreloadedPosts,
    onLikedImagePress,
    onScroll,
    showRow,
    onSettingsPress,
    onFlatListLayout,
    imageSizeStyle,
}) => {

    const headerSizeStyle = {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').width / HEADER_PROPORTION,
    }



    return (
        <SafeArea safeStyle={styles.flexContainer}>
            <View style={styles.buttonsContainer}>
                <Button onPress={onSettingsPress} style={styles.settingsContainer}>
                    <FontAwesomeIcon icon={faSlidersH} size={25} color={colors.white} />
                </Button>
            </View>
            <ScrollView
                onScroll={onScroll}
                scrollEventThrottle={32}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={[styles.animatedHeaderContainer, {
                    ...headerSizeStyle
                }]}>
                    <Animated.View style={[styles.animatedHeader, {
                        ...headerSizeStyle,
                        transform: [{
                            translateX: Animated.add(headerOffset, new Animated.Value(-screenWidth))
                        }]
                    }]}>
                        <Image
                            source={HeaderImage}
                            style={headerSizeStyle}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    <Animated.View style={[styles.animatedHeader, {
                        ...headerSizeStyle,
                        transform: [{
                            translateX: Animated.add(headerOffset, new Animated.Value(0))
                        }]
                    }]}>
                        <Image
                            source={HeaderImage}
                            style={headerSizeStyle}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>
                <View style={styles.metricsContainers}>
                    <View style={styles.metricsContainer}>
                        <Text style={styles.metricTitle}>Лайки</Text>
                        <Text style={styles.metric}>{likedImages.length}</Text>
                    </View>
                    <View style={styles.metricsContainer}>
                        <Text style={styles.metricTitle}>Скачивания</Text>
                        <Text style={styles.metric}>0</Text>
                    </View>
                </View>
                <View style={styles.likedBlockTitleContainer} />
                <View onLayout={onFlatListLayout}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={likedImages}
                        contentContainerStyle={[styles.likedImagesScrollContainer]}
                        keyExtractor={(item) => item.postUrl}
                        numColumns={2}
                        horizontal={false}
                        renderItem={({ item, index }) => (
                            <Button key={index} onPress={() => onLikedImagePress(item, index, likedImages)}>
                                {
                                    (
                                        showRow.includes(Math.round(index / 2)) ? (
                                            <Image
                                                url={item.imageUrl}
                                                style={{
                                                    ...styles.imageItem,
                                                    ...imageSizeStyle,
                                                    ...(
                                                        index % 2 == 1 ? {
                                                            marginLeft: 3
                                                        } : {
                                                            }
                                                    )
                                                }}
                                            />
                                        ) : (
                                                <View
                                                    style={{
                                                        ...styles.imageItem,
                                                        ...imageSizeStyle,
                                                        ...(
                                                            index % 2 == 1 ? {
                                                                marginLeft: 3
                                                            } : {
                                                                }
                                                        )
                                                    }}
                                                >
                                                    {

                                                        !processPreloadedPosts.includes(item.imageUrl) && (
                                                            <ActivityIndicator
                                                                size={'small'}
                                                                color={colors.white}
                                                            />
                                                        )
                                                    }

                                                </View>
                                            )
                                    )
                                }
                            </Button>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeArea>
    )
}


const styles = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: colors.black,
    },
    avatar: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: colors.darkLayout9
    },
    settingsContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        paddingTop: 50
    },
    animatedHeaderContainer: {
        flexDirection: 'row',
    },
    animatedHeader: {
        position: 'absolute'
    },
    metricsContainers: {
        flexDirection: 'row',
        marginTop: 25
    },
    metricsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    metricTitle: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 15
    },
    metric: {
        fontWeight: '600',
        color: colors.white,
        fontSize: 22,
        marginTop: 10
    },
    likedBlockTitleContainer: {
        borderBottomWidth: 1,
        borderColor: colors.darkLayout9,
        marginTop: 30,
    },
    likedBlockTitle: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 24
    },
    imageItem: {
        borderColor: colors.darkLayout4,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    likedImagesScrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 4
    }
})