const chars = 'ABDEFGHNPQRTYabdefhnprty2345678'

/**
 * 生成随机密码
 * @param {number} len
 * @returns {string}
 */
export const password = (len: number = 16): string => {
  let pwd = ''
  const maxPos = chars.length
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }

  return pwd
}
