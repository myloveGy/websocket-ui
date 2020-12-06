import {createApi} from './request'

export const adminUserListApi = (data: any) => createApi('/admin/user/list', data)
export const adminUserCreateApi = (data: any) => createApi('/admin/user/create', data)
export const adminUserUpdateApi = (data: any) => createApi('/admin/user/update', data)
export const adminUserOfflineApi = (data: any) => createApi('/admin/user/offline', data)
export const adminUserOnlineApi = (data: any) => createApi('/admin/user/online', data)
