import parseComponents from './parseComponentsObj.js'

import home from '../../../app/home/home.js'
import products from '../../../app/products/products.js'
import productsCategories from '../../../app/productCategories/productCategories.js'
import notFound from '../../../app/notFound/notFound.js'

const components = [
  home, products, notFound, productsCategories
]

export default parseComponents(components)