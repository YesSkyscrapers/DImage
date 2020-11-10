import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-js-navigator';
import Button from '../../theme/Button';
import SafeArea from '../../theme/SafeArea';
import Image from '../../theme/Image'

export default LibraryComponent = ({
    activedUrls,
    urls,
    preload,
    open,
    close,
    activedUrls2,
    useProxy,
}) => (
        <SafeArea style={{}}>
            <Text style={{ alignSelf: 'center' }}>{`use proxy: ${useProxy}`}</Text>
            <View style={styles.container}>
                {[0, 1, 2].map(index => (
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <Button onPress={() => preload(index, 1)}>
                                <Text>Preload</Text>
                            </Button>
                            <Button onPress={() => preload(index, 2)}>
                                <Text>Preload</Text>
                            </Button>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Button onPress={() => open(index, 1)}>
                                <Text>Open</Text>
                            </Button>
                            <Button onPress={() => open(index, 2)}>
                                <Text>Open</Text>
                            </Button>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Button onPress={() => close(index, 1)}>
                                <Text>Close</Text>
                            </Button>
                            <Button onPress={() => close(index, 2)}>
                                <Text>Close</Text>
                            </Button>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                activedUrls.includes(index) ? (
                                    <Image url={urls[index]} style={{ width: 100, height: 150 }} />
                                ) : (
                                        <View style={{ width: 100, height: 150, borderWidth: 1, borderColor: 'black' }} />
                                    )
                            }
                            {
                                activedUrls2.includes(index) ? (
                                    <Image url={urls[index]} style={{ width: 150, height: 100 }} />
                                ) : (
                                        <View style={{ width: 150, height: 100, borderWidth: 1, borderColor: 'black' }} />
                                    )
                            }
                        </View>
                    </View>
                ))}
            </View>
        </SafeArea>
    )

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})