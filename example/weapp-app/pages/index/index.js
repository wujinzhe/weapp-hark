//index.js
//获取应用实例
const app = getApp()
const { produce } = getApp()
const { store, setStore, createCopy, updateStore } = require('../../store/datasource')




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
    const draft = createCopy('x', store.store1)
    console.log('options', options)

    setStore(this, {
      store: draft
    })
  },

  change1() {
    const { addressList } = this.data.store
    addressList.push({
      address: 'yyy',
      mobile: '1231222121',
      name: '234213'
    })
    // const 
    this.setData({
      'store.name': (Math.random() * 100000).toFixed(0),
      'store.addressList': addressList
    })

  },

  confirm() {
    console.log('confirm', this.data.store)
    updateStore('store1', this.data.store)
  }
})
