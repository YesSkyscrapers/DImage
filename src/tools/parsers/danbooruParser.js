import { parse as HTMLParse } from 'node-html-parser';
import Clipboard from '@react-native-community/clipboard';


let parser = {

}

parser.getImagesFromPopularPage = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);

        const linkContainers = root.querySelectorAll('a').map(element => ({
            element,
            link: element.getAttribute('href'),
        }))
        const imageContainers = linkContainers.filter(linkInfo => linkInfo.element.querySelector('picture'))
        const imagesTagContainers = imageContainers.map(linkInfo => ({
            ...linkInfo,
            element: linkInfo.element.querySelector('img')
        }))
        const imagesTagWithoutVideoContentContainers = imagesTagContainers.filter(info => {
            return !info.element.getAttribute("title").split(' ').some(tag => tag == 'video')
        })
        const images = imagesTagWithoutVideoContentContainers.map(info => info.link);
        return resolve(images)
    })
}

parser.getPostInfo = (html, url) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);

        let postInfo = {}

        const imageContainer = root.querySelector('.image-container')
        const pictureContainer = imageContainer.querySelector('picture')
        if (!pictureContainer) {
            console.log("cant get image", url)
            Clipboard.setString(url);
        }
        //console.log(imageContainer.querySelector('picture'), `imageContainer.querySelector('picture')`, url)
        const imgContainer = pictureContainer.querySelector('img')
        postInfo.imageUrl = imgContainer.getAttribute('src')
        const originalSizeLink = root.querySelector(".image-view-original-link");
        if (originalSizeLink) {
            postInfo.imageUrl = originalSizeLink.getAttribute("href")
        }

        return resolve(postInfo)
    })
}


export default parser;