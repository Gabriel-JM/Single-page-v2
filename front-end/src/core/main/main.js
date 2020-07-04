'use strict'
import componentsService from './componentsService/componentsService.js'
import PageContentBuilder from './PageContentBuilder/PageContentBuilder.js'
import getComponent from './componentExtractor/componentExtractor.js'
import menu from '../menu/menu.js'

const { pathname } = window.location
let currentPath = null
let componentsCache = []
const componentsPaths = componentsService.map(({path}) => path)
const zoneOfPageContents = document.querySelector('[main]')

window.onpopstate = event => {
  const { state } = event
  const path = state ? state.path : 'home'
  const keyId = state ? state.keyId : null
  showPage(path, keyId, true)
}

function addRouteEvent() {
  document.querySelectorAll('[link]').forEach(link => {
    if(!link.onclick) {
      link.onclick = e => {
        e.stopPropagation()

        const linkToPage = getLinkToPageAttributes(link)
        const route = linkToPage.link || 'home'

        showPage(route, linkToPage.keyId)
      }
    }
  })
}

function getLinkToPageAttributes(link) {
  const linkObj = { link: null, keyId: null }

  Object.keys(linkObj).forEach(attr => {
    const hasAttr = link.hasAttribute(attr)
    if(hasAttr) {
      linkObj[attr] = link.getAttribute(attr)
    }
  })

  return linkObj
}

function showPage(route, keyId = null, usingHistory = false) {
  const isTheCurrentPath = currentPath == route
  const hasPath = componentsPaths.includes(route)
  
  if(hasPath && !usingHistory) {
    const method = isTheCurrentPath && !usingHistory ? 'replaceState' : 'pushState'

    if(!isTheCurrentPath) currentPath = route

    history[method]({ path: route, keyId }, null, `/${route}`)
  }

  !isTheCurrentPath && loadPageContent(route, keyId)
}

async function loadPageContent(path, keyId) {
  const componentContent = await getPageContent(path)

  if(componentContent) {
    const builder = new PageContentBuilder(
      zoneOfPageContents,
      componentContent,
      keyId
    )

    builder.mount(() => {
      menu.setCurrentPage(path)
      currentPath = path
      addRouteEvent()
    })
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
    if(componentsPaths.includes(path)) {
      const component = componentsService.find(findByPath)
      const result = await getComponent(component)

      const newComponent = { ...component, ...result }

      componentsCache.push(newComponent)
      return newComponent
    }
  }
  return null
}

function notFound() {
  zoneOfPageContents && showPage('not-found')
}

(function init() {
  menu.startMenu()
  const page = pathname != '/' ? pathname.slice(1) : 'home'
  currentPath = page
  loadPageContent(page)
})()