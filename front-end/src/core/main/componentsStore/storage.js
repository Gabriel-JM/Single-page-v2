import componentsService from '../../componentsService/componentsService.js'
import getComponent from '../componentExtractor/componentExtractor.js'

const componentsPaths = componentsService.map(({ path }) => path)
let componentsCache = []

export const retriveFromCache = callback => {
  const item = componentsCache.find(callback)

  return item
}

export const insertOnCache = newItem => {
  componentsCache = [...componentsCache, newItem]
}

export async function getComponentFromStore(path) {
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
