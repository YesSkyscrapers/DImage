import { faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';
import { Image } from 'react-native-svg';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import SafeArea from '../../theme/SafeArea';

export default SettingsComponent = ({
    onBackButtonPress,
    onSwitchNsfwFilter,
    useNsfwFilter,
    onFeedBack,
}) => {


    return (
        <SafeArea safeStyle={styles.container}>
            <View style={styles.buttonsContainer}>
                <Text style={styles.label}>Настройки</Text>
                <Button onPress={onBackButtonPress} style={styles.backButtonContainer}>
                    <FontAwesomeIcon icon={faArrowLeft} size={23} color={colors.white} />
                </Button>
            </View>
            <ScrollView>
                <View style={styles.optionsContainer}>
                    <Button onPress={onSwitchNsfwFilter} style={styles.optionContainer}>
                        <Text style={styles.optionLabel}>18+</Text>
                        <FontAwesomeIcon icon={!useNsfwFilter ? faCheck : faTimes} size={23} color={colors.white} />
                    </Button>
                </View>
                <Button onPress={onFeedBack} style={styles.feedbackButtonContainer}>
                    <Text style={styles.feedbackButton}>Написать разработчику^^</Text>
                </Button>
            </ScrollView>
        </SafeArea>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.black
    },
    buttonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: colors.darkLayout9
    },
    backButtonContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        color: colors.white,
        fontWeight: 'bold',
        position: 'absolute',
        alignSelf: 'center',
        left: 0,
        right: 0,
        textAlign: 'center'
    },
    optionContainer: {
        flexDirection: 'row',
        marginHorizontal: 16
    },
    optionLabel: {
        flex: 1,
        color: colors.white,
        fontSize: 18
    },
    optionsContainer: {
        marginTop: 30
    },
    feedbackButton: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.white,
    },
    feedbackButtonContainer: {
        marginTop: 30,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white09,
        paddingHorizontal: 24,
        paddingRight: 20,
        marginHorizontal: 16,
        paddingVertical: 12,
        alignSelf: 'center'
    }
})