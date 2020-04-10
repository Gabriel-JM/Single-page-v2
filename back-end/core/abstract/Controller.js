const { EventEmitter } = require('events')
const StringParser = require('../stringParser/StringParser')

const stringParser = new StringParser()

const headers =  {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'OPTIONS, GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers' : '*',
    'Access-Control-Max-Age' : 2592000
}

const eventNames = ['get', 'post', 'put', 'delete', 'options']

class Controller extends EventEmitter {

    constructor(content, service = null) {
        super()
        this.req = content.req
        this.res = content.res
        this.content = content
        this.service = service
        this.event = null
        this.createEvents()
    }

    createEvents() {
       this.createEventNames()

        eventNames.forEach(event => {
            this.on(event, () => {
                const hasEvent = event in this
                if(!hasEvent) {
                    this.notFound()
                    this.res.end()
                    throw new Error('Event not Found!')
                }

                
                this[event]()
            })
        })
    }

    createEventNames() {
        const { pathArray, method } = this.content
        this.event = stringParser.createEventName(method, pathArray)

        if(!eventNames.includes(this.event)) {
            eventNames.push(this.event)
        }
    }

    verifyMethod() {
        const hasMethodEvent = eventNames.includes(this.event)
        
        return hasMethodEvent ? this.event : 'default'
    }

    async get() {
        const { query } = this.content

        if(query.id) {
            const result = await this.service.getOne(
                Number(query.id)
            )
            
            if(result) {
                this.ok()
                this.res.end(JSON.stringify(result))
            }

            this.notFound()
            this.res.end(
                this.returnMessage('Not found', false)
            )                    
        }

        const allItems = await this.service.getAll()

        this.ok()
        this.res.end(JSON.stringify(allItems))
    }

    async post() {
        if(this.postObject) {
            const postResult = await this.service.postOne(
                this.postObject
            )

            this.ok()
            this.res.end(JSON.stringify(postResult))
        }
        this.options()
        this.res.end()
    }

    async put() {
        const { body } = this.content
        const result = await this.service.putOne(body)

        if(result) {
            this.ok()
            this.res.end(JSON.stringify(result))
        }

        this.notFound()
        this.res.end(
            this.returnMessage('Not Found', false)
        )
    }

    async delete() {
        const { id } = this.content.query
        const deleteResult = await this.service.deleteOne(id)

        if(deleteResult.affectedRows) {
            this.ok()
            this.res.end(
                this.returnMessage('Successful delete!', true)
            )
        }

        this.notFound()
        this.res.end(
            this.returnMessage('Not found', false)
        )
    }

    default() {
        this.notAllowed()
        this.res.end(
            this.returnMessage('Method Not Allowed', false)
        )
    }

    ok() {
        this.res.writeHead(200, headers)
    }

    options() {
        this.res.writeHead(204, headers)
        this.res.end()
    }

    notAllowed() {
        this.res.writeHead(405, headers)
    }

    notFound() {
        this.res.writeHead(404, headers)
    }

    staticServe(contentType) {
        const customHeader = {
            ...headers,
            'Content-Type': contentType 
        }

        this.res.writeHead(200, customHeader)
    }

    returnMessage(message, status) {
        return JSON.stringify({
            message,
            ok: status
        })
    }

    setPostObject(callback) {
        this.postObject = callback() || null
        this.start()
    }

    start() {
        this.emit(this.verifyMethod())
    }

}

module.exports = Controller