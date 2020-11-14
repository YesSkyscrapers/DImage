import { proxyableFetch } from '../fetch'

export const getHtmlFromUrl = (url) => {
    return proxyableFetch(encodeURI(url)).then(response => {
        return response.text();
    })
}

export const mergeActiveUrlAndSubUrl = (activeUrl, subUrl) => {
    let porotocalEndIndex = activeUrl.includes('https://') ? 8 : activeUrl.includes('http://') ? 7 : 0
    let domainEndIndex = activeUrl.slice(porotocalEndIndex).indexOf('/');
    let domain = activeUrl.slice(0, porotocalEndIndex + domainEndIndex)
    let mangaUrl = domain + subUrl

    return mangaUrl
}