import HttpRequest from '../../core/httpRequest/HttpRequest.js'
const url = 'http://localhost:3100/products-categories'

export default {
  categoriesList: null,

  init(categoriesList) {
    this.categoriesList = categoriesList
    this.categoriesList.innerHTML = 'Loading...'
    this.fetchData()
  },

  async fetchData() {
    try {
      const http = new HttpRequest(url)
      const result = await http.get()

      this.fillList(result)
    } catch(err) {
      this.categoriesList.innerHTML = 'Error on Request'
      console.log(err)
    }
  },

  fillList(list) {
    // read about css style sheet object

    this.categoriesList.innerHTML = ''
    list.forEach(item => {
      const div = document.createElement('div')
      div.style.backgroundColor = item.color
      div.innerHTML = item.name

      this.categoriesList.appendChild(div)
    })

    if(!list.length) {
      this.categoriesList.innerHTML = 'No items!'
    }
  },

  enableForm(elementQuery) {
    const form = document.querySelector(elementQuery)
    form.classList.add('show-form')
  },

  disableForm(elementQuery) {
    const form = document.querySelector(elementQuery)
    form.classList.remove('show-form')
  }
}