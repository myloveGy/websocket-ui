// @ts-ignore
import get from 'lodash/get'

export class LocalStore {

  private readonly name: string

  constructor(name: string) {
    this.name = name
  }

  public flush = (key: any = null): any => {
    const returnValue = key === null ? null : this.fetch(key)
    localStorage.removeItem(this.name)
    return returnValue
  }

  public fetch(key: string = '', defaultValue: any = null): any {
    const data = localStorage.getItem(this.name)
    if (!data) {
      return defaultValue
    }

    if (data[0] !== '{') {
      this.flush()
    }

    const values = JSON.parse(data)

    // 设置了有效时间的数据
    if (values.hasOwnProperty('value') && values.hasOwnProperty('expireTime')) {
      // 有超时时间
      if (values.expireTime !== 0 && (new Date()).getTime() > values.expireTime) {
        this.flush()
        return defaultValue
      }

      return key ? get(values.value, key, defaultValue) : values.value
    }

    return key ? get(values, key, defaultValue) : values
  }

  /**
   * 保存信息
   * @param data 数据信息
   * @param expireTime
   */
  public save = (data: any, expireTime: number = 0) => {
    // 有效时间
    if (expireTime > 0) {
      expireTime = (new Date()).getTime() + expireTime * 1000
    }

    localStorage.setItem(this.name, JSON.stringify({
      value: {
        ...this.fetch(),
        ...data,
      },
      expireTime,
    }))
  }
}
