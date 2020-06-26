const EventHub = (function () {
  const eventList = {}
  const onceEventList = {}
  const coverEvent = {}

  function EventHub() {}

  EventHub.prototype.$emit = function $emit(eventName, eventValue) {
    if (eventList[eventName]) {
      const fnList = eventList[eventName]

      fnList.forEach(fn => {
        if (typeof fn === 'function') {
          fn(eventValue)
        }
      })
    }

    // if (onceEventli)
  }

  EventHub.prototype.$on = function $on(eventName, fn) {
    if (!eventList[eventName]) {
      eventList[eventName] = []
    }

    eventList[eventName].push(fn)
  }

  return new EventHub()
})()

module.exports = EventHub