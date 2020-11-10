import React from 'react';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Button from './components/theme/Button';
import { Actions } from 'react-native-js-navigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { connect } from 'react-redux';
import colors from './components/theme/colors';

const ANIMATION_DURATION = 400;
const HIDING_HEIGHT = 300;

class TabBar extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            tabbarNativeOffset: new Animated.Value(0),
            tabbarOffset: new Animated.Value(0)
        }

        this.isOpen = true
    }

    onKeyPress = (element, index) => {
        const { activeIndex, activeTabKeyName, tabs, ...props } = this.props;

        if (element !== activeTabKeyName) {
            Actions.push(element);
        }
    }

    toggleTabBar = (isOpen = true) => {
        this.isOpen = isOpen
        Animated.parallel([
            Animated.timing(this.state.tabbarNativeOffset, {
                toValue: isOpen ? 0 : HIDING_HEIGHT,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
                easing: isOpen ? Easing.out(Easing.poly(2)) : Easing.in(Easing.poly(2))
            }),
            Animated.timing(this.state.tabbarOffset, {
                toValue: isOpen ? 0 : HIDING_HEIGHT,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
                easing: isOpen ? Easing.out(Easing.poly(2)) : Easing.in(Easing.poly(2))
            })
        ]).start(() => {

        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.isTabBarShow != prevProps.isTabBarShow
            && this.props.isTabBarShow != this.isOpen) {
            this.toggleTabBar(this.props.isTabBarShow);
        }
    }

    renderTabBar = () => {
        const { activeIndex, activeTabKeyName, tabs, ...props } = this.props;
        return (
            <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                    <View style={[styles.tabbarContainer, { paddingBottom: insets.bottom }]}>
                        <View style={styles.tabContainer}>
                            {
                                tabs.map((element, index) => {
                                    const isActive = activeTabKeyName == element.elementKey
                                    return (
                                        <Button style={styles.tabKeyContainer} key={element.elementKey} onPress={() => this.onKeyPress(element.elementKey, index)}>
                                            <FontAwesomeIcon color={isActive ? colors.faIconBlue : colors.faIcon} size={28} icon={element.icon} style={styles.tabIcon} />
                                        </Button>
                                    )
                                })
                            }
                        </View>
                    </View>
                )}
            </SafeAreaInsetsContext.Consumer>
        );
    }

    render() {
        return (
            <View>
                <Animated.View style={{ marginBottom: Animated.multiply(this.state.tabbarOffset, new Animated.Value(-1)) }}>
                    {
                        this.renderTabBar()
                    }
                    <View style={[styles.absoluteContainer, styles.hidingStub]} />
                </Animated.View>
                <Animated.View style={[
                    styles.absoluteContainer,
                    { transform: [{ translateY: this.state.tabbarNativeOffset }] }
                ]}>
                    {
                        this.renderTabBar()
                    }
                </Animated.View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        isTabBarShow: state.app.isTabBarShow
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TabBar);

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    tabKeyContainer: {
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabIcon: {
    },
    tabbarContainer: {
        minHeight: 50,
        paddingTop: 1,
        borderTopWidth: 1,
        borderColor: 'gray'
    },
    tabTitle: {
        fontSize: 15
    },
    absoluteContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    hidingStub: {
        backgroundColor: 'white'
    }
})