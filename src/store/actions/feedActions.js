import { store } from '../store'
import moment from 'moment'
import danbooruUrlCreator from '../../tools/urlCreators/danbooruUrlCreator'
import danbooruParser from '../../tools/parsers/danbooruParser'
import { getHtmlFromUrl } from '../../tools/parsers/tools'
import { download_post, like_post, load_feed_page, see_url } from '../actionCreators/feedActionCreators'
import { SKIP_PAGE } from '../../components/theme/List'
import { getWaitPromise } from '../../tools/tools'
import { PermissionsAndroid, Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob';
import createGuid from "react-native-create-guid";
import CameraRoll from '@react-native-community/cameraroll'
import { PROXY_URL } from '../../tools/fetch'

const getFeedDate = (usePrevDay = false) => {
    return moment().add(usePrevDay ? -3 : -2, "days").format('YYYY-MM-DD');
}



export const seeImage = (url) => {
    return async (dispatch, getState) => {

        const sawImages = getState().feed.sawImages

        if (url) {
            if (!sawImages.includes(url)) {
                dispatch(see_url(url));
            }
        } else {
            console.log('smth wrong, saw non existing image')
            return getWaitPromise(1000).then(() => {
                return seeImage(url)
            })
        }

    }
}


export const loadFeedPost = (url) => {
    return async (dispatch, getState) => {

        const postUrl = danbooruUrlCreator.getPostUrl(url)
        return getHtmlFromUrl(postUrl).then(html => {
            return danbooruParser.getPostInfo(html, postUrl).then(postInfo => {
                return {
                    ...postInfo,
                    link: url
                }
            })
        })
    }
}


export const loadFeed = (page, usePrevDay = false) => {
    return async (dispatch, getState) => {
        const feedDate = getFeedDate(usePrevDay);
        const feed = getState().feed;
        const popularPageUrl = danbooruUrlCreator.getPopularUrl(feedDate, page + 1)
        return getHtmlFromUrl(popularPageUrl).then(html => {
            return danbooruParser.getImagesFromPopularPage(html).then(images => {
                if (images.length == 0) {
                    return images //[]
                } else {
                    const uniqueImages = images.filter(image => !feed.sawImages.includes(image.link))

                    const nsfwTags = getState().feed.nsfwTags
                    const imageAfterFilter = uniqueImages.filter(image => {
                        if (getState().feed.useNsfwFilter) {
                            let isNsfw = false;
                            image.tags.forEach(tag => {
                                if (nsfwTags.includes(tag)) {
                                    isNsfw = true
                                }
                            })
                            return !isNsfw
                        } else {
                            return true;
                        }
                    })
                    if (imageAfterFilter.length == 0) {
                        return SKIP_PAGE;
                    } else {
                        return imageAfterFilter.map(image => image.link)
                    }
                }
            })
        })

    }
}


//UNUSED NOW
export const likeALotImages = (page = 0) => {
    return async (dispatch, getState) => {
        const feedDate = getFeedDate(true);
        const feed = getState().feed;
        const popularPageUrl = danbooruUrlCreator.getPopularUrl(feedDate, page + 1)
        return getHtmlFromUrl(popularPageUrl).then(html => {
            return danbooruParser.getImagesFromPopularPage(html).then(async images => {

                images = images.map(info => info.link)

                if (images.length == 0 || page > 15) {
                    console.log('end')
                } else {

                    await images.forEach(async (postUrl, index) => {
                        if (!getState().feed.likedPost.map(post => post.postUrl).includes(postUrl)) {
                            await getWaitPromise(10000).then(async () => {
                                await dispatch(loadFeedPost(postUrl)).then(imageUrl => {
                                    const postInfo = {
                                        postUrl,
                                        imageUrl: imageUrl.imageUrl,
                                    }

                                    dispatch(like_post(postInfo))

                                })
                            })
                        }
                    })


                    return getWaitPromise(5000).then(() => {
                        return dispatch(likeALotImages(page + 1))
                    })
                }
            })
        })

    }
}


const getUniquePath = (rootPath, ext) => {
    return createGuid().then(newGuid => {
        const path = rootPath + newGuid + ext;
        return RNFetchBlob.fs.exists(path).then(isExist => {
            if (isExist) {
                return getUniquePath();
            } else {
                return path;
            }
        })
    })
}

const downloadFile = item => {

    return async (dispatch, getState) => {
        const useProxy = getState().app.useProxy
        const url = item.fullImageUrl || item.imageUrl;

        return RNFetchBlob.config({
            fileCache: false
        }).fetch('GET', useProxy ? PROXY_URL : url, {
            "url": useProxy ? url : undefined,
            "Cache-Control": 'no-store',
        }).then(res => {
            let status = res.info().status;
            if (status == 200) {
                if (Platform.OS == 'ios') {
                    return res.base64().then(base64Str => {
                        return base64Str;
                    })

                } else {
                    let base64Str = res.base64()
                    return base64Str
                }


            } else {
                return false;
            }
        })
    }
}

const saveFileInStorage = (base64) => {
    return async (dispatch, getState) => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ]);
                return getUniquePath(`${RNFetchBlob.fs.dirs.PictureDir}/`, '.png').then(imagePath => {
                    if (Object.values(granted).filter(perm => perm != 'granted').length == 0) {
                        return RNFetchBlob.fs.createFile(`${imagePath}`, `${base64}`, 'base64')
                            .then(() => {
                                //dispatch(show_success('Сохранено в галерее телефона'))
                                return RNFetchBlob.fs.scanFile([{ path: `${imagePath}`, mime: 'image/png' }]).then(res => true);
                            })
                            .catch((err) => {
                                console.log(322, err)
                                // пробуем перезаписать файл

                                return RNFetchBlob.fs.writeFile(`${imagePath}`, `${base64}`, 'base64')
                                    .then(() => {
                                        //dispatch(show_success('Перезаписано'))
                                        return RNFetchBlob.fs.scanFile([{ path: `${imagePath}`, mime: 'image/png' }]).then(res => true);
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            })
                    } else {
                        console.log('Camera permission denied');
                    }
                })

            } catch (err) {
                console.warn(err);
            }

        } else {
            return CameraRoll.saveToCameraRoll('data:image/png;base64,' + `${base64}`)
                .then(() => {
                    //dispatch(show_success('Сохранено в галерее телефона'))

                    return true;
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }
}


export const saveFile = (item) => {
    return async (dispatch, getState) => {
        return dispatch(downloadFile(item)).then(base64 => {
            return dispatch(saveFileInStorage(base64)).then(() => {
                dispatch(download_post()); //counter
            })
        })
    }
}