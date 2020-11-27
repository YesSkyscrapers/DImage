const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter name of screen (Feed, News and etc.): ', (answer) => {

    const end = message => {

        console.log(message);
        rl.close();
    }

    let screenName = answer;
    let screenDir = `src/components/screens`
    let dir = `${screenDir}/${screenName}Screen`

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        let copyItems = ['Container', 'Component', 'Item']


        copyItems.forEach(item => {
            let finalFile = `${dir}/${screenName}${item}.js`
            fs.copyFileSync(`${screenDir}/ScreenTemplate/${item}.js`, finalFile)

            copyItems.forEach(itemForReplace => {
                let content = fs.readFileSync(finalFile, { encoding: 'utf-8' });
                let newContentSplitted = content.split(itemForReplace)
                newContentSplitted = newContentSplitted.map((contentPart, index) => {
                    if (index == newContentSplitted.length - 1) {
                        return contentPart
                    } else {
                        if (contentPart.slice(-4) !== 'Pure')
                            return `${contentPart}${screenName}${itemForReplace}`
                        else
                            return `${contentPart}${itemForReplace}`
                    }
                })
                fs.writeFileSync(finalFile, newContentSplitted.join(``), { encoding: 'utf-8' })
            })
        })
        end(`Success created screen: ${answer}`)
    } else {
        end('Screen existed')
    }
});