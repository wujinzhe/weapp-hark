require('./app')
const pageHook = require('./page')
const originApp = App
const originPage = Page

function encapsulation(params, type) {
  console.log(params)
  return params
}

App = (params) => originApp(encapsulation(params))
Page = (params) => originPage(pageHook(params))

module.exports = {
  App,
  Page
}