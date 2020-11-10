import React from 'react';
import MangaReaderComponent from './MangaReaderComponent';
import { Actions } from 'react-native-js-navigator';
import { connect } from 'react-redux';
import { toggle_tabbar_visibility } from '../../../store/actionCreators/appActionCreators';
import { getHtmlFromUrl, mergeActiveUrlAndSubUrl } from '../../../tools/parsers/tools';
import mangachanParser from '../../../tools/parsers/mangachanParser'
import { CHAPTER_STATE } from '../../../store/constants/readerConstants';
import { Dimensions } from 'react-native';
import Image from '../../theme/Image'
import { getWaitPromise } from '../../../tools/tools'

const PRELOAD_CHAPTER_LENGTH = 2
const PRELOAD_DELAY = 1000;

class MangaReaderContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            chapters: this.props.chapters.map(chapter => ({
                ...chapter,
                images: [],
                state: CHAPTER_STATE.NOT_SHOW,
                offset: 0
            })),
            currentPage: 0,
            currentChapterIndex: 0,
        }
        this.lastOffset = 0;
        this.activeScroll = false;
        this.afterDragEndFunc = () => { }
        this.currentChapterIndex = this.props.activeChapterIndex
        this.stopLoadingProcess = false;
        this.preloadedImagesUrls = [];
        this.preloadedKeys = []
    }

    componentDidMount() {
        this.loadChapterPages(this.currentChapterIndex)
        setTimeout(() => {
            this.askPreviousChapter(this.currentChapterIndex);
        }, 100)

        this.loadingProcess()
    }

    componentWillUnmount() {
        this.stopLoadingProcess = true;
    }

    getUnPreloadedImagesUrls = (chapter, page) => {
        if ((chapter - this.state.currentChapterIndex) > PRELOAD_CHAPTER_LENGTH) {
            console.log('1')
            return [undefined, undefined, undefined]
        }
        let currentUrl = this.state.chapters[chapter].images[page]
        if (this.preloadedImagesUrls.includes(currentUrl)) {
            let nextPage = page + 1;
            if (nextPage >= this.state.chapters[chapter].images.length) {
                if ((chapter + 1) >= this.state.chapters.length) {
                    console.log('2')
                    return [undefined, undefined, undefined]
                } else {
                    return this.getUnPreloadedImagesUrls(chapter + 1, 0)
                }
            } else {
                return this.getUnPreloadedImagesUrls(chapter, page + 1)
            }
        } else {
            console.log('3', this.state.chapters.length, chapter, this.state.chapters[chapter].images.length, page)
            console.log('3', this.state.chapters)
            return [currentUrl, chapter, page];
        }
    }

    loadingProcess = () => {
        return new Promise(resolve => {
            console.log('loadingProcess', 'check this.stopLoadingProcess', this.stopLoadingProcess)
            if (this.stopLoadingProcess) {
                return resolve();
            } else {
                let page = this.state.currentPage;
                let chapter = this.state.currentChapterIndex;
                console.log('loadingProcess', 'current page and chapter', page, chapter)
                console.log('loadingProcess', 'preloadedImagesUrls', this.preloadedImagesUrls)

                let [nextUrl, newChapter, newPage] = this.getUnPreloadedImagesUrls(chapter, page);

                if (nextUrl != undefined && newChapter != undefined) {
                    if (this.state.chapters[newChapter].state == CHAPTER_STATE.LOADING) {
                        console.log('loadingProcess', 'newChapter is already loading, just waiting')

                        return getWaitPromise(PRELOAD_DELAY).then(() => {
                            return this.loadingProcess();
                        })
                    } else if (this.state.chapters[newChapter].state == CHAPTER_STATE.NOT_SHOW) {
                        console.log('loadingProcess', 'newChapter is not loaded, loading')
                        const screenWidth = Dimensions.get('screen').width
                        this.updateChapterByIndex(newChapter, {
                            state: CHAPTER_STATE.LOADING,
                            offset: screenWidth
                        })
                        return this.getImageUrlsFromChapterUrl(this.state.chapters[newChapter].url).then(images => {
                            this.updateChapterByIndex(newChapter, {
                                images,
                                state: CHAPTER_STATE.LOADED,
                                offset: screenWidth * images.length
                            })
                        }).then(() => {
                            console.log('loadingProcess', 'newChapter is loaded, waiting')

                            return getWaitPromise(PRELOAD_DELAY).then(() => {
                                return this.loadingProcess();
                            })
                        })
                    } else {

                        let preloadPromise = Image.preload(nextUrl);
                        console.log('loadingProcess', 'preloadPromise', preloadPromise)

                        if (preloadPromise) {
                            this.preloadedImagesUrls.push(nextUrl)
                            this.preloadedKeys.push(`${newChapter}:${newPage}`)
                            console.log('loadingProcess', 'preloadedImagesUrls', this.preloadedImagesUrls)
                            return preloadPromise.then(() => {
                                return this.loadingProcess();
                            })
                        } else {
                            console.log('loadingProcess', 'go to wait')
                            return getWaitPromise(PRELOAD_DELAY).then(() => {
                                return this.loadingProcess();
                            })
                        }


                    }

                } else {
                    console.log('loadingProcess', 'go to wait')
                    return getWaitPromise(PRELOAD_DELAY).then(() => {
                        return this.loadingProcess();
                    })
                }
            }
        })
    }

    updateChapterByIndexWrapper = (index, update, callback) => {

        if (this.activeScroll) {
            this.afterDragEndFunc = () => this.updateChapterByIndex(index, update, callback)
        } else {
            this.updateChapterByIndex(index, update, callback)
        }
    }

    updateChapterByIndex = (index, update, callback = () => { }) => {

        let newChapters = this.state.chapters.map((chapter, _index) => {
            if (index == _index) {
                return {
                    ...chapter,
                    ...update,
                }
            } else {
                return chapter
            }
        })
        this.setState({
            chapters: newChapters
        }, () => {
            setTimeout(() => {
                callback()
            }, 1)
        })
    }

    getIndexesByOffset = (offset) => {
        const screenWidth = Dimensions.get('screen').width
        let _offset = 0;
        let foundChapterIndex = -1;
        let foundImageIndex = -1;

        for (let chapterIndex = 0; chapterIndex < this.state.chapters.length; chapterIndex++) {
            let currentChapterOffset = screenWidth * (this.state.chapters[chapterIndex].state == CHAPTER_STATE.NOT_SHOW ? 0 : (
                this.state.chapters[chapterIndex].state == CHAPTER_STATE.LOADING ? 1 : this.state.chapters[chapterIndex].images.length
            ))
            _offset += currentChapterOffset;
            if (_offset > offset) {
                _offset -= currentChapterOffset;
                foundChapterIndex = chapterIndex;
                for (let imageIndex = 0; imageIndex < this.state.chapters[chapterIndex].images.length; imageIndex++) {
                    let currentImageOffset = screenWidth
                    _offset += currentImageOffset;
                    if (_offset > offset) {
                        foundImageIndex = imageIndex;
                        break;
                    }
                }

                break;
            }
        }

        return {
            chapterIndex: foundChapterIndex,
            imageIndex: foundImageIndex
        }
    }

    scrollReaderTo = offset => {
        this.scrollRef.scrollTo({
            x: offset,
            y: 0,
            animated: false
        })
    }

    loadChapterPages = (activeIndex, forceChapterIndex) => {
        const screenWidth = Dimensions.get('screen').width
        let currentChapterIndex = forceChapterIndex == undefined ? this.getIndexesByOffset(this.lastOffset).chapterIndex : forceChapterIndex;
        let loadingStateIncluded = false
        if (activeIndex < 0 || activeIndex > this.state.chapters.length - 1 || this.state.chapters[activeIndex].state == CHAPTER_STATE.LOADED) {
            return;
        } else {
            this.updateChapterByIndexWrapper(activeIndex, {
                state: CHAPTER_STATE.LOADING,
                offset: screenWidth
            }, () => {
                if (currentChapterIndex > activeIndex) {
                    loadingStateIncluded = true;
                    this.scrollReaderTo(this.lastOffset + screenWidth)
                }
            })
            return this.getImageUrlsFromChapterUrl(this.state.chapters[activeIndex].url).then(images => {

                this.updateChapterByIndexWrapper(activeIndex, {
                    images,
                    state: CHAPTER_STATE.LOADED,
                    offset: screenWidth * images.length
                }, () => {
                    if (currentChapterIndex > activeIndex) {
                        this.scrollReaderTo(this.lastOffset + screenWidth * (images.length - (loadingStateIncluded ? 1 : 0)))
                    }
                })
            })
        }
    }

    getImageUrlsFromChapterUrl = (url) => {
        return getHtmlFromUrl(url).then(html => {
            return mangachanParser.getMangaPages(html).then(imageUrls => {
                return imageUrls
            })
        })
    }


    onBack = () => {
        Actions.pop();
        this.props.toggleTabBar(true)
    }

    onScroll = (event) => {
        const offset = event.nativeEvent.contentOffset.x;
        this.lastOffset = offset

        this.pageDetect(this.lastOffset)
    }

    onScrollBeginDrag = () => {
        this.activeScroll = true;
    }

    onScrollEndDrag = () => {

    }

    onMomentumScrollEnd = () => {
        this.activeScroll = false;
        this.afterDragEndFunc();
        this.afterDragEndFunc = () => { }
    }

    askPreviousChapter = (foceIndex) => {
        this.loadChapterPages(this.currentChapterIndex - 1, foceIndex)
    }

    askNextChapter = (foceIndex) => {
        this.loadChapterPages(this.currentChapterIndex + 1, foceIndex)
    }

    pageDetect = (_offset) => {
        let prevPage = this.state.currentPage;
        let prevChapter = this.currentChapterIndex;
        let newPageIndexes = this.getIndexesByOffset(_offset);
        let newPage = newPageIndexes.imageIndex
        let newChapter = newPageIndexes.chapterIndex

        if (prevChapter != newChapter) {
            this.currentChapterIndex = newPageIndexes.chapterIndex
        } else {
            const imagesCount = this.state.chapters[this.currentChapterIndex].images.length
            if (newPage == 0 && prevPage > 0) {
                this.askPreviousChapter();
            } else if (newPage == (imagesCount - 1) && prevPage < (imagesCount - 1)) {
                this.askNextChapter();
            }
        }


        this.setState({
            currentPage: newPage,
            currentChapterIndex: newChapter
        })
    }

    getAllowedMergedPageAndChapterValues = () => {
        if (this.state.currentChapterIndex == -1 || this.state.currentPage == -1) {
            return []
        }
        let chapter = this.state.currentChapterIndex
        let page = this.state.currentPage;
        let current = `${chapter}:${page}`

        let prev = undefined;
        let prevPage = page - 1;
        let prevChapter = chapter
        if (prevPage < 0) {
            prevChapter = chapter - 1;
            if (prevChapter < 0) {
                prev = undefined;
            } else {
                prevPage = this.state.chapters[prevChapter].images.length - 1
                prev = `${prevChapter}:${prevPage}`
            }

        } else {
            prev = `${prevChapter}:${prevPage}`
        }


        let next = undefined
        let nextPage = page + 1;
        let nextChapter = chapter;
        if (nextPage >= this.state.chapters[nextChapter].images.length) {
            nextChapter = chapter + 1;
            if (nextChapter >= this.state.chapters.length) {
                next = undefined;
            } else {
                nextPage = 0
                next = `${nextChapter}:${nextPage}`
            }
        } else {
            next = `${nextChapter}:${nextPage}`
        }

        let allowedKeys = [prev, current, next].filter(value => value);
        this.preloadedKeys.forEach(key => {
            if (!allowedKeys.includes(key)) {
                allowedKeys.push(key)
            }
        })

        return allowedKeys
    }

    render() {
        return (
            <MangaReaderComponent
                onBack={this.onBack}
                chapters={this.state.chapters}
                onScroll={this.onScroll}
                setRef={ref => this.scrollRef = ref}
                onScrollBeginDrag={this.onScrollBeginDrag}
                onScrollEndDrag={this.onScrollEndDrag}
                onMomentumScrollEnd={this.onMomentumScrollEnd}
                currentPage={this.state.currentPage}
                currentChapterIndex={this.state.currentChapterIndex}
                allowedPages={this.getAllowedMergedPageAndChapterValues()}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleTabBar: (state) => dispatch(toggle_tabbar_visibility(state))

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MangaReaderContainer);