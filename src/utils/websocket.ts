import {Format} from './time'

type fnProps = () => any

type heartbeatDataProps = string | { [prop: string]: any } | fnProps

interface Options {
  url?: string,
  handler?: object | null,
  path?: string,
  query?: { [prop: string]: any },
  heartbeatDelayTime?: number,
  heartbeatData?: heartbeatDataProps
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
  private readonly webSocket: WebSocket

  // 心跳检测
  private heartbeatInterval: any = null

  // 处理函数
  private readonly handler: any

  /**
   * 配置信息
   * @private
   */
  private readonly options: Options

  /**
   * 心跳时间
   * @private
   */
  private readonly heartbeatDelayTime: number

  /**
   * 心跳数据
   * @private
   */
  private readonly heartbeatData: fnProps

  /**
   * 初始化函数
   * @param param
   * @param options
   */
  constructor(param: string | Options, options: Options = {}) {
    let url: string = ''
    if (param as Options) {
      options = param as Options
      url = ''
    } else if (typeof param === 'string') {
      url = param as string
    }

    // ws地址
    url = url || options.url || ''
    options.path = options.path || ''
    this.options = options
    const connectionUrl = this.parseUrl(url)
    console.info('WebSocket Info: connection: ' + connectionUrl)
    this.webSocket = new WebSocket(connectionUrl)
    this.webSocket.onmessage = this.handlerMessage.bind(this)
    this.webSocket.onclose = this.handlerClose.bind(this)
    this.webSocket.onopen = this.handlerOpen.bind(this)
    this.webSocket.onerror = this.handlerError.bind(this)
    this.handler = options.handler || {}
    this.heartbeatDelayTime = this.options.heartbeatDelayTime || 3e4
    if (!options.heartbeatData) {
      this.heartbeatData = () => ''
    } else if (typeof options.heartbeatData === 'function') {
      this.heartbeatData = options.heartbeatData as fnProps
    } else {
      this.heartbeatData = () => options.heartbeatData
    }
  }

  // 数据发送
  public send = (data: any, type: string = '') => {
    // websocket 已经链接
    if (this.webSocket && this.webSocket.readyState === 1) {
      const content = typeof data === 'object' ? JSON.stringify(data) : data
      const request: any = {
        type: type || this.typeMessage,
      }

      if (content) {
        request.content = content
      }

      request.time = Format(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.webSocket.send(JSON.stringify(request))
    } else {
      console.error('websocket is close', this.webSocket)
    }
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

  public close = (content: string = '') => this.send(content, this.typeClose)

  // 开启事件
  private handlerOpen = (...args: any) => {
    if (this.handler.hasOwnProperty('open')) {
      this.handler.open.call(this, ...args)
    }
  }

  private handlerError = (...args: any) => {
    if (this.handler.hasOwnProperty('error')) {
      this.handler.error.call(this, ...args)
    }
  }

  private parseUrl = (url: string) => {
    const query = []
    for (const key in this.options.query) {
      if (this.options.query.hasOwnProperty(key)) {
        query.push(`${key}=${this.options.query[key]}`)
      }
    }

    return `${url}${this.options.path}?${query.join('&')}`
  }

  // 数据接收
  private handlerMessage = (e: MessageEvent) => {

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
      }, this.heartbeatDelayTime)
    }

    this.callHandler(receiver)
  }

  // 关闭
  private handlerClose = (e: CloseEvent, ...args: any) => {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    // 自定义关闭
    if (this.handler.hasOwnProperty('close')) {
      this.handler.close.call(this, e, ...args)
    }

    console.log('WebSocket Error: connection closed (' + e.code + ')')
  }

  // 心跳
  private heartbeat = () => this.send(this.heartbeatData(), this.typeHeartbeat)

  // 调用处理函数
  private callHandler = (receiver: any) => {
    if (this.handler.hasOwnProperty(receiver.type)) {
      this.handler[receiver.type].call(this, receiver.content, receiver)
    } else {
      console.error(`WebSocket Error: 消息类型[${receiver.type}]未处理，消息内容:`, receiver.data)
    }
  }
}
