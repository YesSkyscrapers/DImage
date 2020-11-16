import { LIKE_POST, LOAD_FEED_PAGE, SEE_URL, SET_CURRENT_PAGE_OF_DATE, UNLIKE_POST } from "../constants/feedConstants";

const initialState = {
    sawImages: [],
    currentPage: {},
    currentFeed: [],
    likedPost: []
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
        default:
            return state;
    }
};

export default feedReducer;