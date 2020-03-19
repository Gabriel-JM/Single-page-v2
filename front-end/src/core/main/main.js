'use strict'
import componentsService from './componentsService.js'
import HttpRequest from '../httpRequest/HttpRequest.js'
import menu from './menu/menu.js'

menu.startMenu()

const http = new HttpRequest()

const { pathname } = window.location
let currentPage = null
let componentsCache = []
const zoneOfPageContents = document.querySelector('[main]')

window.onpopstate = event => {
    const { state } = event
    state && loadPageContent(state.page)
}

function addRouteEvent() {
    document.querySelectorAll('[link]').forEach(link => {
        link.addEventListener('click', e => {
            e.stopPropagation()

            const linkToPage = getLinkToPageAttributes(link)
            const route = {
                page: linkToPage.link || 'home',
                path: linkToPage.link || '/'
            }

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

function showPage(route, keyId) {
    const method = currentPage == route.page ? 'replaceState' : 'pushState'
    
    if(method == 'pushState') currentPage = route.page

    history[method](route, null, route.path)
    method == 'pushState' && loadPageContent(route.page, keyId)
}

async function loadPageContent(pageName, keyId) {
    const componentContent = await getPageContent(pageName)

    if(componentContent) {
        const {html, title, css, init} = componentContent

        setHtmlAndTitle(html, title)
        setCss(css)
        loadScript(init, keyId)
        menu.setCurrentPage(pageName)
    } else {
        notFound()
    }
}

async function getPageContent(pageName) {
    const existingComponent = componentsCache.find(comp => (
        comp.name === pageName
    ))

    if(existingComponent) {
        return existingComponent
    }
    else {
        if(pageName in componentsService) {
            const component = componentsService[pageName]
            const result = await http.getComponent(component)
    
            const newComponentObj = {
                name: pageName,
                html: result.html,
                title: component.title,
                css: result.css || null,
                init: component.init
            }

            componentsCache.push(newComponentObj)
            return newComponentObj
        }
    }
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
    if(css) {
        const innerStyles = document.querySelectorAll('style')
        innerStyles.forEach(style => style.remove())

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
        setTitle('Not Found')
        zoneOfPageContents.innerHTML = '<h1>Not Found</h1>'
    }
}

(function init() {
    const page = pathname != '/' ? pathname.slice(1) : 'home'
    currentPage = page
    loadPageContent(page)
    addRouteEvent()
})()