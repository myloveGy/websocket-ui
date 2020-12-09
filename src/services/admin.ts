import {createApi} from './request'

// 用户相关
export const adminUserListApi = (data: any) => createApi('/admin/user/list', data)
export const adminUserCreateApi = (data: any) => createApi('/admin/user/create', data)
export const adminUserUpdateApi = (data: any) => createApi('/admin/user/update', data)
export const adminUserOfflineApi = (data: any) => createApi('/admin/user/offline', data)
export const adminUserOnlineApi = (data: any) => createApi('/admin/user/online', data)

// 应用相关
export const adminAppListApi = (data: any) => createApi('/admin/app/list', data)
export const adminAppCreateApi = (data: any) => createApi('/admin/app/create', data)
export const adminAppUpdateApi = (data: any) => createApi('/admin/app/update', data)
export const adminAppOfflineApi = (data: any) => createApi('/admin/app/offline', data)
export const adminAppOnlineApi = (data: any) => createApi('/admin/app/online', data)
