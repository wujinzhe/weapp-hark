module.exports = {
  /** 给参数补充没有的钩子 */
  supplement(params, hooks) {
    hooks.forEach(item => {
      if (typeof params[item] !== 'function') {
        params[item] = function () {}
      }
    })

    return params
  },

  /** 将参数进行Proxy代理 */
  proxyParams(params, Hook) {  
    const newParams = new Proxy(params, {
      get(target, prop, receiver) {
  
        if (typeof target[prop] === 'function') {
          const fn = target[prop]
  
          return function(...argv) {
            Hook(this, prop, argv) // 将该事件抛出去，并且查找相对应钩子调用
            fn.call(this, argv) // 调用原函数
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
  },

  /** 转换hooks列表 */
  toHookObject(options, hooks) {
    const list = []

    hooks.forEach(item => {
      item.list.forEach(i => {
        if (typeof options[i] !== 'function') {
          options[i] = () => {}
        }
        list[i] = item.handle
      })
    })

    return list 
  },

  error(message) {
    // console.error(message)
    
    Promise.reject(new Error(message))
  }
}