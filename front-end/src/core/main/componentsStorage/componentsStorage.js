import componentsService from '../../componentsService/componentsService.js'
import getComponent from '../componentExtractor/componentExtractor.js'

const componentsPaths = componentsService.map(({ path }) => path)
let componentsCache = '[]'

export const retriveFromCache = callback => {
  const cache = JSON.parse(componentsCache)
  const item = cache.find(callback)

  return item
}

export const insertOnCache = newItem => {
  const cache = JSON.parse(componentsCache)
  const componentsList = [...cache, newItem]
  componentsCache = JSON.stringify(componentsList)
}

export async function loadComponentContent(path) {
  const findByPath = comp => comp.path === path
  const existingComponent = retriveFromCache(findByPath)

  if(existingComponent) return existingComponent
  if(!componentsPaths.includes(path)) return null
  
  const componentInfo = componentsService.find(findByPath)
  const component = await getComponent(componentInfo)

  const newComponent = { ...componentInfo, ...component }

  insertOnCache(newComponent)
  return newComponent
}
