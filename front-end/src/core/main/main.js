'use strict'
import componentsService from './componentsService/componentsService.js'
import HttpRequest from '../httpRequest/HttpRequest.js'
import menu from '../menu/menu.js'

menu.startMenu()

const http = new HttpRequest()

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
    const hasAttr = link.attributes[attr]
    if(hasAttr) {
      linkObj[attr] = link.attributes[attr]
    }
  })

  return linkObj
}

function showPage(route, keyId = null, usingHistory = false) {
  const isTheCurrentPath = currentPath == route
  const hasPath = componentsPaths.includes(route)
  
  if(hasPath && !usingHistory) {
    const method = isTheCurrentPath && !goBack ? 'replaceState' : 'pushState'

    if(!isTheCurrentPath) currentPath = route

    history[method]({ path: route, keyId }, null, `/${route}`)
  }

  !isTheCurrentPath && loadPageContent(route, keyId)
}

async function loadPageContent(path, keyId) {
  const componentContent = await getPageContent(path)

  if(componentContent) {
    import PageContentBuilder from './PageContentBuilder/PageContentBuilder.js'

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
}

function notFound() {
  zoneOfPageContents && showPage('not-found')
}

(function init() {
  const page = pathname != '/' ? pathname.slice(1) : 'home'
  currentPath = page
  loadPageContent(page)
})()