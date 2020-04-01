import home from '../../app/home/home.js'
import products from '../../app/products/products.js'
import productsCategories from '../../app/productCategories/productCategories.js'
import notFound from '../../app/notFound/notFound.js'

const components = [
    home, products, notFound, productsCategories
]

const objectFieldParser = {
    title: parseTitle,
    html: name => `${name}.html`,
    css: name => `${name}.css` 
}

function parseTitle(name) {
    const firstLetter = name.charAt(0)
    const nameArray = name.split('')
    nameArray[0] = firstLetter.toUpperCase()
    return nameArray.join('')
}

function parseComponents() {
    return components.map(component => {
        const { name } = component
        const keys = ['path', 'folder', 'title', 'html', 'css']
        
        keys.forEach(key => {
            if(component[key] === undefined) {
                const parser = key in objectFieldParser
                component[key] = parser ? 
                    objectFieldParser[key](name) : name
            }
        })

        return component
    })
}

export default parseComponents()