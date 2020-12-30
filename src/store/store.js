import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import secureReducer from './reducers/secureReducer';
import createSensitiveStorage from "redux-persist-sensitive-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import persistSessionReducer from './reducers/persistSessionReducer';
import appReducer from './reducers/appReducer';
import feedReducer from './reducers/feedReducer';

const secureStorage = createSensitiveStorage({
    keychainService: "dimageKeychain",
    sharedPreferencesName: "dimagePref"
});

const rootPersistConfig = {
    timeout: 0,
    key: 'root',
    whitelist: ['persistSession', 'feed'],
    storage: AsyncStorage
}

const securePersistConfig = {
    timeout: 0,
    key: 'secure',
    storage: secureStorage
}

const rootReducer = combineReducers({
    app: appReducer,
    feed: feedReducer,
    persistSession: persistSessionReducer,
    secure: persistReducer(securePersistConfig, secureReducer),
});

const persistRootReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = createStore(persistRootReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
