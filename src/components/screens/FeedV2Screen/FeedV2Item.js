import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { saveFile } from 'react-native-cache-control-image';
import { connect } from 'react-redux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import colors from '../../theme/colors';
import Image from '../../theme/Image';
import LikeUI from './LikeUI';

class FeedV2Item extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            showButtons: props.showButtons
        }

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onScreenTap = () => {
        this.props.onScreenTap()
    }



    onDownloadPress = url => {
        saveFile(url)
    }

    render() {
        return (
            <View style={styles.container}>
                <LikeUI
                    showBackButton
                    onBackButtonPress={this.props.onBackButtonPress}
                    item={this.props.image}
                    onPress={this.onScreenTap}
                    onDownloadPress={this.onDownloadPress}
                    showButtons={this.props.showButtons}
                >
                    {
                        this.props.showStub ? (
                            <View style={[styles.container, styles.center]}>
                                <ActivityIndicator size="large" color={colors.white} />
                            </View>
                        ) : (
                                <Image
                                    resizeMode="contain"
                                    loaderSize="large"
                                    url={this.props.image.imageUrl}
                                    style={styles.dimensionsContainer}
                                />
                            )
                    }
                </LikeUI>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleTabBar: (state) => dispatch(toggle_tabbar_visibility(state)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedV2Item);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    dimensionsContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})