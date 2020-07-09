const { Event } = require('./hark/index')

Event.$on('lifecylesHook', data => {
  // 任何的声明周期，包括app, page, component， 并且在data返回相应的其它属性
  console.log('lifecylesHook', data)
})

Event.$on('errorHook', data => {
  // 在小程序中捕获的任意错误，包括同步的错误和promise的错误
  console.log('errorHook', data)
})

Event.$on('eventHook', data => {
  // 在小程序中触发的所有的事件
  console.log('eventHook', data)
})

Event.$on('customer', data => {
  console.log('customer', data)
  // 在小程序内自定义触发的一些事件
})

Event.$on('share', data => {
  console.log('share', data)
  // 在小程序内自定义触发的一些事件
})