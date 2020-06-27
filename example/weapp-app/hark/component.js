const Event = require('./event')
const lifecylesHook = ['created', 'attached', 'ready', 'moved', 'detached']
const utils = require('./utils')

function Hook(scope, functionName, ...argv) {
  if (lifecylesHook.indexOf(functionName) >= 0) {
    // 说明为生命周期钩子
    Event.$emit('lifecycle', {
      type: 'Component',
      hookType: 'lifecycle',
      scope,
      eventName: functionName,
      argv
    })
  } else if (argv[0].type === 'tap') {
    // 组件页面中的点击事件
    Event.$emit('event', {
      type: 'Component',
      hookType: 'event',
      eventType: 'tap',
      route: scope.route,
      scope,
      eventName: functionName,
      argv
    })
  }
}

function componentHook(params) {
  const _params = utils.supplement(params, lifecylesHook)

  const newParams = new Proxy(_params, {
    get(target, prop, receiver) {
      console.log('prop', prop, target[prop])
      if (typeof target[prop] === 'function' || typeof target.methods[prop] === 'function') {
        // console.log('prop', prop)
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

module.exports = componentHook