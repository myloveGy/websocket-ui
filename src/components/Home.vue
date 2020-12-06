<template>
  <div class="content">
    <div class="message-content">
      <div
          v-for="(item, key) in data"
          class="message" :class="{'me': item.source === 'me', 'system': item.source !== 'me'}"
          :key="key"
      >
        <span>{{ item.content }}</span>
        <span v-if="item.id && !read.includes(item.id)" @click="reply(item.id)" class="reply">标记已读</span>
      </div>
    </div>
    <div class="form">
      <form @submit.prevent.stop="submit">
        <input type="text" v-model="message"/>
        <button type="submit" :disabled="disabled">发送</button>
        <button type="button" class="close" @click="close" :disabled="disabled">关闭</button>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {Socket, ReplyMessageResponse} from '../utils/websocket'
import {sync} from '../utils/sync'
import {userWsApi} from '../services'

interface IMesage {
  id?: number,
  source: string
  content: string
}

@Component
export default class Home extends Vue {

  private socket: Socket | undefined = undefined

  // 消息列表
  private data: IMesage[] = []

  private read: number[] = []

  // 输入消息
  private message: string = ''

  // 是否可以点击
  private disabled: boolean = true

  private created() {
    sync(async () => {
      const data = await userWsApi()
      this.socket = new Socket({
        url: 'ws://localhost:3000/ws/2020110306161001',
        query: data,
      }).on('connection', () => this.disabled = false)
          .on('close', () => this.disabled = true)
          .on('message', (content: string, contentData: any) => {
            const message: IMesage = {
              source: 'system',
              content,
            }

            if (contentData && contentData.hasOwnProperty('id')) {
              message.id = contentData.id
            }

            this.data.push(message)
          }).on('reply_message', (content: ReplyMessageResponse) => {
            if (content.status === 'success') {
              this.read.push(content.id)
            } else {
              this.$toast.error('消息回复失败:' + content.message)
            }
          })
    })
  }

  private reply(id: number) {
    if (!id) {
      this.$toast.error('消息ID不存在')
      return
    }

    if (!this.socket) {
      this.$toast.error('socket连接不存在')
      return
    }

    if (this.socket) {
      this.socket.replyMessage(id)
    }
  }

  private submit() {
    if (!this.message) {
      console.info('请输入消息内容')
      return
    }

    const data: IMesage = {
      source: 'me',
      content: this.message,
    }

    this.message = ''
    if (this.socket) {
      this.socket.send(data)
    }
    this.data.push(data)
  }

  private close() {
    if (this.socket) {
      this.socket.close('我手动关闭的')
    }
  }
}
</script>

<style lang="less">

.content {
  width: 50%;
  margin: 20px auto;
}

.me {
  color: green;
  text-align: right;
}

.system {
  color: orange;
  text-align: left;
}

.message {
  padding: 5px;

  span.reply {
    padding: 0 5px;
    border: 1px solid #13c2c2;
    border-radius: 4px;
    box-sizing: border-box;
    color: #fff;
    background-color: #13c2c2;
  }
}

.form {
  flex: 1 1 auto;
  height: 35px;
  width: 100%;
  line-height: 35px;

  form {
    width: 100%;
    display: flex;

    input {
      flex-grow: 1;
      display: block;
      height: 35px;
      padding: 4px 11px;
      margin: 0;
      background-color: #fff;
      background-image: none;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      box-sizing: border-box;
    }

    button {
      margin-left: 10px;
      height: 35px;
      width: 100px;
      display: block;
      padding: 4px 11px;
      background-image: none;
      border: 1px solid #13c2c2;
      border-radius: 4px;
      box-sizing: border-box;
      color: #fff;
      background-color: #13c2c2;

      &.close {
        background-color: #ff4d4f;
        border-color: #ff4d4f;
      }

      &[disabled] {
        color: rgba(0, 0, 0, .25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
      }
    }
  }
}
</style>
