const fs = require('fs')
const path = require('path')

function getControllersNames(dirName) {
    const pathString = path.join(__dirname, '..', '..', 'src', dirName)
    const dirFiles = fs.readdirSync(pathString)

    const controllersFile = dirFiles.filter(fileName => (
        fileName == `${dirName}Controller.js`
    ))

    return controllersFile.map(fileName => fileName.split('.')[0])
}

function createTheObject(srcDirs, srcDirPath) {
    const controllers = {}

    srcDirs.forEach(dirName => {
        const fileName = `${dirName}Controller`
        const requirePath = path.join(srcDirPath, dirName, fileName)
        const existsPath = fs.existsSync(`${requirePath}.js`)

        if(existsPath) {
            Object.assign(controllers, {
                [dirName.toLowerCase()]: require(requirePath)
            })
        }
    })

    return controllers
}

function buildObject(srcDirPath) {

    const srcDirs = fs.readdirSync(srcDirPath)

    const names = srcDirs.map(getControllersNames).flat()

    return createTheObject(srcDirs, srcDirPath, names)
}

module.exports = buildObject
