const Utils = require('./utils')
var $store = null

var Store = (function (){
  const _draft = new WeakMap()

  function Store(options) {
    if (!(this instanceof Store)) return new Store(options)
  
    if (!(options.data instanceof Object)) {
      throw new Error('The parameter data must be an object')
    }
  
    const _data = options.data || {}
  
    this.data = _data

    this.proxyData = new Proxy(this.data, {
      get(props, value) {
        return this.data[props]
      },
      set(props, value, receiver) {
        this.data[props] = value
      }
    })
  
    // 来源于哪个对象的草稿 该对象无法改写
    Object.defineProperties(this, {
      '$parent': {
        enumerable: false,
        configurable: true,
        writable: false,
        value: options.$parent || null
      }
    })

    // 监听对象的监听数组
    Object.defineProperties(this, {
      'watch': {
        enumerable: false,
        configurable: true,
        writable: true,
        value: []
      }
    })
  
    /** 
     * 该数据的草稿对象数组，一个store可以有多个草稿对象
     * 当数据改变时，该数组
     */
    _draft.set(this, {})

    return this.proxyData
  }
    
  /** 根据store对象来创建一个草稿对象 */
  Store.prototype.createClone = function createClone(name, fn) {
    if (fn && typeof fn !== 'function') {
      // 第二个参数如果有的话，一定得为函数
      throw new Error('The second argument is an invalid function')
    }

    // 参数name只能为数字和字符串构成的草稿名
    if (/[^a-zA-Z0-9]/.test(name)) {
      throw new Error('Parameter name format error')
    }
    
    // 克隆对象的名称，使用symbol，如果symbol没有则直接使用字符串名称
    const cloneName = Symbol.for(name)
    // const cloneName = Symbol ? Symbol.for(name) : name
    /**
     * 回调函数，createClone的返回的值可以根据回调函数中返回值进行改变
     */
    const callback = fn || function(data) {
      return data
    }
    const currentDraft = _draft.get(this) // 当前的草稿
    let result = callback(this.data)
    const resultTypeString = Object.prototype.toString.call(result)

    if (resultTypeString !== '[object Object]' && resultTypeString !== '[object Array]') {
      console.warn('The function must return object or array')
      result = this.data
    }

    if (currentDraft[cloneName]) {
      // 重复命名克隆数据 如果已经有克隆值，则直接返回
      console.warn('Duplicate naming of cloned data')
      return currentDraft[cloneName]
    }

    currentDraft[cloneName] = new Store({
      $parent: this,
      data: Utils.deepClone(result)
    })

    return currentDraft[cloneName]
  }

  /** 
   * 获取某个对象下的某个克隆对象
   * @param {String} cloneName 需要查找的克隆的名称
  */
  Store.prototype.getCloneByName = function getCloneByName(cloneName) {
    const splitName = cloneName.split('.') //['x', '']
    let currentStore = null
  
    for(let i = 0; i < splitName.length; i++) {
      if (!splitName[i]) continue // 如果碰到空字符串，则下一个循环

      currentStore = this.getClone(splitName[i])

      if (!currentStore) return null // 如果store无法找到了，则直接返回null
    }
  
    return currentStore
  }

  /** 获取当前的草稿值 */
  Store.prototype.getClone = function getClone(name) {
    const currentDraft = _draft.get(this)
    const cloneName = Symbol.for(name)

    return currentDraft[cloneName]
  }

  return Store

})()

/**
 * 创建Store
 * @param {Object} data 
 */
function createStore(data){
  $store = new Store({
    data
  })

  return $store
}

/**
 * 创建代理对象
 * @param {Object} data 
 */
function _createProxyData(data) {

}

/** 
 * 给page，app，component设置data值
 * @param {Object} scope 当前实例的this
 * @param {Store} store 克隆的对象
 */
function setStore(scope, store) {
  const data = store.data



  scope.setData(data)
}

/**
 * 使用某个克隆对象去修改parent Store
 * @param {Store} parentStore
 * @param {Store} cloneStore
 */
function updateStore(parentStore, cloneStore) {

}

/** 销毁某个Store */
function destoryStore() {

}

module.exports = {
  createStore,
  store: $store,
  setStore,
  updateStore
}
