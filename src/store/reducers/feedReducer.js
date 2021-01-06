import { ADD_NSFW_TAG, DOWNLOAD_POST, LIKE_POST, LOAD_FEED_PAGE, REMOVE_NSFW_TAG, SEE_URL, SET_CURRENT_PAGE_OF_DATE, UNLIKE_POST } from "../constants/feedConstants";

const initialState = {
    sawImages: [],
    currentPage: {},
    currentFeed: [],
    likedPost: [],
    downloadedCount: 0,
    nsfwTags: []
}

const feedReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEE_URL: {
            return {
                ...state,
                sawImages: state.sawImages.concat([action.payload])
            }
        }
        case LOAD_FEED_PAGE: {
            return {
                ...state,
                currentFeed: state.currentFeed.concat([action.payload])
            }
        }
        case LIKE_POST: {
            return {
                ...state,
                likedPost: state.likedPost ? state.likedPost.concat([action.payload]) : [action.payload]
            }
        }
        case UNLIKE_POST: {
            return {
                ...state,
                likedPost: state.likedPost ? state.likedPost.filter(post => post.imageUrl != action.payload.imageUrl) : []
            }
        }
        case DOWNLOAD_POST: {
            return {
                ...state,
                downloadedCount: state.downloadedCount ? state.downloadedCount + 1 : 1
            }
        }
        case ADD_NSFW_TAG: {
            return {
                ...state,
                nsfwTags: state.nsfwTags ? state.nsfwTags.concat([action.payload]) : [action.payload]
            }
        }
        case REMOVE_NSFW_TAG: {
            return {
                ...state,
                nsfwTags: state.nsfwTags.filter(tag => tag != action.payload)
            }
        }
        default:
            return state;
    }
};

export default feedReducer;