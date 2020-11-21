import {Format} from './time'

interface Options {
  handler?: object | null,
  path?: string,
  query?: object,
}

export default class Socket {

  /**
   * 消息类型
   */
  public typeConnection: string = 'connection' // 建立链接
  public typeHeartbeat: string = 'heartbeat' // 发送心跳
  public typeMessage: string = 'message' // 发送消息
  public typeClose: string = 'close' // 发送主动关闭
  public typeReplyMessage: string = 'reply_message' // 发送消息回复

  // socket 连接
  private webSocket: WebSocket

  // 心跳检测
  private heartbeatInterval: any = null

  // 处理函数
  private handler: any

  /**
   * 配置信息
   * @private
   */
  private readonly options: Options

  /**
   * 初始化函数
   * @param url
   * @param options
   */
  constructor(url: string, options: Options) {
    // ws地址
    this.options = options
    console.info('WebSocket Info: connection: ' + url)
    this.webSocket = new WebSocket(this.parseUrl(url))
    this.webSocket.onmessage = this.message.bind(this)
    this.webSocket.onclose = this.close.bind(this)
    this.webSocket.onopen = this.open.bind(this)
    this.handler = options.handler
  }

  // 数据发送
  public send = (data: any, type: string = '') => {

    const content = typeof data === 'object' ? JSON.stringify(data) : data

    let request: any = {
      type: type || this.typeMessage,
      time: Format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
    }

    if (content) {
      request.content = content
    }

    this.webSocket.send(JSON.stringify(request))
  }

  /**
   * 监听对象
   * @param type
   * @param fn
   */
  public on = (type: string, fn: any): this => {
    this.handler[type] = fn
    return this
  }

  // 开启事件
  private open = (...args: any) => {
    if (this.handler.hasOwnProperty('open')) {
      this.handler.open.call(this, ...args)
    }
  }

  private parseUrl = (url: string) => {
    const query = []
    for (const key in this.options.query) {
      query.push(`${key}=${this.options.query[key]}`)
    }

    return `${url}${this.options.path}?${query.join('&')}`
  }

  // 数据接收
  private message = (e: MessageEvent) => {

    if (!e.data) {
      console.info('出错了')
      return
    }

    // 接收消息的内容
    const receiver = JSON.parse(e.data)

    // 链接成功，需要上报心跳了
    if (receiver.type === this.typeConnection) {
      this.heartbeatInterval = setInterval(() => {
        this.heartbeat()
      }, 3e4)
    }

    this.callHandler(receiver)
  }

  // 关闭
  private close = (e: CloseEvent) => {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    console.log('WebSocket Error: connection closed (' + e.code + ')')
  }

  // 心跳
  private heartbeat = () => this.send('', this.typeHeartbeat)

  // 调用处理函数
  private callHandler = (receiver: any) => {
    if (this.handler.hasOwnProperty(receiver.type)) {
      this.handler[receiver.type].call(this, receiver.data, receiver)
    } else {
      console.error(`WebSocket Error: 消息类型[${receiver.type}]未处理，消息内容:`, receiver.data)
    }
  }
}
