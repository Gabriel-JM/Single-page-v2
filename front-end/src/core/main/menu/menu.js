export default function startMenu() {

    const menu = {
        open: document.querySelector('i.menu-icon.open'),
        close: document.querySelector('i.menu-icon.close'),
        container: document.querySelector('.menu-container'),
        itself: document.querySelector('nav.menu')
    }

    menu.open.addEventListener('click', () => {
        menu.container.classList.add('show-block')
    })

    menu.close.addEventListener('click', () => {
        menu.itself.classList.add('hide-menu')
    })

    menu.container.addEventListener('click', () => {
        menu.itself.classList.add('hide-menu')
    })

    menu.itself.addEventListener('animationend', e => {
        if(e.animationName == 'hide-menu') {
            menu.container.classList.remove('show-block')
            menu.itself.classList.remove('hide-menu')
        }
    })

}