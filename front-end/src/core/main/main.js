'use strict'
import componentsService from './componentsService.js'
import HttpRequest from '../httpRequest/HttpRequest.js'

const http = new HttpRequest()

const { pathname } = window.location
let currentPage = null
let componentsCache = []

window.onpopstate = event => {
    const { state } = event
    state && loadPageContent(state.page)
}

function addRouteEvent() {
    document.querySelectorAll('[link]').forEach(link => {
        link.addEventListener('click', e => {
            e.stopPropagation()

            const page = link.getAttribute('link')
            const route = {
                page: page || 'home',
                path: page || '/'
            }

            showPage(route)
        })
    })
}

function showPage(route) {
    const method = currentPage == route.page ? 'replaceState' : 'pushState'
    
    if(method == 'pushState') currentPage = route.page

    history[method](route, null, route.path)
    loadPageContent(route.page)
}

async function loadPageContent(pageName) {
    if(pageName in componentsService) {
        const component = componentsService[pageName]
        const result = await http.getComponent(component)

        console.log(result)
    }
}

(function init() {
    addRouteEvent()
    const page = pathname != '/' ? pathname.slice(1) : 'home'
    currentPage = page
    loadPageContent(page)
})()