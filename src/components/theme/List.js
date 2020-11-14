import React from 'react'
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native'

const DEFAULT_PRELOAD_OFFSET = 1000;


export const SKIP_PAGE = 'SKIP_PAGE'

export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isLoading: true
        }

        this.currentPage = 0;
        this.isEndReached = false;
        this.currentIdentifier = this.props.listIdentifier;
        this.downloadLock = false;
    }

    componentDidMount() {
        this.reUseList();
    }

    componentDidUpdate(prevProps) {
        if (this.props.listIdentifier != prevProps.listIdentifier) {

            this.reUseList();
        }
    }

    reUseList = () => {
        this.currentIdentifier = this.props.listIdentifier
        this.currentPage = 0;
        this.isEndReached = false;
        this.downloadLock = false;
        this.setState({
            data: []
        }, () => {
            this.askForNewElements();
            this.scrollRef.scrollToOffset({ offset: 0, animated: true })
        })
    }

    askForNewElements = (isAgain = false) => {
        if (!isAgain) {
            if (this.isEndReached) {
                return;
            }
            if (this.downloadLock) {
                return;
            }
        }
        this.downloadLock = true;
        this.setState({
            isLoading: true
        })
        let listIdentifierAtStartProcess = this.currentIdentifier
        this.props.getNewElements(this.currentPage++).then(result => {
            if (this.currentIdentifier != listIdentifierAtStartProcess) {
                return;
            }

            if (result == SKIP_PAGE) {
                return this.askForNewElements(true);
            } else {
                if (result.length == 0) {
                    this.isEndReached = true;
                }

                this.setState({
                    isLoading: false,
                    data: this.state.data.concat(result)
                }, () => {
                    if (this.props.onResult) {
                        this.props.onResult(this.state.data)
                    }
                    this.downloadLock = false;
                })
            }
        })
    }

    onScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        if ((contentHeight - contentOffset) < (this.props.preloadOffset ? this.props.preloadOffset : DEFAULT_PRELOAD_OFFSET)) {
            this.askForNewElements();
        }

        if (this.props.onScroll) {
            this.props.onScroll(event)
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={ref => this.scrollRef = ref}
                    keyExtractor={(item) => item}
                    showsVerticalScrollIndicator={false}
                    {...this.props}
                    data={this.state.data}
                    onScroll={this.onScroll}
                    scrollEventThrottle={32}
                    style={[styles.listStyle, this.props.style]}
                    contentContainerStyle={[styles.listContainerStyle, this.props.contentContainerStyle]}
                    ListFooterComponent={
                        <View >
                            {
                                !this.props.disableLoader && this.state.isLoading && (
                                    <View style={styles.loaderContainer}>
                                        <ActivityIndicator size="large" />
                                    </View>
                                )
                            }
                            {
                                this.props.ListFooterComponent
                            }
                        </View>

                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listStyle: {
    },
    listContainerStyle: {
        flexGrow: 1,
    },
    loaderContainer: {
        paddingVertical: 50
    }
})