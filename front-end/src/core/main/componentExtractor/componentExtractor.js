import HttpRequest from '../../httpRequest/HttpRequest.js'

const http = new HttpRequest()
const defaultComponentsUrl = `${location.origin}/src/app/`

export default async function getComponent(component) {
  const baseUrl = `${defaultComponentsUrl}${component.folder}`
  const result = {}

  http.setUrl(`${baseUrl}/${component.html}`)
  const htmlResult = await http.makeRequest('GET', null, null, 'text/html')
  result.html = minifyHTML(htmlResult)
  
  if(component.css) {
    http.setUrl(`${baseUrl}/${component.css}`)
    const cssResult = await http.makeRequest('GET', null, null, 'text/css')
    result.css = minifyCSS(cssResult)
  }

  return result
}

function minifyHTML(data) {
  // Last Reg Exp /(?<=[^\w(á-ú)"<])\s+/
  const regex = /(?=[>|\n])\s+|\r+/g
  return data.replace(regex, "")
}

function minifyCSS(data) {
  const regex = /(?=[{|}|;|\n])\s+|\r+/g
  return data
    .replace(regex, "")
    .replace(/(:)\s/g, "$1")
    .replace(/\s({)/g, "$1")
}
