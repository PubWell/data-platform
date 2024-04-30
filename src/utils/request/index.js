import axios from 'axios'
import { resReject, resResolve, reqReject, reqResolve, resFileResolve, resChatResolve } from './interceptors'

export function createAxios(options = {}) {
  const defaultOptions = {
    timeout: 60000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resResolve, resReject)
  return service
}

export function createFileAxios(options = {}) {
  const defaultOptions = {
    timeout: 60000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resFileResolve, resReject)
  return service
}

export function createChatAxios(options = {}) {
  const defaultOptions = {
    timeout: 60000,
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resChatResolve, resReject)
  return service
}

export const request = createAxios({
  baseURL: import.meta.env.VITE_BASEURL,
})

export const fileDownloadRequest = createFileAxios({
  baseURL: import.meta.env.VITE_BASEURL,
})

export const chatRequest = createChatAxios({
  // baseURL: import.meta.env.VITE_CHAT_HTTP,
  // baseURL: 'http://112.80.56.18:17860/',
  baseURL: '/chatapi',
})
