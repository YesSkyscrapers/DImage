import { parse as HTMLParse } from 'node-html-parser';

const mangaChanSource = {
    url: "https://manga-chan.me",
    name: "Манга-чан",
    catalogUrl: "/catalog"
};

mangaChanSource.checkUrl = (url) => {
    return url.startsWith(url)
}

mangaChanSource.ping = () => {
    return fetch(mangaChanSource.url).then(response => {
        return response.ok;
    }).catch(err => false)
}

mangaChanSource.get = (url) => {
    return fetch(encodeURI(url)).then(response => {
        return response.text().then(html => {
            const root = HTMLParse(html);

            const tags = root.querySelectorAll(".content_row")
            const parsedTags = tags.map(tag => {
                const imageLink = tag.querySelector('.manga_images').querySelector('a')
                let newTagObject = {
                    status: {}
                };
                newTagObject.link = imageLink.getAttribute('href')
                newTagObject.image = imageLink.querySelector('img').getAttribute('src')
                newTagObject.title = tag.querySelector('.title_link').text
                const releaseTagText = tag.querySelector('.manga_row3').querySelector('.item2').childNodes[0].text
                const releaseText = releaseTagText.slice(releaseTagText.indexOf("\t") + 1);
                const translationText = tag.querySelector('.manga_row3').querySelector('.item2').querySelector('span').text
                newTagObject.status.release = (releaseText.split(', ')[1] || '').trim()
                newTagObject.status.volumes = releaseText.split(', ')[0]
                newTagObject.status.translation = (translationText.split(', ')[1] || '').trim()
                newTagObject.status.chapters = translationText.split(', ')[0]
                return newTagObject
            })

            return parsedTags;
        })
    })
}


export default mangaChanSource