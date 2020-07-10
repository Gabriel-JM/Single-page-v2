import componentsService from '../../componentsService/componentsService.js'
import getComponent from '../componentExtractor/componentExtractor.js'

const componentsPaths = componentsService.map(({ path }) => path)
export let componentsCache = []

export async function loadComponentContent(path) {
  const findByPath = comp => comp.path === path
  const existingComponent = componentsCache.find(findByPath)

  if(existingComponent) return existingComponent
  if(!componentsPaths.includes(path)) return null
  
  const componentInfo = componentsService.find(findByPath)
  const component = await getComponent(componentInfo)

  const newComponent = { ...componentInfo, ...component }

  componentsCache = [ ...componentsCache, newComponent ]
  return newComponent
}
