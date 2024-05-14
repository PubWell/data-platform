import { getToken } from '@/utils'
import { resolveResError } from './helpers'
import { lStorage } from '@/utils'

export function reqResolve(config) {
  const lang = lStorage.get('lang')
  if (lang) {
    config.headers['Accept-Language'] = lang
  }

  // 处理不需要token的请求
  if (config.noNeedToken) {
    return config
  }

  // const token = "7342eeaa-e86c-4bc2-baf3-69b929bb6cde"
  const token = getToken()
  if (!token) {
    return Promise.reject({ code: 401, message: '登录已过期，请重新登录！' })
  }

  /**
   * * 加上 token
   * ! 认证方案: JWT Bearer
   */
  config.headers.token = token

  return config
}

export function reqReject(error) {
  return Promise.reject(error)
}

export function resResolve(response) {
  // TODO: 处理不同的 response.headers
  const { data, status, config, statusText } = response
  if (data?.code !== 0) {
    const code = data?.code ?? status
    if (data.code === 2) {
      localStorage.removeItem('VUE_NAIVE_ADMIN_ACCESS_TOKEN')
      location.reload()
    }
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.message ?? statusText)

    /** 需要错误提醒 */
    // to do
    // !config.noNeedTip && $message.error(message)
    return Promise.reject({ code, message, error: data || response })
  }
  return Promise.resolve(data)
}

export function resFileResolve(response) {
  return Promise.resolve(response)
}

export function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    // to do
    // $message?.error(message)
    return Promise.reject({ code, message, error })
  }
  const { data, status, config } = error.response
  const code = data?.code ?? status
  const message = resolveResError(code, data?.message ?? error.message)
  /** 需要错误提醒 */
  !config?.noNeedTip && $message.error(message)
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}

export function resChatResolve(response) {
  const { data, status } = response
  if(status == 200){
    return Promise.resolve(data)
  }
  return Promise.reject({ status, error: data || response })
}