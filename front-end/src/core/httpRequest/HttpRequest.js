'use strict'

const defaultComponentsUrl = `${location.origin}/src/app/`
const defaultContentType = {
    'Content-Type': 'application/json'
}

class HttpRequest {

    constructor(url = null) {
        this.url = url
    }

    setUrl(url) {
        this.url = url
        return this
    }

    async get(id = null) {
        if(id) this.setUrl(`${this.url}?id=${id}`)
        return await this.makeRequest('GET')
    }

    async post(bodyContent, contentType = defaultContentType) {
        return await this.makeRequest('POST', bodyContent, contentType)
    }

    async put(bodyContent, contentType = defaultContentType) {
        return await this.makeRequest('PUT', bodyContent, contentType)
    }

    async delete(id) {
        if(id) this.setUrl(`${this.url}?id=${id}`)
        return await this.makeRequest('DELETE')
    }

    async getComponent(component) {
        const result = {}

        this.setUrl(`${defaultComponentsUrl}${component.name}/${component.html}`)
        result.html = await this.makeRequest('GET', null, defaultContentType, 'text/html')
        
        if(component.css) {
            this.setUrl(`${defaultComponentsUrl}${component.name}/${component.css}`)
            result.css = await this.makeRequest('GET', null, defaultContentType, 'text/css')
        }

        return result
    }

    async makeRequest(method, bodyContent = null, contentType = defaultContentType, resType = null) {
        const headers = { method, ...contentType }

        if(bodyContent) {
            headers.body = JSON.stringify(bodyContent)
        }

        try {
            const response = await fetch(this.url, headers)
            const responseType = resType || response.headers.get('Content-Type')
            const method = getResponseMethod(responseType)

            const data = await response[method]()

            return data
        } catch(err) {
            console.error(err)
        }
    }

}

export default HttpRequest

function getResponseMethod(responseType) {
    const methodName = {
        'application/octet-stream': 'arrayBuffer',
        'image/png': 'blob',
        'image/gif': 'blob',
        'image/jpeg': 'blob',
        'image/x-icon': 'blob',
        'image/svg+xml': 'blob',
        'application/json': 'json',
        'text/plain': 'text',
        'text/html': 'text',
        'text/css': 'text',
        'text/js': 'text',
        'multipart/form-data': 'formData'
    }

    return methodName[responseType]
}