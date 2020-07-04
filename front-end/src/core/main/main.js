import menu from '../menu/menu.js'
import mainRouter from './mainRouter/MainRouter.js'

mainRouter.events({
  beforeInit: () => menu.startMenu(),
  afterMountComponent: path => menu.setCurrentPage(path)
})

mainRouter.init()
