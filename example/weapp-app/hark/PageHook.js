const Event = require('./event')
const { proxyParams, supplement, toHookObject } = require('./utils')
const BaseHook = require('./BaseHook')
// 完整的声明周期函数和错误监听函数
const fullLifecylesFunctionList = ['onLoad', 'onShow', 'onHide', 'onReady', 'onUnload']
const originPage = Page

PageHook.prototype = new BaseHook() // 原型链继承

function PageHook(params) {
  this.$options = params
  // this.$options = supplement(params, fullLifecylesFunctionList)
  this.Event = Event
  this.$hooks = [
    {
      type: 'lifecylesHook',
      list: fullLifecylesFunctionList,
      handle(scope, eventName, argvs) {
        this.Event.$emit('lifecylesHook', {
          type: 'Page',
          hookType: 'lifecylesHook',
          scope,
          eventName,
          argvs
        })
      }
    },
    {
      type: 'eventHook',
      list: ['event'],
      handle(scope, eventName, argvs) {
        this.Event.$emit('eventHook', {
          type: 'Page',
          hookType: 'eventHook',
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
    this.$hookEvent[eventName].bind(this, scope, eventName, argvs)
  })
}

/** 可以自己根据声明周期或者函数自己添加钩子 */
// PageHook.prototype.setHook = function setHook(hook) {
//   // if (hook.get)
//   this.$hooks.push(hook)

//   this.$hookEvent = toHookObject(this.$hooks)
// }

const initPage = (hooks = []) => {
  return (params) => {
    const pageHook = new PageHook(params)
    
    pageHook.setHook(hooks)
    originPage(pageHook)
  }
}

module.exports = {
  initPage
}