const { error, toHookObject } = require('./utils')

function BaseHook() {
  // this.$hooks = []
}

BaseHook.prototype.setHook = function setHook(hookList = []) {
  if (!Array.isArray(hookList)) {
    error('setHook的参数必须为数组')
  }

  this.$hooks.push(...hookList)
  this.$hookEvent = toHookObject(this.$options, this.$hooks)
}

module.exports = BaseHook
