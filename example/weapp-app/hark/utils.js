module.exports = {
  /** 给参数补充没有的钩子 */
  supplement(params, hooks) {
    hooks.forEach(item => {
      if (typeof params[item] !== 'function') {
        params[item] = function () {}
      }
    })

    return params
  }
}