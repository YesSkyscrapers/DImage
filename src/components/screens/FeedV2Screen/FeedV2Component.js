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
}) => {


    return (
        <View style={styles.container}>
            <ScrollView
                ref={setScrollRef}
                decelerationRate={"fast"}
                snapToInterval={styles.dimensionsContainer.height}
                onScroll={onScroll}
            >
                {
                    images.map((image, index) =>
                        <FeedV2Item
                            onScreenTap={onScreenTap}
                            showButtons={showButtons}
                            showStub={!checkIfShouldShow(index)}
                            image={image}
                        />
                    )
                }
            </ScrollView>
            {
                true && (
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
})