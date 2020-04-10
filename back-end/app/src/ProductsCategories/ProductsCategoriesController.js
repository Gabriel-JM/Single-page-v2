const Controller = require('../../../core/abstract/Controller')
const productsCategoriesService = new (require('./ProductsCategoriesService'))()

class ProductsCategoriesController extends Controller {

    constructor(content) {
        super(content, productsCategoriesService)
        this.setPostObject(() => {
            const { name, color } = this.content.body

            return { name, color }
        })
    }

}

module.exports = ProductsCategoriesController
