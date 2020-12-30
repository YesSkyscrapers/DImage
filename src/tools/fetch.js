import RNFetchBlob from "rn-fetch-blob";
import { store } from "../store/store";

export const PROXY_URL = "http://95.217.166.144:3000/"

export const proxyableFetch = (...params) => {
    if (store.getState().app.useProxy) {
        return proxyFetch(...params)
    } else {
        return fetch(...params)
    }
}

export const proxyFetch = (url, params) => {
    return fetch(PROXY_URL, {
        ...params,
        headers: {
            ...(params?.headers),
            url,
        }
    })
}


export const proxyFetchBlob = (
    url,
    params = {},
    loadControlFunc = (() => ({}))
) => {
    return RNFetchBlob.config({
        fileCache: false
    }).fetch('GET', PROXY_URL, {
        ...params,
        "Cache-Control": 'no-store',
        url,
    }).progress(loadControlFunc)
}