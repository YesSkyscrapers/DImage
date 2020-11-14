import { store } from '../store'
import moment from 'moment'
import danbooruUrlCreator from '../../tools/urlCreators/danbooruUrlCreator'
import danbooruParser from '../../tools/parsers/danbooruParser'
import { getHtmlFromUrl } from '../../tools/parsers/tools'
import { load_feed_page, see_url } from '../actionCreators/feedActionCreators'
import { SKIP_PAGE } from '../../components/theme/List'

const getFeedDate = (usePrevDay = false) => {
    return moment().add(usePrevDay ? -1 : 0, "days").format('YYYY-MM-DD');
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
        }

    }
}


export const loadFeedPost = (url) => {
    return async (dispatch, getState) => {

        const postUrl = danbooruUrlCreator.getPostUrl(url)
        return getHtmlFromUrl(postUrl).then(html => {
            return danbooruParser.getPostInfo(html, postUrl).then(postInfo => {
                return postInfo
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
                    const uniqueImages = images.filter(image => !feed.sawImages.includes(image))
                    if (uniqueImages.length == 0) {
                        return SKIP_PAGE;
                    } else {
                        return uniqueImages
                    }
                }
            })
        })

    }
}

