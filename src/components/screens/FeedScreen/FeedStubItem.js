import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import colors from '../../theme/colors';

export default FeedStubItem = ({
    item,
    index,
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.white} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})