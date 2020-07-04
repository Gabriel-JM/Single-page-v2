'use strict'

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

  async makeRequest(method, bodyContent = null, contentType = null, resType = null) {
    contentType = setDefaultContentType(contentType, method)
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

function setDefaultContentType(contentType, method) {
  const comparetion = (method == 'POST' || method == 'PUT') && contentType
  return comparetion ? contentType : {}
}

function getResponseMethod(responseType) {
  const methodName = {
    'application/octet-stream': 'arrayBuffer',
    'application/json': 'json',
    'multipart/form-data': 'formData'
  }

  let result = null

  if(responseType in methodName) {
    result = methodName[responseType]
  } else {
    const methodMap = [['image', 'blob'],['text', 'text']]
    
    methodMap.forEach(method => {
      if(RegExp(method[0]).test(responseType)) {
        result = method[1]
      }
    })
  }

  return result
}

export default HttpRequest
