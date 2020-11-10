import { TOGGLE_TABBAR_VISIBILITY } from "../constants/appConstants";

export const toggle_tabbar_visibility = (newState = true) => ({
    type: TOGGLE_TABBAR_VISIBILITY,
    payload: newState
})