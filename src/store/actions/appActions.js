import { proxyFetchBlob } from '../../tools/fetch'
import { toggle_proxy } from '../actionCreators/appActionCreators'
import crashlytics from '@react-native-firebase/crashlytics';
import DeviceInfo from 'react-native-device-info';
import { getWaitPromise } from '../../tools/tools';

const URL_FOR_PROXY_TEST = 'https://danbooru.donmai.us/'

export const checkProxy = () => {
    return async (dispatch, getState) => {
        let ignoreAnotherResult = false;
        return Promise.race([
            fetch(URL_FOR_PROXY_TEST).then(res => {
                if (ignoreAnotherResult) {
                    return;
                } else {
                    ignoreAnotherResult = true;
                }

                if (!res.ok) {
                    throw 'fetcherror'
                } else {
                    //changeFetchFunc(false)
                    dispatch(toggle_proxy(false))
                }
            }).catch(err => {
                //changeFetchFunc(proxyFetchBlob)
                dispatch(toggle_proxy(true))
            }),
            getWaitPromise(5000).then(() => {
                if (ignoreAnotherResult) {
                    return;
                } else {
                    ignoreAnotherResult = true;
                }
                dispatch(toggle_proxy(true))
            })
        ])
    }
}

export const initCrashlytics = () => {
    return async (dispatch, getState) => {
        crashlytics().log('User signed in.');
        await Promise.all([
            crashlytics().setUserId(DeviceInfo.getDeviceId()),
        ]);
    }
}

