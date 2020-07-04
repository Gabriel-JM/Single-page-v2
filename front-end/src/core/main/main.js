'use strict'
import menu from '../menu/menu.js'
import mainRouter from './mainRouter/MainRouter.js'

(function init() {
  menu.startMenu()
  mainRouter.init()
})()
