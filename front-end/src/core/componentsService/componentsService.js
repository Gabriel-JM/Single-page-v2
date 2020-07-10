import parseComponents from '../main/componentsParser/componentsParser.js'

import home from '../../app/home/home.js'
import products from '../../app/products/products.js'
import productsCategories from '../../app/productCategories/productCategories.js'
import notFound from '../../app/notFound/notFound.js'
import lists from '../../app/lists/lists.js'

const components = [
  home, products, notFound, productsCategories, lists
]

export default parseComponents(components)
