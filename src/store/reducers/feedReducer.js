import { LOAD_FEED_PAGE, SEE_URL, SET_CURRENT_PAGE_OF_DATE } from "../constants/feedConstants";

const initialState = {
    sawImages: [],
    currentPage: {},
    currentFeed: [],
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
        default:
            return state;
    }
};

export default feedReducer;