const Event = require('./event')
const lifecylesHook = ['onLoad', 'onShow', 'onHide', 'onReady', 'onUnload']
const utils = require('./utils')

function Hook(scope, functionName, ...argv) {
  if (lifecylesHook.indexOf(functionName) >= 0) {
    // 说明为生命周期钩子
    // console.log('page ', functionName, scope.route, ...argv)
    Event.$emit('lifecycle', {
      type: 'Page',
      hookType: 'lifecycle',
      route: scope.route,
      scope,
      eventName: functionName,
      argv
    })
  } else if (argv[0].type === 'tap') {
    // console.log('page 点击事件', functionName, ...argv)
    Event.$emit('event', {
      type: 'Page',
      hookType: 'event',
      eventType: 'tap',
      route: scope.route,
      scope,
      eventName: functionName,
      argv
    })
  }
}

function pageHook(params) {
  const _params = utils.supplement(params, lifecylesHook)

  const newParams = new Proxy(_params, {
    get(target, prop, receiver) {
      // console.log('get', prop, target.prop)

      if (typeof target[prop] === 'function') {
        const fn = target[prop]

        return function(...argv) {
          // console.log('this', this, argv, prop)
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

module.exports = pageHook