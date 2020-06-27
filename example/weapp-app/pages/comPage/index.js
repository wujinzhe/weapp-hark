const { Event } = require('../../hark/index')


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    error() {
      console.log(a)
    },

    error1() {
      Promise.reject(new Error('promise 错误'))
    },

    customer() {
      Event.$emit('customer', {
        a: 1
      })
    }
  }
})
