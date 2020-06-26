const { produce, createDraft, finishDraft } = require('./immer.umd')
const datasource = {
  store1: {
    name: '111',
    age: '111'
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
    xx: {},
    yy: {}
  }
}


const draft = createDraft(datasource.store1)
draft.name = 'martion'
draft.age = 50

const draft1 = createDraft(draft)

draft1.age = 100
console.log('draft1.age', draft1.age)
const newDraft1 = finishDraft(draft1)

console.log('draft.age', newDraft1)

Object.keys(newDraft1).forEach(item => {
  draft[item] = newDraft1[item]
})


console.log('draft.name', draft.name)
console.log('draft', draft)
finishDraft(draft)
const dataProxy = new Proxy(datasource, {
  get(target, prop, receiver) {
    return target[prop]
  },

  set(target, prop, value) {
    target[prop] = value

    return true
  }
})

// function createDraft() {
//   let draftData = {}
//   produce(datasource, draft => {
//     draftData = draft
//     console.log('draft', draft)
//     // draft.unshift({id: "id3", done: false, body: "Buy bananas"})
//   })

//   return draftData
// }



// function createStore(data = {}) {
//   return new Proxy(data, {
//     get(target, prop, receiver) {
//       return datasource[prop]
//     },
  
//     set(target, prop, value) {
//       datasource[prop] = value
  
//       return true
//     }
//   })
// }

module.exports = datasource