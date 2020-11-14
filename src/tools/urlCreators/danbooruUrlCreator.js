let urlCreator = {};
const DOMAIN = 'https://danbooru.donmai.us/';

urlCreator.getPopularUrl = (date, page = 1) => {
    return `${DOMAIN}explore/posts/popular?date=${date}&scale=day&page=${page}`
}

urlCreator.getPostUrl = (_postUrl) => {
    if (_postUrl) {
        const postUrl = _postUrl.slice(_postUrl[0] == '/' ? 1 : 0)
        return `${DOMAIN}${postUrl}`
    } else {
        return undefined;
    }
}

export default urlCreator;