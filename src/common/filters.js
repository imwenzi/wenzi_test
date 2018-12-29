import * as ecology from '@/common/ecology'
import util from '@/common/util'
import _ from 'lodash'
// 根据aqi指数获取等级
let getAqiLvel = value => {
  value = parseFloat(value)
  if (typeof value === 'number') {
    if (value >= 0 && value <= 50) {
      return '优'
    } else if (value >= 51 && value <= 100) {
      return '良'
    } else if (value >= 101 && value <= 150) {
      return '轻度污染'
    } else if (value >= 151 && value <= 200) {
      return '中度污染'
    } else if (value >= 201 && value <= 300) {
      return '重度污染'
    } else if (value > 300) {
      return '严重污染'
    } else {
      return '--'
    }
  } else {
    return '--'
  }
}

// 获取AQI指数对人体的影响
let getAqiAffect = value => {
  value = parseFloat(value)
  if (typeof value === 'number') {
    if (value >= 0 && value <= 50) {
      return '空气质量令人满意,基本无空气污染'
    } else if (value >= 51 && value <= 100) {
      return '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响'
    } else if (value >= 101 && value <= 150) {
      return '易感人群症状有轻度加剧,健康人群出现刺激症状'
    } else if (value >= 151 && value <= 200) {
      return '进一步加剧易感人群症状,可能对健康人群心脏,呼吸系统有影响'
    } else if (value >= 201 && value <= 300) {
      return '心脏病和肺病患者症状显著加剧,运动耐受力降低,健康人群普遍出现症状'
    } else if (value > 300) {
      return '健康人群运动耐受力降低,有明显强烈症状,提前出现某些疾病'
    } else {
      return '--'
    }
  } else {
    return '--'
  }
}

// 获取地表水总得level颜色
let getSurfaceWaterMockLevel = (value) => {
  let color = '#ffffff'
  if (value === 'Ⅰ类标准') {
    color = ecology.waterColor[0]
  } else if (value === 'Ⅱ类标准') {
    color = ecology.waterColor[1]
  } else if (value === 'Ⅲ类标准') {
    color = ecology.waterColor[2]
  } else if (value === 'Ⅳ类标准') {
    color = ecology.waterColor[3]
  } else if (value === 'Ⅴ类标准') {
    color = ecology.waterColor[4]
  }
  return color
}
// 获取地表水每项的level

let getSurfaceWaterSingleLevel = (value, type) => {
  let numSec
  // 获取index 取出具体的颜色和marker
  if (type === 'PH') {
    return 0
  } else if (type === '溶解氧') {
    numSec = ecology.doSec
  } else if (type === '化学需氧量') {
    numSec = ecology.codSec
  } else if (type === '总磷') {
    numSec = ecology.tpSec
  } else if (type === '氨氮') {
    numSec = ecology.nh3n
  } else if (type === '高锰酸钾') {
    numSec = ecology.codMn
  } else {

  }
  // 渲染的属性
  if (util.isRealNum(value)) {
    // 查询出index
    let index = numSec.findIndex(function (currentValue, index, arr) {
      let min = currentValue[0]
      let max = currentValue[1]
      return value >= min && value <= max
    })
    return index
  } else {
    return -1
  }
}

// 根据一个水质信息计算水质等级
let getSurfaceWaterLavel = (water) => {
  let doValue = parseFloat(water['DO浓度'])
  let codmn = parseFloat(water['CODMN浓度'])
  let tp = parseFloat(water['TP浓度'])
  let nh3nValue = parseFloat(water['NH3-N浓度'])

  let doIndex = getSurfaceWaterSingleLevel(doValue, '溶解氧')
  let nh3nIndex = getSurfaceWaterSingleLevel(nh3nValue, '氨氮')
  let codmnIndex = getSurfaceWaterSingleLevel(codmn, '高锰酸钾')
  let tpIndex = getSurfaceWaterSingleLevel(tp, '总磷')

  let finalIndex = _.max([doIndex, nh3nIndex, codmnIndex, tpIndex])
  // 返回最终的等级
  if (finalIndex === -1) {
    return [-1, '#ffffff']
  } else {
    return [ecology.waterNums[finalIndex], ecology.waterColor[finalIndex], finalIndex]
  }
}

// 获取空气质量每个参数的颜色
let getAirFieldColor = (value, type) => {
  value = parseFloat(value)
  let colors
  let numSec
  if (type === 'SO2 AQI') {
    colors = ecology.aqiColorSo2
  } else if (type === 'O3_8小时AQI') {
    colors = ecology.aqiColorO3
  } else {
    colors = ecology.aqiColors1
  }
  // 获取index 取出具体的颜色和marker
  if (type === 'AQI指数') {
    numSec = ecology.aqiSec
  } else if (type === 'NO2 AQI') {
    numSec = ecology.no2Sec
  } else if (type === 'SO2 AQI') {
    numSec = ecology.so2Sec
  } else if (type === 'O3小时AQI') {
    numSec = ecology.o3Sec
  } else if (type === 'O3_8小时AQI') {
    numSec = ecology.o38Sec
  } else if (type === 'PM10 AQI') {
    numSec = ecology.pm10Sec
  } else if (type === 'PM25小时AQI') {
    numSec = ecology.pm25Sec
  } else if (type === 'CO AQI') {
    numSec = ecology.coSec
  } else {

  }
  // 渲染的属性
  let color
  if (util.isRealNum(value)) {
    // 查询出index
    let index = numSec.findIndex(function (currentValue, index, arr) {
      let min = currentValue[0]
      let max = currentValue[1]
      return value >= min && value <= max
    })
    if (index === -1) {
      index = 0
    }
    color = colors[index]
  } else {
    color = colors[0]
  }
  return color
}

// 获取水质等级每个参数的颜色
let getWaterFieldColor = (value, type) => {
  value = parseFloat(value)
  let colors = ecology.waterColor
  let numSec
  let color
  // 获取index 取出具体的颜色和marker
  if (type === 'PH') {
    return '#ffffff'
  } else if (type === '溶解氧') {
    numSec = ecology.doSec
  } else if (type === '高锰酸盐指数') {
    numSec = ecology.codSec
  } else if (type === '总磷') {
    numSec = ecology.tpSec
  } else if (type === '氨氮') {
    numSec = ecology.nh3n
  } else {

  }
  // 渲染的属性
  if (util.isRealNum(value)) {
    // 查询出index
    let index = numSec.findIndex(function (currentValue, index, arr) {
      let min = currentValue[0]
      let max = currentValue[1]
      return value >= min && value <= max
    })
    if (index === -1) {
      index = 0
    }
    color = colors[index]
  } else {
    color = ecology.emptyColor
  }
  return color
}

export {getAqiLvel, getAqiAffect, getSurfaceWaterSingleLevel, getSurfaceWaterLavel, getAirFieldColor, getWaterFieldColor, getSurfaceWaterMockLevel}
