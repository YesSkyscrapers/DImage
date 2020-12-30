/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, StatusBar, Platform, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store';
import AppRouter from './Router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

require('react-native').unstable_enableLogBox()

const statusBarBackground = Platform.OS === 'android' && Platform.Version < 23 ? "rgba(0,0,0,0.3)" : 'transparent'
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
const App = () => (
  <SafeAreaProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar
          translucent
          backgroundColor={statusBarBackground}
          barStyle="dark-content"
        />

        <AppRouter />
      </PersistGate>
    </Provider>
  </SafeAreaProvider>
);

export default App;






