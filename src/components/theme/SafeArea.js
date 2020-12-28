import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Button from './Button';

const useLibMethod = true

export default SafeArea = ({
    children,
    style,
    safeStyle,
    ...props
}) => (
    <View style={[styles.container, safeStyle]}>
        {
            useLibMethod || Platform.OS == 'ios' ? (
                <SafeAreaInsetsContext.Consumer>
                    {
                        (insets) => (
                            <View style={[styles.container, { paddingTop: insets.top }]}>
                                <View style={[styles.container, style]}>
                                    {
                                        children
                                    }
                                </View>
                            </View>
                        )
                    }
                </SafeAreaInsetsContext.Consumer>
            ) : (
                    <View
                        style={[styles.container, styles.androidMargin]}>
                        <View style={[styles.container, style]}>
                            {
                                children
                            }
                        </View>
                    </View>
                )
        }
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    androidMargin: {
        paddingTop: StatusBar.currentHeight
    }
})