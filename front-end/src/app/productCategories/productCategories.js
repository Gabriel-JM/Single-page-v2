import actions from './productsCategoriesActions.js'

export default {
  name: 'productCategories',
  title: 'Products Categories',
  path: 'products/categories',
  init
}

function init() {
  const addCategoryBtn = document.querySelector('[add-category]')
  const categoriesList = document.querySelector('[category-list]')
  const closeFormBtn = document.querySelector('[close-form]')
  const formQuery = '[floating-form]'
  const floatingForm = document.querySelector(formQuery)

  actions.init(categoriesList)

  addCategoryBtn.addEventListener('click', () => {
    actions.enableForm(formQuery)
  })

  closeFormBtn.addEventListener('click', () => {
    actions.disableForm(formQuery)
  })

  floatingForm.addEventListener('submit', event => {
    event.preventDefault()
  })
}