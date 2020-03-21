'use strict'
import componentsService from './componentsService.js'
import HttpRequest from '../httpRequest/HttpRequest.js'
import menu from './menu/menu.js'

menu.startMenu()

const http = new HttpRequest()

const { pathname } = window.location
let currentPath = null
let componentsCache = []
const zoneOfPageContents = document.querySelector('[main]')

window.onpopstate = event => {
    const { state } = event
    state && showPage(state.path, state.keyId)
}

function addRouteEvent() {
    document.querySelectorAll('[link]').forEach(link => {
        link.addEventListener('click', e => {
            e.stopPropagation()

            const linkToPage = getLinkToPageAttributes(link)
            const route = linkToPage.link || 'home'

            showPage(route, linkToPage.keyId)
        })
    })
}

function getLinkToPageAttributes(link) {
    const linkObj = {}
    const attrs = ['link', 'keyId']

    attrs.forEach(attr => {
        const hasAttr = link.hasAttribute(attr)
        const attrValue = hasAttr && link.getAttribute(attr)
        linkObj[attr] = hasAttr ? attrValue : null
    })

    return linkObj
}

function showPage(route, keyId = null) {
    const method = currentPath == route ? 'replaceState' : 'pushState'
    
    if(method == 'pushState') currentPath = route

    history[method]({ path: route, keyId }, null, `/${route}`)
    method == 'pushState' && loadPageContent(route, keyId)
}

async function loadPageContent(path, keyId) {
    const componentContent = await getPageContent(path)

    if(componentContent) {
        const {html, title, css, init} = componentContent

        setHtmlAndTitle(html, title)
        setCss(css)
        loadScript(init, keyId)
        menu.setCurrentPage(path)
    } else {
        notFound()
    }
}

async function getPageContent(path) {
    const findByPath = comp => comp.path === path
    const existingComponent = componentsCache.find(findByPath)

    if(existingComponent) {
        return existingComponent
    }
    else {
        const componentsPaths = componentsService.map(({path}) => path)
        if(componentsPaths.includes(path)) {
            const component = componentsService.find(findByPath)
            const result = await http.getComponent(component)
    
            const newComponent = { ...component, ...result }

            componentsCache.push(newComponent)
            return newComponent
        }
    }
    return null
}

function setHtmlAndTitle(html, title) {
    if(zoneOfPageContents) {
        setTitle(title)
        zoneOfPageContents.innerHTML = html
    }
}

function setTitle(title = null) {
    const pageTitle = document.head.querySelector('title')
    if(title) {
        pageTitle.innerText = `${title} | Document`
    } else {
        pageTitle.innerText = 'Document'
    }
}

function setCss(css) {
    const innerStyles = document.querySelectorAll('style')
    innerStyles.forEach(style => style.remove())
    
    if(css) {
        const styleTag = document.createElement('style')
        styleTag.innerHTML = css

        document.head.appendChild(styleTag)
    }
}

function loadScript(init, keyId = null) {
    init && init(keyId)
    addRouteEvent()
}

function notFound() {
    if(zoneOfPageContents) {
        showPage('not-found')
    }
}

(function init() {
    const page = pathname != '/' ? pathname.slice(1) : 'home'
    currentPath = page
    loadPageContent(page)
})()