// @ts-ignore
import get from 'lodash/get'

const rulesFormat = {
  required: ':attribute 不能为空。',
  email: ':attribute 不是一个合法的邮箱。',
  string: ':attribute 必须为字符串。',
  number: ':attribute 必须是一个数字。',
  boolean: ':attribute 必须为布尔值。',
  regexp: ':attribute 格式不正确。',
  integer: ':attribute 必须是整数。',
  float: ':attribute 必须是小数。',
  array: ':attribute 必须是列表。',
  url: ':attribute 格式不正确。',
  range: {
    string: ':attribute 至少为:min个字符且最多:max个字符。',
    array: ':attribute 至少为:min个d单元且最多:max个单元。',
    number: ':attribute 最小:min且最大:max。',
  },
  min: {
    string: ':attribute 至少为 :min 个字符。',
    array: ':attribute 至少有 :min 个单元。',
    number: ':attribute 最小:min',
  },
  max: {
    string: ':attribute 不能大于 :max 个字符。',
    array: ':attribute 最多只有 :max 个单元。',
    number: ':attribute 最大:max。',
  },
}

export const rulesToArray = (rules, attribute) => {
  if (!rules) {
    return []
  }

  if (!Array.isArray(rules)) {
    rules = rules.split('|')
  }

  return rules.map(v => {
    let tmpValue = {}
    let ruleName
    // 传递的是一个对象的话直接返回
    if (typeof v === 'object') {
      tmpValue = v
      ruleName = tmpValue.type || 'required'
    } else {
      // 传递的是一个字符串、需要处理
      const arrValue = v.split(':')

      ruleName = arrValue[0]

      // 规则信息
      if (ruleName === 'required') {
        tmpValue.required = true
      } else {
        tmpValue.type = `${ruleName}`
      }

      // 处理其他属性是赋值
      if (arrValue.length > 1) {
        const tempArray = arrValue[1].split(',')
        let i = 0
        while (i <= arrValue.length) {
          if (tempArray[i] && tempArray[i + 1]) {
            tmpValue[tempArray[i]] = ['min', 'max'].includes(tempArray[i]) ? parseInt(tempArray[i + 1]) : tempArray[i + 1]
          }
          i += 2
        }
      }
    }

    // 需要修改字符串
    if (tmpValue.min && tmpValue.max) {
      ruleName = `range.${ruleName}`
    } else if (tmpValue.min) {
      ruleName = `min.${ruleName}`
    } else if (tmpValue.max) {
      ruleName = `max.${ruleName}`
    }

    // 提示信息替换
    tmpValue.message = tmpValue.message || get(rulesFormat, ruleName) || ':attribute存在问题'
    tmpValue.message = tmpValue.message.replace(':attribute', attribute)
    if (tmpValue.min) {
      tmpValue.message = tmpValue.message.replace(':min', tmpValue.min)
    }

    if (tmpValue.max) {
      tmpValue.message = tmpValue.message.replace(':max', tmpValue.max)
    }

    return tmpValue
  })
}
