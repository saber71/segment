import Vue from 'vue';
import {iconTags} from "../assets/js/tags";
import {eventBus, ON_DEFAULT_LAYOUT_SCROLL} from "../assets/js/event-bus";

Vue.directive('lazy', {
  bind: function (el, binding) {
    eventBus.$on(ON_DEFAULT_LAYOUT_SCROLL, function (top) {
      if (binding.value) {
        const bias = Math.abs(top - el.offsetTop)
        if (bias < window.innerHeight) {
          el.setAttribute('src', binding.value)
          binding.value = null
          eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
        }
      } else {
        eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
      }
    })
  },
  unbind: function (el, binding) {
    if (binding.value) {
      eventBus.$off(ON_DEFAULT_LAYOUT_SCROLL)
    }
  }
})

Vue.prototype.$getWeekDay = (date) => {
  const obj = new Date(date)
  const day = obj.getDay()
  switch (day) {
    case 0:
      return '周日'
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    default:
      return day
  }
}
Vue.prototype.$formatDatetime = function (datetime) {
  const obj = new Date(datetime)
  const now = new Date()
  const month = obj.getMonth() + 1 >= 10 ? obj.getMonth() + 1 : '0' + (obj.getMonth() + 1)
  const date = obj.getDate() >= 10 ? obj.getDate() : '0' + obj.getDate()
  const hour = obj.getHours() >= 10 ? obj.getHours() : '0' + obj.getHours()
  const minute = obj.getMinutes() >= 10 ? obj.getMinutes() : '0' + obj.getMinutes()
  const time = hour + ':' + minute
  if (isSameDay(now, obj)) {
    return sameDayTime(now, obj)
  } else if (isBeforeOneDay(now, obj)) {
    return '昨天' + time
  } else if (isBeforeTwoDay(now, obj)) {
    return '前天' + time
  } else if (obj.getFullYear() === now.getFullYear()) {
    return (obj.getMonth() + 1) + '月' + date + '日' + time
  } else {
    return obj.getFullYear() + '年' + month + '月' + date + '日' + time
  }
}
Vue.prototype.$formatDate = function (date) {
  const obj = new Date(date)
  const now = new Date()
  const day = obj.getDate() >= 10 ? obj.getDate() : '0' + obj.getDate()
  if (isSameDay(now, obj)) {
    return '今天'
  } else if (isBeforeOneDay(now, obj)) {
    return '昨天'
  } else if (isBeforeTwoDay(now, obj)) {
    return '前天'
  } else if (obj.getFullYear() === now.getFullYear()) {
    return (obj.getMonth() + 1) + '月' + day + '日'
  } else {
    return obj.getFullYear() + '年' + (obj.getMonth() + 1 >= 10 ? obj.getMonth() + 1 : '0' + (obj.getMonth() + 1)) + '月' + day + '日'
  }
}
Vue.prototype.$formatNumber = function (number, limit) {
  if (limit) {
    return number > limit ? limit + '+' : number
  } else {
    if (number >= 1000000) {
      const res = parseInt(number / 100000) / 10
      return res + 'M'
    } else if (number >= 1000) {
      const res = parseInt(number / 100) / 10
      return res + 'K'
    } else {
      return res
    }
  }
}

Vue.prototype.$getMonthEn = function (date) {
  date = new Date(date)
  const month = date.getMonth() + 1
  switch (month) {
    case 1:
      return 'jan'
    case 2:
      return 'feb'
    case 3:
      return 'mar'
    case 4:
      return 'apr'
    case 5:
      return 'may'
    case 6:
      return 'jun'
    case 7:
      return 'jul'
    case 8:
      return 'aug'
    case 9:
      return 'sep'
    case 10:
      return 'oct'
    case 11:
      return 'nov'
    case 12:
      return 'dec'
    default:
      return 'unknown'
  }
}

Vue.prototype.$readyForCarousel = function (array) {
  if (array === undefined || array === null || array.length <= 1) {
    return array
  }
  const res = []
  array.forEach(val => res.push(val))
  res.push(array[0])
  res.push(array[1])
  return res
}

Vue.prototype.$getTagIcon = function (tagName) {
  return iconTags[tagName]
}

function sameDayTime(date1, date2) {
  const bias = date1.getTime() - date2.getTime()
  const minutes = parseInt(bias / 60000)
  if (minutes === 0) {
    return '刚刚'
  } else if (minutes < 60) {
    return minutes + '分钟前'
  } else {
    const hours = parseInt(minutes / 60)
    return hours + '小时前'
  }
}

//给定的两个日期是同一天
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
}

//日期2是日期1的前一天
function isBeforeOneDay(date1, date2) {
  date2.setTime(date2.getTime() + 86400000)
  return isSameDay(date1, date2)
}

//日期2是日期1的前2天
function isBeforeTwoDay(date1, date2) {
  date2.setTime(date2.getTime() + 172800000)
  return isSameDay(date1, date2)
}
