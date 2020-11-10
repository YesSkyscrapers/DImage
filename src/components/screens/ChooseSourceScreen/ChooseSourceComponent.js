import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-js-navigator';
import Button from '../../theme/Button';
import style from '../../theme/style';



export default ChooseSourceComponent = ({

}) => {
    return (
        <View style={styles.container}>
            <Button onPress={() => { }} style={styles.refreshButton}>
                <Text style={style.text}>{'Обновить'}</Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 100
    },
})