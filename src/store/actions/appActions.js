import { changeFetchFunc } from 'react-native-cache-control-image'
import { proxyFetchBlob } from '../../tools/fetch'
import { toggle_proxy } from '../actionCreators/appActionCreators'


const URL_FOR_PROXY_TEST = 'https://danbooru.donmai.us/'

export const checkProxy = () => {
    return async (dispatch, getState) => {
        return fetch(URL_FOR_PROXY_TEST).then(res => {
            if (!res.ok) {
                throw 'fetcherror'
            } else {
                changeFetchFunc(false)
                dispatch(toggle_proxy(false))
            }
        }).catch(err => {
            changeFetchFunc(proxyFetchBlob)
            dispatch(toggle_proxy(true))
        })
    }
}

