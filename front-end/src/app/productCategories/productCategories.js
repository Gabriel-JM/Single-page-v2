export default {
    name: 'productCategories',
    css: false,
    title: 'Products Categories',
    path: 'products/categories',
    init() {
        const addCategorieBtn = document.querySelector('[add-category]')
        const categoryList = document.querySelector('[category-list]')
        
        addCategorieBtn.addEventListener('click', () => {
            categoryList.innerHTML = (`
                <h1>HI</h1>
            `)
        })
    }
}