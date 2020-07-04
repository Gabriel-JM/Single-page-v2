export default class PageContentBuilder {
  
  constructor(contentsZone, componentContent, keyId) {
    this.contentsZone = contentsZone
    this.componentHtml = componentContent.html
    this.componentTitle = componentContent.title
    this.componentCss = componentContent.css
    this.componentScript = componentContent.init
    this.keyId = keyId
  }

  mount(makeAfterBuild = null) {
    this.setTitle()
    this.setHtml()
    this.setCss()
    this.loadScripts()

    makeAfterBuild && makeAfterBuild()
  }

  setHtml() {
    if(this.contentsZone) {
      this.contentsZone.innerHTML = this.componentHtml
    }
  }

  setTitle() {
    const pageTitle = document.head.querySelector('title')

    pageTitle.innerText = this.componentTitle
      ? `${this.componentTitle} | Document`
      : 'Document'
  }

  setCss() {
    const innerStyles = document.querySelectorAll('style')
    innerStyles.forEach(style => style.remove())
    
    if(this.componentCss) {
      const styleTag = document.createElement('style')
      styleTag.innerHTML = this.componentCss

      document.head.appendChild(styleTag)
    }
  }

  loadScripts(makeAfterBuild) {
    this.componentScript && this.componentScript(this.keyId)
  }

}
