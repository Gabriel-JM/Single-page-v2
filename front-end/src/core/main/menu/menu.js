const menu = {
    open: document.querySelector('i.menu-icon.open'),
    close: document.querySelector('i.menu-icon.close'),
    container: document.querySelector('.menu-container'),
    itself: document.querySelector('nav.menu'),
    links: document.querySelectorAll('.menu-list>li[link]')
}

export default {
    startMenu() {

        const setHideMenuAnimation = () => {
            menu.itself.classList.add('hide-menu')
        }

        menu.open.addEventListener('click', () => {
            menu.container.classList.add('show-block')
        })
    
        menu.close.addEventListener('click', setHideMenuAnimation)
    
        menu.container.addEventListener('click', setHideMenuAnimation)

        menu.links.forEach(link => {
            link.addEventListener('click', setHideMenuAnimation)
        })
    
        menu.itself.addEventListener('animationend', e => {
            if(e.animationName == 'hide-menu') {
                menu.container.classList.remove('show-block')
                menu.itself.classList.remove('hide-menu')
            }
        })
    
    },

    setCurrentPage(pageName) {
        pageName = pageName == 'home' ? '' : `=${pageName}`
        const currentPageLink = document.querySelector('.menu-list>li.active')
        const queryNewPageLink = `.menu-list>li[link${pageName}]`
        const link = document.querySelector(queryNewPageLink)

        if(link) {
            currentPageLink && currentPageLink.classList.remove('active')
            link.classList.add('active')
        }
    }
}