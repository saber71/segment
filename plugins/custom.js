import Vue from 'vue';

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
    return '今天' + time
  } else if (isBeforeOneDay(now, obj)) {
    return '昨天' + time
  } else if (isBeforeTwoDay(now, obj)) {
    return '前天' + time
  } else if (obj.getFullYear() === now.getFullYear()) {
    return month + '月' + date + '日' + time
  } else {
    return obj.getFullYear() + '年' + month + '月' + date + '日' + time
  }
}
Vue.prototype.$formatDate = function (date) {
  const obj = new Date(date)
  const now = new Date()
  const month = obj.getMonth() + 1 >= 10 ? obj.getMonth() + 1 : '0' + (obj.getMonth() + 1)
  const day = obj.getDate() >= 10 ? obj.getDate() : '0' + obj.getDate()
  if (isSameDay(now, obj)) {
    return '今天'
  } else if (isBeforeOneDay(now, obj)) {
    return '昨天'
  } else if (isBeforeTwoDay(now, obj)) {
    return '前天'
  } else if (obj.getFullYear() === now.getFullYear()) {
    return month + '月' + day + '日'
  } else {
    return obj.getFullYear() + '年' + month + '月' + day + '日'
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
