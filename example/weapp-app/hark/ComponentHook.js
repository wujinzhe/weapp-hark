const Event = require('./event')
const proxyParams = require('./proxyParams')

function AppHook(params) {

  this.$options = params
  this.Event = Event
  this.$hooks = [
    {
      type: 'lifecylesHook',
      list: ['onLanuch', 'onShow', 'onHide'],
      handle(scope, eventName, argvs) {
        this.Event.$emit()
      }
    },
    {
      type: 'errorHook',
      list: ['onError', 'onUnhandledRejection'],
      handle(scope, eventName, argvs) {
        this.Event.$emit()
      }
    }
  ]
  // this.Hook = function Hook(eventName,) 不能使用箭头函数
  return proxyParams(this.$options, (scope, eventName, argvs) => {
    // scope 获取的是页面的当前实例
    console.log('scope', scope)
    console.log('eventName', eventName)
    console.log('argvs', argvs)
  })
}

AppHook.prototype.setHook = function setHook(hook) {

}