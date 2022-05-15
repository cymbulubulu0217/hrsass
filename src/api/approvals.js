import { request } from 'screenfull'

export const startProcess = (data) => {
  return request({
    url: '/user/process/startProcess',
    method: 'POST',
    data
  })
}
