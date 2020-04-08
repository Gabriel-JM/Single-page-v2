const Url = require('url')
const appRouter = require('../../app/appRouter')

async function handleRequests(req, res) {
    const { url, method, headers } = req
    const { pathname, query } = Url.parse(url, true)

    const pathArray = pathname.split('/').slice(1)

    const body = await getBodyContent(req)

    const content = {
        req, res,
        url, method,
        query, pathArray,
        headers, body
    }

    appRouter(content)
}

function getBodyContent(req) {
    try {
        const result = loadBodyContent(req)

        return result
    } catch(err) {
        throw console.error(err)
    }
}

function loadBodyContent(req) {
    return new Promise((resolve, reject) => {
        let body = []

        req.on('error', err => reject(err))

        req.on('data', chunk => { body = [...body, chunk] })

        req.on('end', () => {
            body = Buffer.concat(body).toString()

            if(!body) resolve(null)

            resolve(JSON.parse(body))
        })
    })
}

module.exports = handleRequests
