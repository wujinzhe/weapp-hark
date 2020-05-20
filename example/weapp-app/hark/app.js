class AppHook {
  constructor(params) {

    
    return params

  }

  /** 小程序初始化 */
  onLaunch() {

  }

  /** 小程序切前台 */
  onShow() {

  }

  /** 小程序切后台 */
  onHide() {

  }

  /** throw 或者 同步异常的获取 */
  onError() {

  }

  /** 打开页面不存在的返回事件 */
  onPageNotFound() {

  }

  /** 未捕获的Promise错误 */
  onUnhandledRejection() {

  }

  /** 监听系统主题的变化事件 */
  onThemeChange() {

  }

}

const app = new AppHook({data: {a: 1}})
console.log('app', app)