const Event = require('./event')
const utils = require('./utils')
const lifecylesHook = ['onLaunch', 'onShow', 'onHide']
const errorHook = ['onError', 'onUnhandledRejection']

function Hook(scope, functionName, ...argv) {
  if (lifecylesHook.indexOf(functionName) >= 0) {
    // 说明为生命周期钩子
    Event.$emit('lifecycle', {
      type: 'App',
      hookType: 'lifecycle',
      scope,
      eventName: functionName,
      argv
    })
  } else if (errorHook.indexOf(functionName) >= 0) {
    // 捕获错误的钩子
    Event.$emit('error', {
      type: 'App',
      hookType: 'error',
      scope,
      eventName: functionName,
      argv
    })
  }
}

function appHook(params) {
  const _params = utils.supplement(params, lifecylesHook.concat(...errorHook))

  const newParams = new Proxy(_params, {
    get(target, prop, receiver) {

      if (typeof target[prop] === 'function') {
        const fn = target[prop]

        return function(...argv) {
          Hook(this, prop, ...argv) // 调用钩子中的事件
          fn.call(this, ...argv) // 调用原函数
        }
      } else {
        return target[prop]
      }
    },
    set(target, prop, value) {
      target[prop] = value
    }
  })

  return newParams
}

module.exports = appHook