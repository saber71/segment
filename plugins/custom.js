import Vue from 'vue';
import {iconTags} from "../assets/js/tags";

Vue.prototype.$fillZero = function (number, threshold) {
  if (number >= threshold) {
    return number
  }
  let res = number + ''
  const thresholdLength = (threshold + '').length
  while (res.length < thresholdLength) {
    res = '0' + res
  }
  return res
}
Vue.prototype.$getChineseNumber = function (number) {
  switch (number) {
    case 0:
      return '零'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
    case 7:
      return '七'
    case 8:
      return '八'
    case 9:
      return '九'
    case 10:
      return '十'
    case 11:
      return '十一'
    case 12:
      return '十二'
  }
}
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
      return number
    }
  }
}

Vue.prototype.$formatText = function (text, limit) {
  if (!limit) {
    return text
  }
  if (text.length <= limit) {
    return text
  }
  return text.substr(0, limit) + '...'
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

Vue.prototype.$getMonthDay = function (month, year) {
  switch (month) {
    case 1:
      return 31
    case 2:
      return year % 4 === 0 ? 29 : 28
    case 3:
      return 31
    case 4:
      return 30
    case 5:
      return 31
    case 6:
      return 30
    case 7:
    case 8:
      return 31
    case 9:
      return 30
    case 10:
      return 31
    case 11:
      return 30
    case 12:
      return 31
  }
}

Vue.prototype.$nullOrUndefined = function (obj) {
  return obj === null || obj === undefined
}

Vue.prototype.$getDate = function (hour, minute, second, date, month, year) {
  const now = new Date()
  if (this.$nullOrUndefined(year)) {
    year = now.getFullYear()
  }
  if (this.$nullOrUndefined(month)) {
    month = now.getMonth() + 1
  }
  if (this.$nullOrUndefined(date)) {
    date = now.getDate()
  }
  if (this.$nullOrUndefined(hour)) {
    hour = now.getHours()
  }
  if (this.$nullOrUndefined(minute)) {
    minute = now.getMinutes()
  }
  if (this.$nullOrUndefined(second)) {
    second = now.getSeconds()
  }
  now.setFullYear(year, month - 1, date)
  now.setHours(hour, minute, second)
  return now
}

Vue.prototype.$getSeasonEnd = function (date) {
  const month = date.getMonth() + 1
  switch (month) {
    case 1:
    case 2:
    case 3:
      return this.$getDate(23, 59, 59, 31, 3)
    case 4:
    case 5:
    case 6:
      return this.$getDate(23, 59, 59, 30, 6)
    case 7:
    case 8:
    case 9:
      return this.$getDate(23, 59, 59, 30, 9)
    case 10:
    case 11:
    case 12:
      return this.$getDate(23, 59, 59, 31, 12)
  }
}

Vue.prototype.$limitString = function (str, limitLength) {
  if (!limitLength) {
    return str
  }
  if (str.length <= limitLength) {
    return str
  }
  return str.substring(0, limitLength) + '...'
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

Vue.prototype.$pushToArray = function (targetArray, sourceArray) {
  sourceArray.forEach(val => targetArray.push(val))
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
