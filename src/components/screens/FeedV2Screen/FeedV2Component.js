import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Text,
    Animated,
    ActivityIndicator,
} from 'react-native';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import SafeArea from '../../theme/SafeArea';
import FeedV2Item from './FeedV2Item'

export default FeedV2Component = ({
    images,
    onScroll,
    checkIfShouldShow,
    onBackButtonPress,
    setScrollRef,
    showButtons,
    onScreenTap,
    headerOffset,
    scrollReady,
    showBackButton,
    likedPost,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                ref={setScrollRef}
                decelerationRate={"fast"}
                snapToInterval={styles.dimensionsContainer.height}
                disableIntervalMomentum={true}
                onScroll={onScroll}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={32}
                contentContainerStyle={{
                    flexGrow: 1
                }}
                pagingEnabled={true}
            >
                {
                    images.length == 0 && (<View style={[styles.dimensionsContainer, styles.loaderContainer]}>
                        <Text style={styles.loaderText}>Готовим контент для вас^^</Text>
                    </View>)
                }
                {
                    images.map((image, index) => {
                        return (
                            <FeedV2Item
                                key={index}
                                onScreenTap={onScreenTap}
                                showButtons={showButtons}
                                showStub={!checkIfShouldShow(index) || !scrollReady}
                                image={image}
                                likedPost={likedPost}
                            />
                        )
                    }
                    )
                }
                {
                    images.length > 0 && (
                        <View style={[styles.dimensionsContainer, styles.loaderContainer]}>
                            <ActivityIndicator size="large" color={colors.white} />
                        </View>
                    )
                }
            </ScrollView>
            {
                showBackButton && (
                    <Animated.View style={[
                        styles.absoluteHeader,
                        {
                            transform: [{
                                translateY: headerOffset
                            }],
                        }
                    ]}>
                        <SafeArea safeStyle={styles.safeHeader}>
                            <View style={styles.header}>
                                <Button onPress={onBackButtonPress} style={styles.backButtonContainer}>
                                    <FontAwesomeIcon icon={faArrowLeft} size={23} color={colors.white} />
                                </Button>
                            </View>
                        </SafeArea>
                    </Animated.View>
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    dimensionsContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: colors.darkLayout9
    },
    backButtonContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    safeHeader: {
        backgroundColor: colors.black
    },

    absoluteHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderText: {
        fontSize: 17,
        color: colors.white
    }
})