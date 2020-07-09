const Event = require('./event')
const { proxyParams, supplement, toHookObject } = require('./utils')
// 完整的声明周期函数和错误监听函数
const fullLifecylesFunctionList = ['onLaunch', 'onShow', 'onHide']
const fullErrorFunctionList = ['onError', 'onUnhandledRejection']
const BaseHook = require('./BaseHook')
const originApp = App

Proxy.prototype = new BaseHook() // 只继承原型链中的方法即可

function AppHook(params) {
  // this.$options = supplement(params, fullLifecylesFunctionList.concat(...fullErrorFunctionList))
  this.$options = params
  this.Event = Event
  this.$hooks = [
    {
      type: 'lifecylesHook',
      list: fullLifecylesFunctionList,
      handle(scope, eventName, argvs) {
        this.Event.$emit('lifecylesHook', {
          type: 'App',
          hookType: 'lifecylesHook',
          scope,
          eventName,
          argvs
        })
      }
    },
    {
      type: 'errorHook',
      list: fullErrorFunctionList,
      handle(scope, eventName, argvs) {
        this.Event.$emit('errorHook', {
          type: 'App',
          hookType: 'errorHook',
          scope,
          eventName,
          argvs
        })
      }
    }
  ]

  this.$hookEvent = toHookObject(this.$options, this.$hooks)

  return proxyParams(this.$options, (scope, eventName, argvs) => {
    // scope 获取的是页面的当前实例
    console.log('scope', scope)
    console.log('eventName', eventName)
    console.log('argvs', argvs)
    console.log('this', this.$hookEvent, this.$hookEvent[eventName])
    this.$hookEvent[eventName].bind(this, scope, eventName, argvs)
  })
}


const initApp = (hooks = []) => {
  return (params) => {
    const appHook = new AppHook(params)
    console.log('appHook', appHook)
    
    appHook.setHook(hooks)
    originApp(appHook)
  }
}

module.exports = {
  initApp
}