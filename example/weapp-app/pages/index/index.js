//index.js
//获取应用实例
const app = getApp()
const { store } = getApp()
// const { store, setStore, createClone, updateStore } = require('../../store/datasource')
const { setStore, updateStore } = require('../../store/store')


Page({
  data: {
    a: 1,
    b: 2,
    // data: data1,
    // store: proxydata,
    // bb: {}
  },

  onLoad: function (options) {
    // const draft = createClone('x', {
    //   store: store.store1,
    //   a: store.store2
    // })

    // this.setData({
    //   ...
    // })
    

    // var a = {

    // }
    // Object.defineProperties(this.__data__, {
    //   '$parent': {
    //     enumerable: true,
    //     configurable: true,
    //     get() {
    //       return 1
    //     },
    //     set(val){
    //       console.log('出发了', val)
    //     }
    //   }
    // })

    // // console.log('a', a)

    // this.setData(this.__data__)

    // setTimeout(() => {
    //   this.setData({
    //     $parent: '444'
    //   })
    // }, 1000);


    

    // this.setData({
    //   name: get() {

    //   },
    //   name: set() {

    //   }
    // })

    console.log('tnks data', this.data)
    console.log('this', this)

    // this.setData({
      
    // })

    const draft = store.createClone('y', data => {
      return {
        name: data.name,
        age: data.age,
        addressList: data.addressList
      }
    })

    // draft.watch('name,age,addressList', ({name, age, addressList}) => {

    // })

    this.setData({
      store: draft
    })
    

    // const draft = store.createClone('y')

    // setStore(this, draft)
  },

  change1() {
    const { addressList } = this.data
    addressList.push({
      address: 'yyy',
      mobile: '1231222121',
      name: '234213'
    })
    // const 
    this.setData({
      'store.addressList': addressList
    })

    console.log('draftxxxx', store.getCloneByName('y'))
    console.log('draftxxxx data', this.data.store)

  },

  confirm() {
    console.log('confirm', this.data.store)
    updateStore(store, this.data.store)
  }
})
