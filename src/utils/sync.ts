import {message, notification} from 'ant-design-vue'

export const sync = (fn: any, loading: boolean | string = true) => {
  if (loading) {
    message.loading(typeof loading === 'string' ? loading : '加载中...')
  }

  return fn().catch((error: any) => {
    notification.error({
      message: '错误提示',
      description: error.message,
    })
  }).finally(() => loading && message.destroy())
}
