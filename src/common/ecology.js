// aqi图例颜色1
const aqiColors1 = ['#6bcc06', '#fbd028', '#fe8700', '#fe0000', '#950151', '#61001d']

// aqi o3 图例颜色2
const aqiColorO3 = ['#6bcc06', '#fbd028', '#fe8700', '#fe0000', '#950151', '#ffffff']

// aqi so2图例颜色
const aqiColorSo2 = ['#6bcc06', '#fbd028', '#fe8700', '#fe0000', '#ffffff']

// 地表水监测图例颜色
const waterColor = ['#0d29ff', '#6189fd', '#6bcc06', '#fbd028', '#fe8700', '#fe0000']

// AQI 区间
const aqiSec = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 9999999]]
// co区间
const coSec = [[0, 5], [6, 10], [11, 35], [36, 60], [61, 90], [91, 9999999]]
const coNums = [0, 5, 10, 35, 60, 90]

// pm 2.5 24小时
const pm2524Sec = [[0, 35], [36, 75], [76, 115], [116, 150], [151, 250], [251, 9999999]]
const pm2524Nums = [0, 35, 75, 115, 150, 250]

// pm 2.5
const pm25Sec = [[0, 35], [36, 75], [76, 115], [116, 150], [151, 250], [251, 9999999]]
const pm25Nums = [0, 35, 75, 115, 150, 250]
// pm10 24小时
const pm1024Sec = [[0, 50], [51, 150], [151, 250], [251, 350], [351, 420], [421, 9999999]]
const pm1024Nums = [0, 50, 150, 250, 350, 420]

// pm10
const pm10Sec = [[0, 50], [51, 150], [151, 250], [251, 350], [351, 420], [421, 9999999]]
const pm10Nums = [0, 50, 150, 250, 350, 420]

// o3 八小时
const o38Sec = [[0, 100], [101, 160], [161, 215], [216, 265], [266, 800], [800, 9999999]]
const o38Nums = [0, 100, 160, 215, 265, 800]

// o3
const o3Sec = [[0, 100], [101, 200], [201, 300], [301, 400], [401, 800], [800, 9999999]]
const o3Nums = [0, 160, 200, 300, 400, 800]

// no2
const no2Sec = [[0, 100], [101, 200], [201, 700], [701, 1200], [1201, 2340], [2341, 9999999]]
const no2Nums = [0, 100, 200, 700, 1200, 2340]

// so2
const so2Sec = [[0, 150], [151, 500], [501, 650], [651, 800], [801, 9999999]]
const so2Nums = [0, 150, 500, 650, 800]

// 水质nums
const waterNums = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', '劣Ⅴ']

// ph 不计算等级
// 溶解氧 区间
const doSec = [[7.5, 99999], [6, 7.49], [5, 5.99], [3, 4.99], [2, 2.99], [0, 2]]
// 化学需氧量
const codSec = [[0, 15], [15, 15], [15.01, 20], [20.01, 30], [30.01, 40], [40.01, 9999]]
// 高锰酸钾
const codMn = [[0, 2], [2.001, 4], [4.0001, 6], [6.0001, 10], [10.001, 15], [15.001, 9999]]
// TP总磷指数区间
const tpSec = [[0, 0.020], [0.021, 0.100], [0.101, 0.200], [0.201, 0.300], [0.301, 0.400], [0.401, 9999]]
// 氨氮 区间指数
const nh3n = [[0, 0.150], [0.151, 0.500], [0.501, 1.000], [1.001, 1.500], [1.501, 2.000], [2.001, 9999]]

// 没有数值时候的颜色
const emptyColor = '#ffffff'

export {aqiColors1, aqiColorO3, aqiColorSo2, waterColor, aqiSec, coSec, coNums, pm2524Sec, pm2524Nums, pm25Sec,
  pm25Nums, pm1024Sec, pm1024Nums, pm10Sec, pm10Nums, o38Sec, o38Nums, o3Sec, o3Nums, no2Sec, no2Nums, so2Sec, so2Nums, waterNums, doSec, codSec, tpSec, nh3n, emptyColor,
  codMn
}
