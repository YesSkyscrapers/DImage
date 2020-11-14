import {
    TOGGLE_TABBAR_VISIBILITY,
    TOGGLE_PROXY,
} from "../constants/appConstants";

export const toggle_tabbar_visibility = (newState) => ({
    type: TOGGLE_TABBAR_VISIBILITY,
    payload: newState
})
export const toggle_proxy = (newState = false) => ({
    type: TOGGLE_PROXY,
    payload: newState
})