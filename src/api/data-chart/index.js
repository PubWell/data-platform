import { request } from '@/utils'

// 电量统计
export const chargeHistory = (params) => {
  return request.post('/station/analysis/chart/charge/history', params)
}

// 获取电池簇模组电压
export const getPackVoltApi = (params) => {
  return request.post('/all/pack/chart/bc/real/voltage', params)
}

// 获取电池簇模组温度
export const getPackTempApi = (params) => {
  return request.post('/all/pack/chart/bc/real/temp', params)
}

// 获取PCS电流
export const getPcsIdcApi = (params) => {
  return request.post('/all/pcs/chart/pcs/idc', params)
}