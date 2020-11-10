import { TOGGLE_TABBAR_VISIBILITY } from "../constants/appConstants";

const initialState = {
    isTabBarShow: true
}

const appReducer = (app = initialState, action) => {
    switch (action.type) {
        case TOGGLE_TABBAR_VISIBILITY:
            return {
                ...app,
                isTabBarShow: action.payload
            }
        default:
            return app;
    }
};

export default appReducer;