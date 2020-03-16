const { pathname } = window.location

window.onpopstate = e => {
    const { state } = e

    state && loadPageContent(state.page)
}

function addRouteEvent() {
    document.querySelectorAll('[link-to]').forEach(link => {
        link.addEventListener('click', e => {
            e.stopPropagation()
            const page = link.getAttribute('link-to')
            history.pushState({ page }, null, page)
            loadPageContent(page)
        })
    })
}

function loadPageContent(pageName) {
    document.querySelector('h1').innerHTML = pageName
}

(function init() {
    addRouteEvent()
    const page = pathname != '/' ? pathname.slice(1) : 'home'
    loadPageContent(page)
})()