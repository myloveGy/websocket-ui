import {createApi} from './request'

export * from './admin'

export const loginApi = (data: any) => createApi('/api/login', data)
export const userWsApi = () => createApi('/user/ws')
