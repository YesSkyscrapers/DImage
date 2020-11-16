/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { Router, Stack, Scene, Tab, Actions } from 'react-native-js-navigator'
import SearchContainer from './components/screens/SearchScreen/SearchContainer'
import FeedContainer from './components/screens/FeedScreen/FeedContainer'
import TabBar from './TabBar';
import { faBookOpen, faSearch, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import MangaContainer from './components/screens/MangaScreen/MangaContainer';
import MangaReaderContainer from './components/screens/MangaReaderScreen/MangaReaderContainer';
import NewMangaReaderComponent from './components/screens/NewMangaReaderScreen/NewMangaReaderComponent';
import ProfileContainer from './components/screens/ProfileScreen/ProfileContainer';
import LoadingContainer from './components/screens/LoadingScreen/LoadingContainer';


const backAndroidHandler = () => {
    const scene = Actions.currentScene;
    Actions.pop();
    return true;
};


export default AppRouter = () => {

    return (
        <Router backAndroidHandler={backAndroidHandler}>
            <Stack key="_root" icon={faBookOpen} >
                <Scene key="loading" component={LoadingContainer} />
                <Tab key="main" TabComponent={<TabBar />}>
                    <Stack key="libraryTab" title="Библиотека" icon={faBookOpen} >
                        <Scene key="library" component={FeedContainer} />
                    </Stack>
                    <Stack key="profileTab" title="Профиль" icon={faUserAlt} >
                        <Scene key="profile" component={ProfileContainer} />
                    </Stack>
                    {/* <Stack key="searchTab" title="Поиск" icon={faSearch}>
                    <Scene key="search" component={SearchContainer} />
                    <Scene key="manga" component={MangaContainer} />
                    <Scene key="mangaReader" component={MangaReaderContainer} />
                    <Scene key="newMangaReader" component={NewMangaReaderComponent} />
                </Stack> */}
                </Tab>
            </Stack>

        </Router>
    )
}


