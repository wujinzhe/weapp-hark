function deepClone(data) {
  // 如果data为原始类型，则直接返回
  if (!(data instanceof Object)) return data

  const clone = data instanceof Array ? [] : {}

  for (let i in data) {
    const item = data[i]
    clone[i] = (item instanceof Object) ? deepClone(item) : item
  }

  return clone
}

module.exports = {
  deepClone
}
