import axios from 'axios'
import qs from 'qs'
import util from '@/common/util'
const baseURL = (process.env.NODE_ENV === 'development' ? `http://${window.document.location.host}/` : `http://${window.document.location.host}/`)
const POST_JSON_URL = '/qixing/data/crawlData'
axios.defaults.timeout = 10000 // 响应时间
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置请求头
axios.defaults.baseURL = baseURL
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  if (config.method === 'post' && config.needsQs !== 2) {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
// 返回状态判断（添加响应拦截器）
axios.interceptors.response.use((res) => {
  if (res.data) {
    switch (res.data.status) {
      case 401:
        util.getLogin()
        break
      case 404:
      case 400:
      case 500:
        break
      default:
    }
  }
  return res
}, (error) => {
  return Promise.reject(error)
})
function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

// json参数上传
function postJson (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      baseURL: baseURL,
      data: params,
      withCredentials: true,
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      needsQs: 2
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

function get (url, params, timeout = 50000) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      timeout: timeout
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch(error => {
      reject(error)
    })
  })
}
export default {
  // 获取用户信息
  async getUserInfo () {
    return get('/quake', {})
  },
  // 可视化界面获取数据
  async getDataFromIOC (ename) {
    return get('/qixing/data/legendData/' + ename)
  },
  // 七星挂牌整治时间
  async guapaishijian () {
    return this.getDataFromIOC('qixing-guapai-shijian')
  },
  // 七星挂牌整治轮播
  async guapailunbo () {
    return this.getDataFromIOC('qixing-guapai-lunbo')
  },
  // 社情民意数据
  async guapaisheqing () {
    return this.getDataFromIOC('qixing-guapai-qixing-guapai-sheqing')
  },
  // 精准治理数据
  async getGovernInfo () {
    return this.getDataFromIOC('qixing-jingzhun')
  },
  // 七星经济
  async qxeconomy () {
    return this.getDataFromIOC('qixing-jingji')
  },
  // 七星生态
  async qxecology () {
    return this.getDataFromIOC('qixing-shengtai')
  },
  // 七星默认视频
  async qxmorengshipin () {
    return this.getDataFromIOC('qixing-morengshipin')
  },
  // 七星环境治理
  async qxenvironment () {
    return this.getDataFromIOC('qixing-huanjing')
  },
  // 七星视频数量
  async qxvideoCount () {
    return this.getDataFromIOC('qixing-shipin')
  },
  // 视频落点
  async getVideos () {
    return postJson(POST_JSON_URL, {
      'tableName': 'cctv',
      'preTable': 'TBL_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'indexcode',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'cname',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'lon',
          'columnType': 'NUMBER'
        },
        {
          'columnName': 'lat',
          'columnType': 'NUMBER'
        }
      ]
    })
  },
  // 视频播放地址
  async getVideoUrl (indexCode) {
    let url = `/qixing/data-auth/hikvisionUrl?indexCode=${indexCode}`
    return get(url)
  },
  // 7日平安事件数量
  async getSevenDaySafetyNumber () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-7,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ]
    })
  },
  // 获取区域建筑信息
  async getBuildInstallation () {
    return postJson(POST_JSON_URL, {
      'tableName': 'building',
      'preTable': 'TBL_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'companyName',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'business',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'address',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'lon',
          'columnType': 'NUMBER'
        },
        {
          'columnName': 'lat',
          'columnType': 'NUMBER'
        }
      ]
    })
  },
  // 获取事件落点信息
  async getEvent () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'domainName',
          'columnType': 'COMMON'
        },
        {
          'columnName': "TO_CHAR(OCCUR_Date_String,'YYYY-MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDate'
        },
        {
          'columnName': "TO_CHAR(OCCUR_Date_String,'MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDateShot'
        },
        {
          'columnName': 'occurOrg',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'subject',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'userName',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'status',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'centerLat',
          'columnType': 'COMMON'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-3,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'order': [
        {
          'columnName': 'occurDateString',
          'direction': 'DESC'
        }
      ]
    })
  },
  // 获取热力图数据
  async getHot () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'centerLat',
          'columnType': 'COMMON'
        },
        {
          'columnName': '1',
          'columnType': 'COMPUTTE',
          'alias': 'counts'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-30,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ]
    })
  },
  // 获取视频地图落点数据
  async getMonitor () {
    return postJson(POST_JSON_URL, {
      'tableName': 'cctv',
      'preTable': 'TBL_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'indexcode',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'cname',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'lon',
          'columnType': 'NUMBER'
        },
        {
          'columnName': 'lat',
          'columnType': 'NUMBER'
        }
      ]
    })
  },
  // 获取网格数据地图落点数据
  async getGrid () {
    return postJson(POST_JSON_URL, {
      'tableName': 'grid',
      'preTable': 'TBL_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'id',
          'columnType': 'NUMBER'
        },
        {
          'columnName': 'name3',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'gridMan',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'telphone',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'householdAmount',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'residentAmount',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'keyManAmount',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'caringObjectAmount',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'keyPlaceAmount',
          'columnType': 'COMMON'
        }
      ]
    })
  },
  // 7日平安事件列表
  async getSevenSafetyList (currentPage, pageSize) {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'domainName',
          'columnType': 'COMMON'
        },
        {
          'columnName': "TO_CHAR(OCCUR_Date_String,'YYYY-MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDate'
        },
        {
          'columnName': "TO_CHAR(OCCUR_Date_String,'MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDateShot'
        },
        {
          'columnName': 'occurOrg',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'subject',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'userName',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'status',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'centerLat',
          'columnType': 'COMMON'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        // {
        //   'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
        //   'columnType': 'COMPUTTE',
        //   'columnValue': "to_char(sysdate-7,'yyyy/mm/dd')",
        //   'filterType': 'GREATER_EQUALS'
        // },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'order': [
        {
          'columnName': 'occurDateString',
          'direction': 'DESC'
        }
      ],
      'limits': {
        'pageStart': currentPage - 1,
        'pageSize': pageSize
      }
    })
  },
  // 7日12345事件数量
  async getSevenDay12345Number () {
    return postJson(POST_JSON_URL, {
      'tableName': 'xfjdjxxTmxxQixing',
      'preTable': 'VIEW_',
      'dbSource': 'BIGDATA',
      'attributes': [
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'DJRQ_STR',
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-7,'yyyy-mm-dd')",
          'filterType': 'GREATER_EQUALS'
        }
      ]
    })
  },
  // 7日12345事件列表
  async getSeven12345List (currentPage, pageSize) {
    return postJson(POST_JSON_URL, {
      'tableName': 'xfjdjxxTmxxQixing',
      'preTable': 'VIEW_',
      'dbSource': 'BIGDATA',
      'attributes': [
        {
          'columnName': 'nr',
          'columnType': 'COMMON'
        },
        {
          'columnName': "TO_CHAR(DJRQ,'YYYY-MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDate'
        },
        {
          'columnName': "TO_CHAR(DJRQ,'MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDateShot'
        },
        {
          'columnName': 'nrfl',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'xm',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'lxdh',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'status',
          'columnType': 'COMMON'
        }
      ],
      'filter': [
        // {
        //   'columnName': 'DJRQ_STR',
        //   'columnType': 'COMPUTTE',
        //   'columnValue': "to_char(sysdate-7,'yyyy-mm-dd')",
        //   'filterType': 'GREATER_EQUALS'
        // }
      ],
      'order': [
        {
          'columnName': 'occurDate',
          'direction': 'DESC'
        }
      ],
      'limits': {
        'pageStart': currentPage - 1,
        'pageSize': pageSize
      }
    })
  },
  // 7日智慧城管事件数量
  async getSevenDaySmartCityManageNumber () {
    return postJson(POST_JSON_URL, {
      'tableName': 'event',
      'preTable': 'VIEW_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ]
    })
  },
  // 7日智慧城管事件列表
  async getSevenSmartCityManageList (currentPage, pageSize) {
    return postJson(POST_JSON_URL, {
      'tableName': 'event',
      // 'preTable': 'VIEW_',
      'preTable': 'TBL_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'description',
          'columnType': 'NUMBER'
        },
        {
          'columnName': "TO_CHAR(REPORT_TIME,'YYYY-MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDate'
        },
        {
          'columnName': "TO_CHAR(REPORT_TIME,'MM-DD HH24:MI')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDateShot'
        },
        {
          'columnName': "FIRST_TYPE || '－' || SECOND_TYPE",
          'columnType': 'COMPUTTE',
          'alias': 'type'
        },
        {
          'columnName': 'source',
          'columnType': 'COMMON'
        },
        {
          'columnName': "'已办结'",
          'columnType': 'COMPUTTE',
          'alias': 'status'
        }
      ],
      'order': [{'columnName': 'reportTime', 'direction': 'DESC'}],
      'limits': {
        'pageStart': currentPage - 1,
        'pageSize': pageSize
      }
    })
  },
  // 精准治理事件类型数量
  async getEventsTypeNum () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'domainName',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-7,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'group': [
        {
          'columnName': 'domainName',
          'columnTyoe': 'COMMON'
        }
      ]
    })
  },
  // 精准治理事件分布总量
  async getEventDistriAll () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'org3',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-7,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'group': [
        {
          'columnName': 'org3',
          'columnTyoe': 'COMMON'
        }
      ]
    })
  },
  // 精准治理事件分布已办结
  async getEventDistriFinished () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': 'org3',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'status',
          'columnType': 'COMMON',
          'columnValue': '已完成',
          'filterType': 'EQUALS'
        },
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-7,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'group': [
        {
          'columnName': 'org3',
          'columnTyoe': 'COMMON'
        }
      ]
    })
  },
  // 精准治理事件上报趋势总量
  getEventTrendAll () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDate'
        },
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-30,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'group': [
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnTyoe': 'COMPUTTE'
        }
      ],
      'order': [
        {
          'columnName': 'occurDate',
          'direction': 'ASC'
        }
      ]
    })
  },
  // 精准治理事件上报趋势已办结
  getEventTrendFinished () {
    return postJson(POST_JSON_URL, {
      'tableName': 'pinganJurisdiction',
      'preTable': 'TBL_',
      'dbSource': 'IRONMAN',
      'attributes': [
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'alias': 'occurDate'
        },
        {
          'columnName': 'COUNT(1)',
          'columnType': 'COMPUTTE',
          'alias': 'amount'
        }
      ],
      'filter': [
        {
          'columnName': 'status',
          'columnType': 'COMMON',
          'columnValue': '已完成',
          'filterType': 'EQUALS'
        },
        {
          'columnName': 'centerLon',
          'columnType': 'COMMON',
          'columnValue': '',
          'filterType': 'NOT_NULL'
        },
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnType': 'COMPUTTE',
          'columnValue': "to_char(sysdate-30,'yyyy/mm/dd')",
          'filterType': 'GREATER_EQUALS'
        },
        {
          'columnName': 'org2',
          'columnType': 'COMMON',
          'columnValue': '七星街道',
          'filterType': 'EQUALS'
        }
      ],
      'group': [
        {
          'columnName': "to_char(OCCUR_DATE_STRING,'yyyy/mm/dd')",
          'columnTyoe': 'COMPUTTE'
        }
      ],
      'order': [
        {
          'columnName': 'occurDate',
          'direction': 'ASC'
        }
      ]
    })
  },
  async getGriderTeam (id) {
    return postJson(POST_JSON_URL, {
      'tableName': 'gridMan',
      'preTable': 'TBL_',
      'dbSource': 'THIS',
      'attributes': [
        {
          'columnName': 'gridId',
          'columnType': 'NUMBER'
        },
        {
          'columnName': 'duty',
          'columnType': 'COMPUTTE'
        },
        {
          'columnName': 'manName',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'description',
          'columnType': 'COMMON'
        },
        {
          'columnName': 'telphone',
          'columnType': 'COMMON'
        }
      ],
      'filter': [
        {
          'columnName': 'gridId',
          'columnType': 'NUMBER',
          'columnValue': id,
          'filterType': 'EQUALS'
        }
      ]
    })
  },
  // 湘家荡1-5号水质监测点的水质等级
  async getWaterLevel () {
    return postJson(
      POST_JSON_URL, {
        'tableName': '36Water',
        'preTable': 'TBL_',
        'dbSource': 'IRONMAN',
        'attributes': [
          {
            'columnName': 'siteName',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'cod',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'do',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'ct',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'tub',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'ph',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'temperature',
            'columnType': 'COMMON'
          },
          {
            'columnName': 'nh3n',
            'columnType': 'COMMON'
          }
        ],
        'filter': [
          {
            'columnName': 'siteName',
            'columnType': 'COMMON',
            'columnValue': '湘家荡',
            'filterType': 'LIKE'
          }
        ],
        'order': [
          {
            'columnName': 'siteName',
            'direction': 'ASC'
          }
        ]
      }
    )
  }

}
export {post, get}
