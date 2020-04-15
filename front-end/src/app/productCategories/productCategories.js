import actions from './productsCategoriesActions.js'

export default {
    name: 'productCategories',
    css: false,
    title: 'Products Categories',
    path: 'products/categories',
    init
}

function init() {
    const addCategoryBtn = document.querySelector('[add-category]')
    const categoriesList = document.querySelector('[category-list]')

    actions.init(categoriesList)

    addCategoryBtn.addEventListener('click', () => {
        actions.enableForm()
    })
}