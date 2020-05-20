// class PageHook {
//   constructor() {

//   }

//   onLoad() {

//   }

//   onShow() {

//   }

//   onReady() {

//   }

//   onHide() {

//   }
// }

function pageHook(params) {
  console.log('pageHook', params)
  const lifecylesHook = {
    onLoad: function (e) {
      console.log('当前路由', this.route)
      console.log('onLoad', e)
    },
  
    onShow: () => {
      console.log('onShow')
    },
  
    onReady: () => {
      console.log('onReady')
    },
  
    onHide: () => {
      console.log('onHide')
    }
  }

  Object.keys(lifecylesHook).forEach(item => {
    // console.log('item', item)
    // console.log('this', this)
    // if (params[item]) {
      const originFun = params[item]
      // const originFun = (...argv) => params[item](...argv)

      params[item] = function (...argv) {
        // console.log('this', this)
        lifecylesHook[item].call(this, ...argv)

        if (typeof originFun === 'function') {
          originFun.call(this, ...argv)
        }
      }
    // }
  })

  return params
}

module.exports = pageHook