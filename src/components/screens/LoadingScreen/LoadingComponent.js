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
    ScrollView
} from 'react-native';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import Image from '../../theme/Image';
import SafeArea from '../../theme/SafeArea';


export default LoadingComponent = ({

}) => {


    return (
        <SafeArea safeStyle={styles.flexContainer} style={styles.flexContainer}>
            <Text style={styles.loader}>Готовим все необходимое :)</Text>
        </SafeArea>
    )
}


const styles = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    loader: {
        color: colors.white,
        fontSize: 17,
        textAlign: 'center',
        paddingHorizontal: 16
    }
})