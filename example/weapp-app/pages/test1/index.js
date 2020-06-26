//index.js
//获取应用实例
const app = getApp()
const { produce } = getApp()
const { store, initStore, createCopy, updateStore } = require('../../store/datasource')




Page({
  data: {
    a: 1,
    b: 2,
    store: {
      name: 111
    }
    // data: data1,
    // store: proxydata,
    // bb: {}
  },

  onLoad: function (options) {
    const draft = createCopy('z', store.store1)
    
    initStore(this, {
      store: draft
    })
  },

  change1() {
    const { addressList } = this.data.store
    addressList.push({
      address: 'zzz',
      mobile: 'fffffffffffffffff',
      name: 'yy'
    })
    // const 
    this.setData({
      'store.name': (Math.random() * 100000).toFixed(0),
      'store.addressList': addressList,
      'store.isBack': true
    })

  },

  confirm() {
    console.log('confirm', this.data.store)
    updateStore('store1', this.data.store)
  }
})
