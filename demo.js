// var obj = {}

// var newOjb = JSON.parse(JSON.stringify(obj))

// var obj = {
//   a: 1,
//   b: 'xx'
// }

// var newObj = {...obj}
// var newObj = Object.assign({}, obj)



var obj = {
  a: {
    b: {
      name: 1,
      array: [1,2,3]
    }
  },
  age: 12
}

function copy(data) {
  if (typeof data !== 'object') return data

  let newObj = {}

  for(let i in data) {
    if (Array.isArray(data[i])) {
      newObj[i] = data[i].map(item => copy(item))
    } else if (typeof data[i] === 'object') {
      newObj[i] = copy(data[i])
    } else {
      newObj[i] = data[i]
    }
  }

  return newObj
}

console.log(copy(obj))