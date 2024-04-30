import { request } from '@/utils'

export const loginApi = (data) => {
  return request.post('/user/login', data, { noNeedToken: true })
}