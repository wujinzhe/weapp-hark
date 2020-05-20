const { event } = require('./hark/index')

event.$on('lifecycle', data => {
  // 任何的声明周期，包括app, page, component， 并且在data返回相应的其它属性
})

event.$on('error', errInfo => {
  // 在小程序中捕获的任意错误，包括同步的错误和promise的错误
})

event.$on('event', e => {
  // 在小程序中触发的所有的事件
})

event.$on('customer', value => {
  // 在小程序内自定义触发的一些事件
})