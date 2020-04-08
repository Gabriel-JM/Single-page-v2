const path = require('path')
const controllersImportBuilder = require('../core/controllersImportBuilder/ControllersImportBuilder')

const srcDirPath = path.join(__dirname, 'src')

const controllers = {
    'products-categories': require('./src/ProductsCategories/ProductsCategoriesController'),
    ...controllersImportBuilder(srcDirPath)
}

function appRouter(content) {
    const [ origin ] = content.pathArray
    const hasPath = origin in controllers

    hasPath ? new controllers[origin](content) : notFound(content.res)
}

function notFound(res) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
        message: 'Path not found',
        ok: false
    }))
}

module.exports = appRouter