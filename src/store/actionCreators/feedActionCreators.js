import {
    LIKE_POST,
    LOAD_FEED_PAGE,
    SEE_URL,
    UNLIKE_POST
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


export const like_post = (url) => {
    return {
        type: LIKE_POST,
        payload: url
    };
};


export const unlike_post = (url) => {
    return {
        type: UNLIKE_POST,
        payload: url
    };
};
