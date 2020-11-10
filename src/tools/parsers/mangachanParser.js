import { parse as HTMLParse } from 'node-html-parser';
import { SORT_TYPES } from '../../store/constants/searchConstants'

let parser = {

}


parser.getTagsList = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);

        const tags = root.querySelectorAll(".sidetag")
            .map(tagRow => {
                const tag = {
                    name: tagRow.text.trim().slice(3).trim().slice(3).trim(),
                    codeName: tagRow.childNodes[1].getAttribute('href').slice(6)
                }

                return tag;
            })
        resolve({
            list: tags,
            activeIndex: []
        })
    })
}

parser.getStatuseslist = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);

        const statusContainer = root.querySelector(".only")
        let activeStatusIndex = 0
        let statusList = statusContainer.querySelectorAll("a")
            .map((statusItem, index) => {
                let path = statusItem.getAttribute('href').slice(9) + '/'
                if (path.length == 0) {
                    activeStatusIndex = index
                }
                return {
                    name: statusItem.text,
                    path,
                }
            })



        resolve({
            list: statusList,
            activeIndex: activeStatusIndex
        })
    })
}

parser.getSortList = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);

        const sortContainer = root.querySelector("#sort_by")
        let sortList = sortContainer.querySelectorAll("a")
            .map(sortItem => {
                let sortUrl = sortItem.getAttribute('href');
                let sortParams = sortUrl.slice(sortUrl.indexOf('&n=') + 3)
                let mainSort = sortParams.includes(SORT_TYPES.DESC) ? SORT_TYPES.DESC : SORT_TYPES.ASC

                return {
                    name: sortItem.text.trim(),
                    param: sortParams.slice(0, -mainSort.length),
                    mainSort: mainSort
                }
            })


        resolve({
            list: sortList,
            activeIndex: 0,
            activeSort: sortList[0].mainSort
        })
    })
}

parser.getListElements = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);
        let elements = root.querySelectorAll(".content_row").map(elementRow => {

            let imageContainer = elementRow.querySelector('.manga_images').querySelector('a').querySelector('img');
            let nameContainer = elementRow.querySelector('.manga_row1').querySelector('.title_link')

            return {
                image: imageContainer.getAttribute('src'),
                name: nameContainer.text,
                url: nameContainer.getAttribute('href')
            }

        })


        resolve(elements)
    })
}

parser.getMangaDescription = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);
        const descriptionTableRows = root.querySelector('.mangatitle').querySelectorAll('tr')

        let trDescriptionContainer = {}
        descriptionTableRows.forEach(trElement => {
            trDescriptionContainer[trElement.querySelector('.item').text] = trElement.querySelector('.translation') || trElement.querySelector('.item2')
        })

        const authorLine = trDescriptionContainer['Автор'].querySelectorAll('a').map(element => (
            element.text.trim()
        )).filter(element => element.length != 0).join(', ')

        const tagsLine = trDescriptionContainer['Тэги'].querySelectorAll('a').map(element => (
            element.text.trim()
        )).filter(element => element.length != 0).join(', ')

        const volumesLine = trDescriptionContainer['Статус (Томов)'].text;
        const chaptersLine = trDescriptionContainer['Загружено'].text;



        resolve({
            description: root.querySelector('#description').childNodes[0].text.trim(),
            authors: authorLine,
            tags: tagsLine,
            volumesCount: volumesLine.split(' ')[0],
            chaptersCount: chaptersLine.split(' ')[0],
            chaptersStatus: chaptersLine.split(',')[1].trim(),
            volumesStatus: volumesLine.split(',')[1].trim(),
        })
    })
}

parser.getMangaChapters = (html) => {
    return new Promise(resolve => {
        const root = HTMLParse(html);

        const rows = root.querySelectorAll('tr').filter(row => row.classNames.includes('zaliv') || row.classNames.includes('no_zaliv'))

        let chapters = rows.map(chapterRow => {
            return ({
                date: chapterRow.querySelector('.date').text,
                url: chapterRow.querySelector('.manga2').querySelector('a').getAttribute('href'),
                name: chapterRow.querySelector('.manga2').querySelector('a').text,
            })
        })
        resolve(chapters)
    })
}

parser.getMangaPages = html => {
    return new Promise(resolve => {
        const fullImageDef = '"fullimg":'
        let htmlCroppedForward = html.slice(html.indexOf(fullImageDef) + fullImageDef.length);
        let htmlCroppedBackward = htmlCroppedForward.slice(0, htmlCroppedForward.indexOf('\n'))

        let images = []
        try {
            images = JSON.parse(htmlCroppedBackward.trim())
        } catch (er) {
            images = JSON.parse(htmlCroppedBackward.trim().replace(',]', ']'))
        }
        resolve(images)
    })
}

parser.getMangaThumbs = html => {
    return new Promise(resolve => {
        const fullImageDef = '"thumbs":'
        let htmlCroppedForward = html.slice(html.indexOf(fullImageDef) + fullImageDef.length);
        let htmlCroppedBackward = htmlCroppedForward.slice(0, htmlCroppedForward.indexOf('\n'))

        let thumbs = []
        try {
            thumbs = JSON.parse(htmlCroppedBackward.trim())
        } catch (er) {
            thumbs = JSON.parse(htmlCroppedBackward.trim().slice(0, -1))
        }

        resolve(thumbs)
    })
}

export default parser;