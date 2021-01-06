import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text
} from 'react-native';
import Button from '../../theme/Button';
import colors from '../../theme/colors';
import SafeArea from '../../theme/SafeArea';
import NsfwListItem from './NsfwListItem'

export default NsfwListComponent = ({
    tags,
    onCopyPress,
    onBackPress,
}) => {


    return (
        <SafeArea safeStyle={styles.container}>
            <ScrollView style={styles.container} >
                <Button style={styles.copyButtonContainer} onPress={onBackPress}><Text style={styles.copyButton}>Back</Text></Button>
                <Button style={styles.copyButtonContainer} onPress={onCopyPress}><Text style={styles.copyButton}>Copy</Text></Button>
                {
                    tags.map(tag => <NsfwListItem tag={tag} />)
                }
            </ScrollView>
        </SafeArea>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black
    },
    copyButtonContainer: {
        borderRadius: 30,
        height: 40,
        borderColor: colors.white,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16
    },
    copyButton: {
        color: colors.white,
        fontSize: 17,
        fontWeight: 'bold'

    }
})