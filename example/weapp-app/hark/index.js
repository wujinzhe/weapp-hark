const pageHook = require('./page')
const appHook = require('./app')
const Event = require('./event')
const componentHook = require('./component')
const originApp = App
const originPage = Page
const originComponent = Component

// 直接赋值给全局的对象 就不需要导出了
App = params => originApp(appHook(params))
Page = params => originPage(pageHook(params))
Component = params => originComponent(componentHook(params))

module.exports = {
  Event
}