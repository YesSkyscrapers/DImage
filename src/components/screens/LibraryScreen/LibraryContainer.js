import React from 'react';
import LibraryComponent from './LibraryComponent';
import { preload, changeFetchFunc } from 'react-native-cache-control-image'
import RNFetchBlob from 'rn-fetch-blob';

const urls = [
    'https://danbooru.donmai.us/data/sample/__original_drawn_by_akina_t__sample-f472d9ca7757e12d209757cfc653ff13.jpg',
    'https://danbooru.donmai.us/data/sample/__hornet_kantai_collection_drawn_by_kusaka_souji__sample-b04767c0136d2922cf9c30fff5396293.jpg',
    'https://wallpaperaccess.com/full/508751.jpg'
]

const URL_FOR_PROXY_TEST = 'https://danbooru.donmai.us/'

class LibraryContainer extends React.PureComponent {

    state = {
        activedUrls: [],
        activedUrls2: [],
        useProxy: false
    }

    componentDidMount() {
        fetch(URL_FOR_PROXY_TEST).then(res => {
            if (!res.ok) {
                throw 'fetcherror'
            }
        }).catch(err => {
            this.setState({ useProxy: true }, () => {
                changeFetchFunc(this.proxyFetch)
            })
        })
    }

    proxyFetch = (
        url,
        params = {},
        loadControlFunc = (() => ({}))
    ) => {
        return RNFetchBlob.config({
            fileCache: false
        }).fetch('GET', "http://95.217.166.144:3000/", {
            "url": url,
            "Cache-Control": 'no-store',
            ...params
        }).progress(loadControlFunc)
    }

    preload = (index, i) => {
        preload(urls[index]).then(console.log)
    }

    open = (index, i) => {
        let newUrls = [...(i == 1 ? this.state.activedUrls : this.state.activedUrls2)]
        newUrls.push(index)
        this.setState(i == 1 ? {
            activedUrls: newUrls
        } : {
                activedUrls2: newUrls
            })
    }

    close = (index, i) => {
        let newUrls = this.state.activedUrls.filter(i => i != index)
        this.setState(i == 1 ? {
            activedUrls: newUrls
        } : {
                activedUrls2: newUrls
            })
    }


    render() {
        return (
            <LibraryComponent
                useProxy={this.state.useProxy}
                activedUrls={this.state.activedUrls}
                urls={urls}
                preload={this.preload}
                open={this.open}
                close={this.close}
                activedUrls2={this.state.activedUrls2}
            />
        )
    }
}

export default LibraryContainer;