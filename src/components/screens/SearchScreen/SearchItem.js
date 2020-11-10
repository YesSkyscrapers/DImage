import React, { useState } from 'react'
import { Dimensions, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Button from '../../theme/Button';
import style from '../../theme/style';
import Image from '../../theme/Image'

const ITEM_WIDTH = (Dimensions.get('window').width / 2) - 12;
const ITEM_PROPORTION = 100 / 150;

export default class SearchItem extends React.PureComponent {



    render() {

        let { item, index } = this.props;
        return (
            <Button
                onPress={() => this.props.onPress(item)}
                key={item} style={{
                    ...styles.container,
                    marginLeft: index % 2 == 0 ? 0 : 4,
                    marginRight: index % 2 == 0 ? 4 : 0,
                }}>
                <Image
                    style={styles.image}
                    url={item.image}
                    resizeMode="cover"
                />

                <View style={{ flex: 1 }} />
                <View style={styles.titleContainer}>
                    <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
                </View>
            </Button>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH / ITEM_PROPORTION,
        borderColor: 'black',
        borderWidth: 1,
        overflow: 'hidden',
        borderRadius: 5,
        marginBottom: 8,
    },
    image: {
        ...style.backgroundImage,
        justifyContent: 'center', alignItems: 'center'
    },
    titleContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        padding: 8,
        color: 'white'
    }
})