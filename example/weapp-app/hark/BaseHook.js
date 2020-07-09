const { error } = require('./utils')

function BaseHook() {
  // this.$hooks = []
}

BaseHook.prototype.toHookObject = function toHookObject(hookList = []) {
  if (!Array.isArray(hookList)) {
    error('toHookObject的参数必须为数组')
  }

  const list = []

  hookList.forEach(item => {
    item.list.forEach(i => {
      if (typeof this.$options[i] !== 'function') {
        this.$options[i] = () => {}
      }
      
      list[i] = item.handle
    })
  })

  return list
}

BaseHook.prototype.setHook = function setHook(hookList = []) {
  if (!Array.isArray(hookList)) {
    error('setHook的参数必须为数组')
  }

  this.$hooks.push(...hookList)
  this.$hookEvent = this.toHookObject(this.$hooks)
}

module.exports = BaseHook
