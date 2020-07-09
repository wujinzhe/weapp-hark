const Event = require('./event')
const { proxyParams, supplement, toHookObject } = require('./utils')
const BaseHook = require('./BaseHook')
// 完整的声明周期函数和错误监听函数
const fullLifecylesFunctionList = ['onLoad', 'onShow', 'onHide', 'onReady', 'onUnload']
const originPage = Page

PageHook.prototype = new BaseHook() // 原型链继承

function PageHook(params) {
  this.$options = params
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
      list: ['$event'],
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

  this.getProxyParams = () => proxyParams(this.$options, (scope, eventName, argvs) => {
    if (argvs[0] && argvs[0].type === 'tap') {
      this.$hookEvent.$event.bind(this, scope, eventName, argvs)()
    } else {
      this.$hookEvent[eventName].bind(this, scope, eventName, argvs)()
    }
  })
}

const initPage = (hooks = []) => {
  return (params) => {
    const pageHook = new PageHook(params)
    
    pageHook.setHook(hooks)
    originPage(pageHook.getProxyParams())
  }
}

module.exports = {
  initPage
}