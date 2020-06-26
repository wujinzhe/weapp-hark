const { produce, createDraft, finishDraft } = require('../immer.umd')
const EventHub = require('./event')

const datasource = {
  store1: {
    name: '111',
    age: '111',
    isBack: false,
    server: {
      fee: 0,
    },
    addressList: [
      {
        address: 'xxx',
        name: 'xxx',
        mobile: 'xxx'
      }
    ]
  },
  store2: {
    number: '12312',
    fee: '2131232'
  },
  store3: {
    phone: '15219475158',
    login: true
  },
  // 草稿
  draft: {
  }
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
function isPathExist(copyName) {
  // TODO 是否存在改副本
}

/**
 * 创建一个副本
 * @param {String} copyName 副本名称
 * @param {*} data 想要拷贝的对象，一定要是数据的第一层级
 */
function createCopy(copyName, data) {
  /**
   * 该函数在使用的时候，应该明确调用，因为我们需要明确自己是根据那个对象来进行创建副本的，并且
   * 需要知道我们创建的副本叫什么名称，这样我们的副本可以被再次引用，继续创建副本的副本，然后副本的副本的副本，
   * 只要有一个引用了原数据的副本改变，那基于这个数据复制的副本也要跟着改变，这个就是这个数据驱动的基本思想
   */
  const draft = createDraft(data)
  // draft.name =1
  // const nextDraft = finishDraft(draft)
  // console.log(data, nextDraft, data === nextDraft)
  const path = _getDataPath(data) // 可以访问到的路径

  // if (datasource.draft[copyName]) {
  //   finishDraft(datasource.draft[copyName])
  // }

  datasource.draft[copyName] = draft

  console.log('createCopy', draft)

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
function initStore(currentScope, data) {
  // console.log()
  console.log('initStore data', data)
  const newData = {}
  const eventList = [] // 有多少需要监听的对象

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

    // 进行监听
    EventHub.$on(path, function (value) {
      console.log('value', value, path)
      const copyData = createCopy(copyName, value)

      console.log('eventhub path', dataName, copyData.data)

      
      try {
        // JSON.stringify(copyData.data)
        console.log('eventhub currentScope', this)
        // console.log('get', copyData.data.name)
        // debugger
        this.setData({
          [dataName]: copyData.data
        })
      } catch(e) {
        console.log('e', this.route, e)
      }
    }.bind(currentScope))
  })

  console.log('currentScope', currentScope)

  currentScope.setData({
    // store: {
    //   name: 1,
    //   age: 1
    // }
    ...newData
  })
}


function updateStore(path, data) {
  // if (path)

  const newData = data
  // const newData = finishDraft(data)
  console.log('data', {...newData})
  datasource[path] = newData

  console.log('updateStore', datasource)

  EventHub.$emit(path, newData)
}
// createCopy('xx', datasource.store1)

module.exports = {
  store: datasource,
  createCopy,
  initStore,
  updateStore
}