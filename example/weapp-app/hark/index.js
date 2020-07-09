// const pageHook = require('./page')
// const appHook = require('./app')
const Event = require('./event')
// const componentHook = require('./component')
// const originApp = App
// const originPage = Page
// const originComponent = Component

// const appHook = new AppHook(params)

// // appParams.setHook({

// // })

// // 直接赋值给全局的对象 就不需要导出了
// App = params => originApp(appHook)
// Page = params => originPage(pageHook(params))
// Component = params => originComponent(componentHook(params))

const { initApp } = require('./AppHook')
const { initPage } = require('./PageHook')

App = initApp() // 可以设置钩子
Page = initPage([
  {
    type: 'share',
    list: ['onShareAppMessage'],
    handle(scope, eventName, argvs) {
      this.Event.$emit('share', {
        data: '我分享啦哈哈哈',
        argvs,
        eventName,
        scope
      })
    }
  }
])

// console.log('pageHook', pageHook)
// pageHook.setHook({
//   type: 'share',
//   list: ['onShareAppMessage'],
//   handle(scope, eventName, argvs) {
//     this.Event.$emit('share', {
//       data: 'share'
//     })
//   }
// })

module.exports = {
  Event
}