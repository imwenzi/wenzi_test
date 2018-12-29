import axios from 'axios'
import _ from 'lodash'
let host = window.location.host
let hostname = window.location.hostname
const wsBaseUrl = hostname === 'localhost' ? 'ws://192.168.3.136:8885/wangdian' : `ws://${host}/wangdian`
// 清除左右空格
function trim (s) {
  return s.toString().replace(/(^\s*)|(\s*$)/g, '')
}
// 可视化后台指标组装
function makeLegendData (data) {
  let newdata = data.rows.map(row => {
    let resultMap = {}
    data.cols.forEach(col => {
      resultMap[col.name] = row.cells[col.id]
    })
    return resultMap
  })
  return newdata
}
// 获取某个指标的值
function getLegendCell (data, key, value) {
  let param = {}
  param[key] = value
  let celldata = _.find(data, param)
  return celldata
}
function formatDate (date, format) {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}
function getDateStr (AddDayCount) {
  var dd = new Date()
  let time = dd.getTime() + AddDayCount * 24 * 3600 * 1000
  let newDate = new Date(time)
  return formatDate(newDate, 'yyyyMMdd')
}

// 跳转到登录页面
function goLogin (link) {
  // eslint-disable-next-line
  let h = new Buffer(link || window.location.href)
  let h64 = h.toString('base64')
  console.log('/apollo/login?service=' + h64)
  window.location.href = '/apollo/login?service=' + h64
}

// 获取登录的token
function getLogin () {
  axios.get('/apollo/token')
    .then(res => {
      if (res.data.data.isLogin) {
        checkToken(res.data.data.token)
      } else {
        goLogin()
      }
    })
}
// 检查token是否合法
function checkToken (token) {
  axios.post('/thor/sso/checktoken?token=' + token)
    .then(res => {
      if (res.data.status === 200 && res.data.success) {
        axios.get('/thor/userinfo')
          .then(response => {
            window.location.reload()
          })
          .catch(() => {
          })
      }
    })
    .catch(() => {
      goLogin()
    })
}

// 是否是数字
function isRealNum (val) {
  if (val === '' || val == null) {
    return false
  }
  if (!isNaN(val)) {
    return true
  } else {
    return false
  }
}
export default {trim, wsBaseUrl, makeLegendData, getDateStr, goLogin, getLogin, checkToken, isRealNum, getLegendCell}
