import {
    ADD_NSFW_TAG,
    DOWNLOAD_POST,
    LIKE_POST,
    LOAD_FEED_PAGE,
    REMOVE_NSFW_TAG,
    SEE_URL,
    SWITCH_NSFW_FILTER,
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

export const download_post = () => {
    return {
        type: DOWNLOAD_POST
    };
};

export const add_nsfw_tag = (tag) => {
    return {
        type: ADD_NSFW_TAG,
        payload: tag
    };
};


export const remove_nsfw_tag = (tag) => {
    return {
        type: REMOVE_NSFW_TAG,
        payload: tag
    };
};

export const switch_nsfw_filter = (tag) => {
    return {
        type: SWITCH_NSFW_FILTER,
        payload: tag
    };
};
