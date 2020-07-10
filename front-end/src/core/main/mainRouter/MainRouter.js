'use strict'
import componentsService from '../../componentsService/componentsService.js'
import PageContentBuilder from '../PageContentBuilder/PageContentBuilder.js'
import historyRouting from './historyRouting.js'
import { loadComponentContent } from '../componentsStorage/componentsStorage.js'

class MainRouter {
  currentPath = null
  componentsRoot = document.querySelector('[main]') || document.body
  componentsPaths = componentsService.map(component => component.path)
  callbacks = {}

  addRoutingEvent() {
    document.querySelectorAll('[link]').forEach(linkElem => {
      if(!linkElem.onclick) {
        linkElem.onclick = e => {
          e.stopPropagation()
  
          const routeInfo = this.getElementRoutingAttributes(linkElem)
          const route = routeInfo.link || '/'
  
          this.verifyRoute(route, routeInfo.keyId)
        }
      }
    })
  }

  getElementRoutingAttributes(elem) {
    const linkObj = { link: null, keyId: null }

    Object.keys(linkObj).forEach(attr => {
      const hasAttr = elem.hasAttribute(attr)
      if(hasAttr) {
        linkObj[attr] = elem.getAttribute(attr)
      }
    })

    return linkObj
  }

  verifyRoute(route, keyId = null, usingHistory = false) {
    const { beforeInit } = this.callbacks
    beforeInit && beforeInit(route, keyId, usingHistory)

    const isTheCurrentPath = this.currentPath == route
    const hasPath = this.componentsPaths.includes(route)
    
    if(hasPath && !usingHistory) {
      const method = (
        isTheCurrentPath && !usingHistory ? 'replaceState' : 'pushState'
      )

      if(!isTheCurrentPath) this.currentPath = route

      history[method]({ path: route, keyId }, null, route)
    }

    !isTheCurrentPath && this.loadPageContent(route, keyId)
  }

  async loadPageContent(path, keyId = null) {
    const componentContent = await loadComponentContent(path)

    if(!componentContent) return this.notFound()

    const { afterMountComponent } = this.callbacks
    const builder = new PageContentBuilder(
      this.componentsRoot,
      componentContent,
      keyId
    )

    builder.mount(() => {
      afterMountComponent && afterMountComponent(path, keyId)
      this.currentPath = path
      this.addRoutingEvent()
    })
  }

  notFound() {
    this.componentsRoot && this.verifyRoute('/not-found')
  }

}

const mainRouter = new MainRouter()

export default {
  init(path = location.pathname) {
    historyRouting()
    mainRouter.verifyRoute(path)
  },

  showPageByHistory(path, keyId) {
    const isUsingHistory = true
    mainRouter.verifyRoute(path, keyId, isUsingHistory)
  },

  events({ afterMountComponent, beforeInit } = {}) {
    mainRouter.callbacks = {
      beforeInit,
      afterMountComponent
    }
  }
}
