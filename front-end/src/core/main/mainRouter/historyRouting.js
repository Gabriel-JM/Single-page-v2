import mainRouter from './MainRouter.js'

export default () => {
  window.onpopstate = event => {
    const { state } = event
    const path = state ? state.path : '/'
    const keyId = state ? state.keyId : null
    mainRouter.showPageByHistory(path, keyId)
  }
}
