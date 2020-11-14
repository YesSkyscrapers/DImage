import {
    LOAD_FEED_PAGE,
    SEE_URL
} from "../constants/feedConstants";


export const see_url = (url) => {
    return {
        type: SEE_URL,
        payload: url
    };
};


export const load_feed_page = (images) => {
    return {
        type: LOAD_FEED_PAGE,
        payload: images
    };
};