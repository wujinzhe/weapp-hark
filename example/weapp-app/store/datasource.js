const { produce, createDraft, finishDraft } = require('../immer.umd')
const EventHub = require('./event')

const datasource = {
  // 草稿
}

/** 添加草稿对象draft */
Object.defineProperties(datasource, {
  "draft": {
    enumerable: false,
    configurable: true,
    value: {},
    writable: true
  }
})

function initStore(data) {
  Object.keys(data).forEach(item => {
    datasource[item] = data[item]
  })
}

/**
 * 根据symbol查找草稿对象
 */
function _getDraft(symbol) {

}

/** 获取对象的路径，访问路径 */
function _getDataPath(data) {
  let currentPath = []

  Object.keys(datasource).forEach(item => {
    if (item === 'draft') {
      Object.keys(datasource.draft).forEach(item1 => {
        if (datasource.draft[item] === data) {
          currentPath = 'draft.' + item
        }
      })
    }

    if (datasource[item] === data) {
      currentPath = item
    }
  })

  return currentPath
}

/** 判断这个副本的名称是否存在 */
function _isPathExist(copyName) {
  // TODO 是否存在改副本
  const copyNameList = Object.keys(datasource.draft)

  return copyNameList.indexOf(copyName) >= 0
}

/**
 * 创建一个副本/草稿
 * @param {String} copyName 副本名称
 * @param {*} data 想要拷贝的对象，一定要是数据的第一层级
 * @param {Boolean} isRewrite 是否覆盖
 */
function createClone(copyName, data, isRewrite) {
  /**
   * 该函数在使用的时候，应该明确调用，因为我们需要明确自己是根据那个对象来进行创建副本的，并且
   * 需要知道我们创建的副本叫什么名称，这样我们的副本可以被再次引用，继续创建副本的副本，然后副本的副本的副本，
   * 只要有一个引用了原数据的副本改变，那基于这个数据复制的副本也要跟着改变，这个就是这个数据驱动的基本思想
   */
  const draft = createDraft(data)
  const path = _getDataPath(data) // 可以访问到的路径

  if (!isRewrite && _isPathExist(copyName)) {
    throw new Error('已经存在相同名称的草稿')
  }

  datasource.draft[copyName] = draft

  return {
    copyName,
    path,
    data: draft
  }
}

/**
 * 给执行的地方添加上store
 * @param {Object} currentScope 当前执行的作用域的this
 * @param {Object} data 
 */
function setStore(currentScope, data) {
  /**
   * 在初始化的时候需要给这个组件或者页面进行赋值
   */
  const newData = {}
  const eventList = [] // 有多少需要监听的对象
  currentScope.eventList = []

  Object.keys(data).forEach(item => {
    newData[item] = data[item].data
    eventList.push({
      dataName: item, // 绑定在页面中的数据的名称
      path: data[item].path,
      copyName: data[item].copyName
    })
  })

  // 需要根据绑定的对象个数进行监听
  eventList.forEach(item => {
    const { path, copyName, dataName } = item

    function event (value) {
      // console.log('value', currentScope.route, value, path)
      const copyData = createClone(copyName, value, true)

      currentScope.setData({
        [dataName]: copyData.data
      })
    }

    currentScope.eventList.push({
      path,
      copyName,
      event
    })

    // 进行监听
    EventHub.$on(path, event)
  })

  _rewriteOnUnload(currentScope)

  currentScope.setData({
    ...newData
  })
}

/** 对卸载事件进行重写 */
function _rewriteOnUnload(currentScope) {
  const fn = currentScope.onUnload.bind(currentScope)
  const { eventList } = currentScope

  currentScope.onUnload = function() {
    // 移除事件与草稿
    eventList.forEach(item => {
      EventHub.$remove(item.path, item.event)
      delete datasource.draft[item.copyName]
    })

    fn()
  }
}

/** 更新数据 */
function updateStore(path, data) {
  const newData = { ...data }

  if (/\./g.test(path)) {
    const [name1, name2] = path.split('.')

    datasource[name1][name2] = newData
  } else {
    datasource[path] = newData
  }

  EventHub.$emit(path, newData)
}

module.exports = {
  store: datasource,
  createClone,
  setStore,
  initStore,
  updateStore
}
