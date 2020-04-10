const fs = require('fs')
const path = require('path')
const StringParser = require('../stringParser/StringParser')

const stringParser = new StringParser()

function getControllersNames(dirName) {
    const pathString = path.join(__dirname, '..','..','app', 'src', dirName)
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
            const controllerName = stringParser.pascalCaseToDashCase(dirName)
            Object.assign(controllers, {
                [controllerName]: require(requirePath)
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
