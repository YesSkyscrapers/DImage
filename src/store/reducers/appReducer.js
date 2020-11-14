import { TOGGLE_PROXY, TOGGLE_TABBAR_VISIBILITY } from "../constants/appConstants";

const initialState = {
    isTabBarShow: true,
    useProxy: false
}

const appReducer = (app = initialState, action) => {
    switch (action.type) {
        case TOGGLE_TABBAR_VISIBILITY:
            return {
                ...app,
                isTabBarShow: action.payload == undefined ? (!app.isTabBarShow) : action.payload
            }
        case TOGGLE_PROXY:
            return {
                ...app,
                useProxy: action.payload
            }
        default:
            return app;
    }
};

export default appReducer;